import os

import dotenv
import uvicorn
from coloredlogs import install

from extras import boolFromString

dotenv.load_dotenv("app/.env")
install()

if __name__ == "__main__":
    port = int(os.getenv("PORT", 1337))
    host = os.getenv("HOST", "0.0.0.0")
    if boolFromString(os.getenv("USE_SSL", "false")):
        uvicorn.run(
            "app:app",
            port=port,
            host=host,
            ssl_keyfile=os.getenv("KEY_PATH"),
            ssl_certfile=os.getenv("CRT_PATH"),
            reload=boolFromString(os.getenv("DEBUG"))
        )
    else:
        uvicorn.run(
            "app:app",
            port=port,
            host=host,
            reload=boolFromString(os.getenv("DEBUG"))
        )