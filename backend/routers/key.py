from logging import getLogger
from hashlib import sha256

from fastapi import APIRouter


logger = getLogger(__name__)

router = APIRouter(
    prefix="/api/v1/key",
    tags=["shop"],
    responses={404: {"description": "Not found"}},
)


@router.get(
    "",
)
async def getKeyBase():
    # TODO: #8 Remove this from code
    return {
        "keyBase": sha256(bytes.fromhex("5F66452D72BBA5C6BD39BDACE83E0EF2")).hexdigest()
    }