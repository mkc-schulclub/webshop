import os
from base64 import b64decode
from hashlib import sha256
from hmac import HMAC
from time import time

import dotenv
import jwt
from fastapi import Header, Request
from motor.motor_asyncio import AsyncIOMotorClient
from typing import Callable

from .codes import statusCodes

dotenv.load_dotenv(".env")

db = AsyncIOMotorClient(os.getenv("MONGO"), serverSelectionTimeoutMS=5000)[
    "clubshop"]


boolFromString: Callable[[str], bool] = lambda string: (
    string.casefold() in ['true', '1', 't', 'y', 'yes',
                          'yeah', 'yup', 'certainly', 'uh-huh']
)

SES_KEY = os.getenv("SES_KEY")
SIG_KEY = os.getenv("SIG_KEY")
PRE = os.getenv("PRE")
CHECK = boolFromString(os.getenv("CHECK_SIG", "false"))


class ShopException(Exception):
    def __init__(self, code: int, message: str, debug: str = ""):
        self.code = code
        self.message = message
        self.debug = debug


async def validateSig(request: Request, ndc_msg_sig: str = Header(default="")):
    if not CHECK:
        return True
    if len(b64decode(ndc_msg_sig).hex()) < 42 or not b64decode(
        ndc_msg_sig
    ).hex().startswith(PRE):
        raise ShopException(
            statusCodes.INVALID_SIGNATURE,
            "Invalid Signature",
            "Signature not correct length or doesn't start with prefix.",
        )
    mac = HMAC(SIG_KEY.encode(), await request.body(), sha256)
    if mac.hexdigest().casefold() != b64decode(ndc_msg_sig.encode()).hex()[2:]:
        raise ShopException(
            statusCodes.INVALID_SIGNATURE,
            "Invalid Signature",
            "Signature not correct."
        )


async def validateSession(ndcauth: str = Header(default="")) -> bool:
    if not ndcauth:
        raise ShopException(
            statusCodes.INVALID_SESSION,
            "Invalid Session",
            "NDCAUTH header is missing, try login."
        )
    try:
        jwt.decode(ndcauth.removeprefix("sid="), SES_KEY, algorithms=["HS256"])
        if not await db.users.find_one({"sid": ndcauth.removeprefix("sid=")}):
            raise ShopException(
                statusCodes.INVALID_SESSION,
                "Invalid Session",
                "JWT validation succeeded, but session was removed from db"
            )
    except jwt.PyJWTError as exc:
        raise ShopException(
            statusCodes.INVALID_SESSION,
            "Invalid Session",
            f"JWT validation failed: {exc}"
        )
    return True


async def isAdmin(ndcauth: str = Header(default="")) -> bool:
    validateSession(ndcauth)
    user = await db.users.find_one({"sid": ndcauth.removeprefix("sid=")})
    if not user["admin"]:
        raise ShopException(
            statusCodes.MISSING_PERMISSIONs,
            "This Endpoint is Admin Only",
            "User tried to call an endpoint which is admin-only"
        )
    return user["admin"]


def _time(): return int(time())


def generateSession(uid: str) -> str:
    return jwt.encode(
        {
            "exp": 86400 + _time(),  # * Session expires after 1 day
            "iat": _time(),
            "nbf": _time(),
            "uid": uid,
        },
        key=SES_KEY,
    )
