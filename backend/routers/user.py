from logging import getLogger

import bcrypt
from fastapi import APIRouter, Depends, Request

from extras import (ShopException, db, isAdmin, statusCodes,
                    validateSession, validateSig, User)

logger = getLogger(__name__)

router = APIRouter(
    prefix="/api/v1/user",
    tags=["shop"],
    responses={404: {"description": "Not found"}},
)


@router.post(
    "/user",
    dependencies=[Depends(validateSig), Depends(validateSession), Depends(isAdmin)]
)
async def addUser(request: Request):
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

    if not out["name"] or not out["password"]:
        raise ShopException(
            statusCodes.INVALID_BODY,
            "Invalid Body",
            "name or password empty"
        )
    
    user = await db.users.find_one({"name": out["name"]})
    
    if user:
        raise ShopException(
            statusCodes.ITEM_EXISTS,
            "User already Exists",
            "User already found in database"
        )
    
    password = bcrypt.hashpw(out["password"].encode(), bcrypt.gensalt()).decode()

    await db.users.insert_one({
        "name": out["name"],
        "secret": password
    })
    
    return {"api:statuscode": statusCodes.SUCCESS}


@router.get(
    "/",
    dependencies=[Depends(validateSession)]
)
async def getUsers(skip: int = 0, limit: int = 20):
    cursor = db.users.find({}).skip(skip).limit(limit)
    items = await cursor.to_list(limit)
    return [
        User(name=item["name"], _id=str(item["_id"]))
        for item in items
    ]


@router.delete(
    "/",
    dependencies=[Depends(validateSession), Depends(isAdmin)]
)
async def removeUser(request: Request):
    try: out: dict[str, str] = await request.json()
    except Exception: raise ShopException(
        statusCodes.INVALID_BODY,
        "Invalid Body",
        "Couldn't json parse"
    )
    if "_id" not in out and "name" not in out:
        raise ShopException(
            statusCodes.INVALID_BODY,
            "Invalid Body",
            "_id or name missing from body"
        )
    nameOrId = {"_id": out["_id"]} if "_id" in out else {"name": out["name"]}
    maybeUser = db.users.find_one(nameOrId)
    if not maybeUser:
        raise ShopException(
            statusCodes.NOT_FOUND,
            "User Not Found",
            "Specified User doesn't exist in database"
        )
    await db.users.remove_one(nameOrId)
