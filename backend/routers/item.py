from logging import getLogger

from fastapi import APIRouter, Depends

from extras import (
    ShopException,
    db,
    validateSession,
    validateSig,
    statusCodes,
    Product
)

logger = getLogger(__name__)

router = APIRouter(
    prefix="/api/v1/items",
    tags=["shop"],
    responses={404: {"description": "Not found"}},
)


@router.get("/")
async def fetchItems(skip: int = 0, limit: int = 20):
    cursor = db.items.find({}).skip(skip).limit(limit)
    items = await cursor.to_list(limit)
    return [Product(**item) for item in items]


@router.post(
    "/",
    dependencies=[Depends(validateSig), Depends(validateSession)]
)
async def addItem(item: Product):
    if await db.items.find_one({"prod_id": item.prod_id}):
        raise ShopException(
            statusCodes.ITEM_EXISTS,
            "Item Already Exists",
            "Tried to insert item, which already exists in DB"
        )
    await db.items.insert_one(item.dict())
    return item.dict() | {"api:statuscode": statusCodes.SUCCESS}


@router.patch(
    "/",
    dependencies=[Depends(validateSig), Depends(validateSession)]
)
async def updateItem(item: Product):
    product = await db.items.find_one({"prod_id": item.prod_id})
    if not product:
        raise ShopException(
            statusCodes.NOT_FOUND,
            "Product not Found"
            "prod_id not in database"
        )
    
    await db.items.update_one({"prod_id: item.prod_id"}, {k: v for k, v in item.dict().items() if v})
    return {k: v if v else product[k] for k, v in item.dict().items()} | {"api:statuscode": statusCodes.SUCCESS}


@router.delete(
    "/",
    dependencies=[Depends(validateSig), Depends(validateSession)]
)
async def removeItem(item: Product):
    product = await db.items.find_one({"prod_id": item.prod_id})
    if not product:
        raise ShopException(
            statusCodes.NOT_FOUND,
            "Product not Found",
            "prod_id not in database"
        )
    
    await db.items.remove_one({"prod_id: item.prod_id"})
    return {"api:statuscode": statusCodes.SUCCESS}
