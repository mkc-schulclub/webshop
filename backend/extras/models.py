from datetime import datetime
from typing import Optional, List

from pydantic import BaseModel

class Product(BaseModel):
    name:       str                       = ""
    prod_id:    str
    price:      int                       = 0
    variations: Optional[List[List[str]]] = []
    colors:     Optional[List[str]]       = []
    sizes:      Optional[List[str]]       = []
    motives:    Optional[List[List[str]]] = []
    image:      Optional[bytes]           = b""


class Item(BaseModel):
    name:      str
    prod_id:   str
    amount:    int                      = 1
    variation: Optional[dict[str, str]] = {}
    motive:    Optional[dict[str, str]] = {}
    color:     Optional[str]            = ""
    size:      Optional[str]            = ""


class Order(BaseModel):
    items: List[Item]
    date: datetime
    url: str


class User(BaseModel):
    name: str
    _id: str
    admin: bool = False
