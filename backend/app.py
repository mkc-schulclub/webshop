from os import getenv

from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from starlette.middleware.cors import CORSMiddleware

from extras import ShopException, LOGGER, boolFromString
from routers import __all__

app = FastAPI(
    title="Shop API",
    description="Schulclub Webshop API",
    version="0.2.7"
)


@app.exception_handler(ShopException)
async def shopexception(request: Request, exc: ShopException):
    LOGGER.warning(f"Faced ShopException: [{exc.code}] {exc.debug or exc.message}")
    return JSONResponse(
        status_code=400,
        content={
            "api:statuscode": exc.code,
            "api:message": exc.message,
            "api:debug": exc.debug if boolFromString(getenv("DEBUG")) else "",
        },
    )

app.add_middleware(CORSMiddleware, allow_origins=["*"],  allow_credentials=True, allow_methods=["*"], allow_headers=["*"], )

for router in __all__:
    app.include_router(router)