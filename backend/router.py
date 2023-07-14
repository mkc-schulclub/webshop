from datetime import datetime, timedelta
from logging import getLogger
import os
import time
from typing import List, Optional

import bcrypt
from aiohttp import ClientSession, FormData
from fastapi import APIRouter, Depends, Request
from fillpdf import fillpdfs
from pydantic import BaseModel

from extras import (
    ShopException,
    db,
    generate_session,
    validate_session,
    validate_sig
)

logger = getLogger(__name__)

router = APIRouter(
    prefix="/api/v1",
    tags=["shop"],
    responses={404: {"description": "Not found"}},
)


async def upload(session: ClientSession, up_file: str) -> dict:
    headers = {
		"Authorization": os.getenv("ZIPLINE_AUTH"),
		"Format": "UUID",
        "Expires-At": "date=" + (datetime.now() + timedelta(days=1)).strftime("%Y-%m-%dT%H:%M:%S.%fZ")
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


class Product(BaseModel):
    # TODO: #3 finish adding attributes
    name:       str
    prod_id:    str
    price:      str
    variations: Optional[List[List[str]]] = {}
    colors:     Optional[List[str]]       = []
    sizes:      Optional[List[str]]       = []
    motives:    Optional[List[List[str]]] = []

class Item(BaseModel):
    name:      str
    prod_id:   str
    amount:    int                      = 1
    variation: Optional[dict[str, str]] = {}
    color:     Optional[str]            = ""
    size:      Optional[str]            = ""
    motive:    Optional[dict[str, str]] = {}


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

@router.options(
    "/order"
)
async def order_preflight():
    return {}

@router.post(
    "/order",
    dependencies=[Depends(validate_sig)],
)
async def order(items: List[Item]):
    data  = {}
    total = 0
    if not items or len(items) > 5:
        raise ShopException(9001, "Over nine THOUUSAAND", "Either too many items or none at all")
    for index, item in enumerate(items):
        product = await db.items.find_one({"prod_id": item.prod_id})
        if not product:
            raise ShopException(404, "Non Existant Product", "Tried to specify a product that doesnt exist in the database")
        maybe_variation = (item.motive.keys() or item.variation.keys())
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
    return response


@router.post(
    "/user",
    dependencies=[Depends(validate_sig), Depends(validate_session)]
)
async def add_user(request: Request):
    try: out: dict[str, str] = await request.json()
    except Exception: raise ShopException(455, "Invalid Body", "Couldn't json parse")
    if not all(key in out.keys() for key in ["name", "password"]) and all(
        isinstance(out[key], str) for key in ["name", "password"]
    ):
        raise ShopException(455, "Invalid Body", "name or password missing or of invalid type")

    if not out["name"] or not out["password"]:
        raise ShopException(455, "Invalid Body", "name or password empty")
    
    user = await db.users.find_one({"name": out["name"]})
    
    if user:
        raise ShopException(457, "User already Exists", "User already found in database")
    
    password = bcrypt.hashpw(out["password"].encode(), bcrypt.gensalt()).decode()

    await db.users.insert_one({
        "name": out["name"],
        "secret": password
    })
    
    return {}
    


@router.post(
    "/login",
    dependencies=[Depends(validate_sig)]
)
async def login(request: Request):
    try: out: dict[str, str] = await request.json()
    except Exception: raise ShopException(455, "Invalid Body", "Couldn't json parse")
    if not all(key in out.keys() for key in ["name", "password"]) and all(
        isinstance(out[key], str) for key in ["name", "password"]
    ):
        raise ShopException(455, "Invalid Body", "name or password missing or of invalid type")
    
    user = await db.users.find_one({"name": out["name"]})
    
    if not user:
        raise ShopException(456, "Invalid Username or Password", "Username not known")
    
    password = out["password"].encode()
    
    if not bcrypt.checkpw(password, user["secret"].encode()):
        raise ShopException(456, "Invalid Username or Password", "Bcrypt check failed")
        
    user["sid"] = generate_session(str(user["_id"]))
    
    await db.users.update_one(
        {"name": out["name"]}, {"$set": {"sid": user["sid"]}}
    )
    del user["_id"]
    return user
