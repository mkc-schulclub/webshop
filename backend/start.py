import os

import dotenv
import uvicorn
from coloredlogs import install

from extras import bool_from_string

dotenv.load_dotenv("app/.env")
install()

if __name__ == "__main__":
    port = int(os.getenv("PORT", 1337))
    host = os.getenv("HOST", "0.0.0.0")
    debug = bool_from_string(os.getenv("DEBUG")) # reload if debug
    if bool_from_string(os.getenv("USE_SSL", "false")):
        uvicorn.run(
            "app:app",
            port=port,
            host=host,
            ssl_keyfile=os.getenv("KEY_PATH"),
            ssl_certfile=os.getenv("CRT_PATH"),
            reload=debug,
            reload_dirs=["backend"] if debug else []
        )
    else:
        uvicorn.run(
            "app:app",
            port=port,
            host=host,
            reload=debug,
            reload_dirs=["backend"] if debug else []
        )