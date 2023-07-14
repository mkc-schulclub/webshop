from logging import getLogger
from typing import Optional, List, Dict, Tuple

from pydantic import BaseModel
from fastapi import APIRouter, Depends

from extras import db, validate_session, validate_sig

logger = getLogger(__name__)

router = APIRouter(
    prefix="/api/v1",
    tags=["shop"],
    responses={404: {"description": "Not found"}},
)

class Product(BaseModel):
    # TODO: #3 finish adding attributes
    name:       str
    prod_id:    str
    variations: Optional[List[List[str]]]   = {}
    colors:     Optional[List[str]]         = []
    sizes:      Optional[List[str]]         = []
    motives:    Optional[List[List[str]]]         = []


@router.get("/items")
async def fetchItems(skip: int = 0, limit: int = 20):
    cursor = db.items.find({}).skip(skip).limit(limit)
    items = await cursor.to_list(limit)
    return [Product(**item) for item in items]


@router.post(
    "/items",
    response_class=Product,
    dependencies=[Depends(validate_sig), Depends(validate_session)]
)
async def addItem(item: Product):
    await db.insert_one(item)
    return item