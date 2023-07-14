import os
from base64 import b64decode
from hashlib import sha256
from hmac import HMAC

import dotenv
import jwt
from fastapi import Header, Request
from motor.motor_asyncio import AsyncIOMotorClient
from typing import Callable

dotenv.load_dotenv(".env")

db = AsyncIOMotorClient(os.getenv("MONGO"), serverSelectionTimeoutMS=5000)["clubshop"]


bool_from_string: Callable[[str], bool] = lambda string: (
    string.casefold() in ['true', '1', 't', 'y', 'yes', 'yeah','yup', 'certainly', 'uh-huh']
)

SES_KEY = os.getenv("SES_KEY")
SIG_KEY = os.getenv("SIG_KEY")
PRE = os.getenv("PRE")
CHECK =  bool_from_string(os.getenv("CHECK_SIG", "false"))


class ShopException(Exception):
    def __init__(self, code: int, message: str, debug: str = ""):
        self.code = code
        self.message = message
        self.debug = debug


async def validate_sig(request: Request, ndc_msg_sig: str = Header(default="")):
    if not CHECK:
        return True
    if len(b64decode(ndc_msg_sig).hex()) < 42 or not b64decode(
        ndc_msg_sig
    ).hex().startswith(PRE):
        raise ShopException(
            451,
            "Invalid Signature",
            "Signature not correct length or doesn't start with prefix.",
        )
    mac = HMAC(bytes.fromhex(SIG_KEY), await request.body(), sha256)
    if mac.hexdigest().casefold() != b64decode(ndc_msg_sig.encode()).hex()[2:]:
        raise ShopException(451, "Invalid Signature", "Signature not correct.")


async def validate_session(ndcauth: str = Header(default="")) -> None:
    if not ndcauth:
        raise ShopException(
            404, "Invalid Session", "NDCAUTH header is missing, try login."
        )
    try:
        jwt.decode(ndcauth.removeprefix("sid="), SES_KEY, algorithms=["HS256"])
        if not await db.users.find_one({"sid": ndcauth.removeprefix("sid=")}):
            raise ShopException(404, "Invalid Session", "JWT validation succeeded, but session was removed from db")
    except jwt.PyJWTError as exc:
        raise ShopException(404, "Invalid Session", f"JWT validation failed: {exc}")