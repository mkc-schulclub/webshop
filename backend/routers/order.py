from datetime import datetime, timedelta
from logging import getLogger
import os
import time
from typing import List

from aiohttp import ClientSession, FormData
from fastapi import APIRouter, Depends
from fillpdf import fillpdfs

from extras import (
    ShopException,
    statusCodes,
    Item,
    db,
    validateSig,
    validateSession,
    Order
)

logger = getLogger(__name__)

router = APIRouter(
    prefix="/api/v1/order",
    tags=["shop"],
    responses={404: {"description": "Not found"}},
)

async def upload(session: ClientSession, up_file: str) -> dict:
    headers = {
		"Authorization": os.getenv("ZIPLINE_AUTH"),
		"Format": "UUID",
        "Expires-At": "1h"
	}
    data = FormData()
    with open(up_file, "rb") as f:
        data.add_field('file', f, filename='Bestellformular.pdf', content_type='application/pdf')
        upload_url = "http://frog.lowkey.gay/zipline/api/upload"
        async with session.post(upload_url, headers=headers, data=data) as res:
            out = await res.json()
            if str(res.status).startswith("2"):
                return out
            raise ShopException(512, "Error during PDF Upload", out)


@router.post(
    "",
    dependencies=[Depends(validateSig)],
)
async def order(items: List[Item]):
    data  = {}
    total = 0
    if not items or len(items) > 5:
        raise ShopException(
            statusCodes.TOO_MANY_ITEMS,
            "Over nine THOUUSAAND",
            "Either too many items or none at all"
        )
    for index, item in enumerate(items):
        product = await db.items.find_one({"prod_id": item.prod_id})
        if not product:
            raise ShopException(
                statusCodes.NOT_FOUND,
                "Non Existant Product",
                "Tried to specify a product that doesnt exist in the database"
            )
        maybe_variation = getattr(item.motive or item.variation, "keys", lambda: False)()
        if maybe_variation:
            maybe_variation = list(maybe_variation)[0]
        else:
            maybe_variation = ""
        data[f"ProduktnrRow{index+1}"] = f"{item.prod_id}{maybe_variation}"
        data[f"FarbeRow{index+1}"]  = f"{item.color or '---'}"
        data[f"GrößeRow{index+1}"]  = f"{item.size or '---'}"
        data[f"AnzahlRow{index+1}"] = f"{item.amount}"
        data[f"PreisRow{index+1}"] = f"{item.amount * product['price']}"
        total += item.amount * product['price']
    data["Price"] = str(total)
    data["Date1"] = data["Date2"] = time.strftime("%d.%m.%Y")
    fillpdfs.write_fillable_pdf("backend/static/formular.pdf", "out.pdf", data)
    fillpdfs.flatten_pdf("out.pdf", "out-flat.pdf")
    os.remove("out.pdf")
    async with ClientSession() as session:
        response = await upload(session, "out-flat.pdf")
    await db.orders.insert_one({"items": [item.dict() for item in items], "date": datetime.now(), "url": response["files"][0]})
    os.remove("out-flat.pdf")
    return response | {"api:statuscode": statusCodes.SUCCESS}


@router.get(
    "",
    dependencies=[Depends(validateSession)]
)
async def getOrders(skip: int = 0, limit: int = 20):
    cursor = db.orders.find({}).skip(skip).limit(limit)
    items = await cursor.to_list(limit)
    return [Order(**item) for item in items]
