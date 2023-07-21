from logging import getLogger

import bcrypt
from fastapi import APIRouter, Depends, Header, Request
import jwt

from extras import (ShopException, db, generateSession, statusCodes,
                    validateSession, validateSig)


logger = getLogger(__name__)

router = APIRouter(
    prefix="/api/v1",
    tags=["shop"],
    responses={404: {"description": "Not found"}},
)


@router.post(
    "/login",
    dependencies=[Depends(validateSig)]
)
async def login(request: Request):
    try: out: dict[str, str] = await request.json()
    except Exception: raise ShopException(
        statusCodes.INVALID_BODY,
        "Invalid Body",
        "Couldn't json parse"
    )
    if not all(key in out.keys() for key in ["name", "password"]) and all(
        isinstance(out[key], str) for key in ["name", "password"]
    ):
        raise ShopException(
            statusCodes.INVALID_BODY,
            "Invalid Body",
            "name or password missing or of invalid type"
        )
    
    user = await db.users.find_one({"name": out["name"]})
    
    if not user:
        raise ShopException(
            statusCodes.WRONG_PASS_OR_NAME,
            "Invalid Username or Password",
            "Username not known"
        )
    
    password = out["password"].encode()
    
    if not bcrypt.checkpw(password, user["secret"].encode()):
        raise ShopException(
            statusCodes.WRONG_PASS_OR_NAME,
            "Invalid Username or Password",
            "Bcrypt check failed"
        )
        
    user["sid"] = generateSession(str(user["_id"]))
    
    await db.users.update_one(
        {"_id": str(user["_id"])}, {"$set": {"sid": user["sid"]}}
    )
    
    del user["_id"]
    
    return user | {"api:statuscode": statusCodes.SUCCESS}

@router.post(
    "/logout",
    dependencies=[Depends(validateSession)]
)
async def logout(ndcauth: str = Header(...)):
    await db.users.update_one(
        {"sid": ndcauth.removeprefix("sid=")}, {"$set": {"sid": ""}}
    )
    
    return {"api:statuscode": statusCodes.SUCCESS}
