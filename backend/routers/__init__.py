from .item import router as itemRouter
from .order import router as orderRouter
from .user import router as userRouter
from .auth import router as authRouter
from .key import router as keyRouter

__all__ = (
    authRouter,
    itemRouter,
    orderRouter,
    userRouter
)