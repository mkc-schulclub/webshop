from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse

from extras import ShopException, LOGGER
from router import router

app = FastAPI(
    title="Shop API",
    description="Schulclub Webshop API",
    version="0.1.0"
)


@app.exception_handler(ShopException)
async def shopexception(request: Request, exc: ShopException):
    LOGGER.warning(f"Faced ShopException: [{exc.code}] {exc.debug or exc.message}")
    return JSONResponse(
        status_code=418,
        content={
            "api:statuscode": exc.code,
            "api:message": exc.message,
            "api:debug": exc.debug,
        },
    )


app.include_router(router)