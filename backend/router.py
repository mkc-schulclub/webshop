from logging import getLogger
from typing import Optional

from pydantic import BaseModel
from fastapi import APIRouter, Depends

from extras import db, validate_session, validate_sig

logger = getLogger(__name__)

router = APIRouter(
    prefix="/api/v1",
    tags=["shop"],
    responses={404: {"description": "Not found"}},
)

class Item(BaseModel):
    # TODO: #3 finish adding attributes
    name:       str
    color:      Optional[str]   = ""
    size:       Optional[str]   = ""
    has_size:   Optional[bool]  = False
    has_color:  Optional[bool]  = False
    motive:     Optional[str]   = ""


@router.get("/items")
async def fetchItems(skip: int = 0, limit: int = 20):
    cursor = db.items.find({}).skip(skip).limit(limit)
    items = await cursor.to_list(limit)
    return [Item(**item) for item in items]


@router.post(
    "/items",
    response_class=Item,
    dependencies=[Depends(validate_sig), Depends(validate_session)]
)
async def addItem(item: Item):
    await db.insert_one(item)
    return item