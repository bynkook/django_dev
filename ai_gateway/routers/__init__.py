"""
FastAPI Routers Package
"""
from .health import router as health_router
from .chat import router as chat_router
from .image import router as image_router

__all__ = ["health_router", "chat_router", "image_router"]
