import os
from typing import Optional, Any

try:
    import redis
except ImportError:
    redis = None

def get_redis_connection(
    host: Optional[str] = None,
    port: Optional[int] = None,
    db: Optional[int] = None,
    password: Optional[str] = None,
    **kwargs: Any
):
    """
    Returns a Redis connection object using redis-py. Reads from environment variables if not provided.
    """
    if redis is None:
        raise ImportError("redis-py is not installed. Please install it to use Redis.")
    host = host or os.getenv("REDIS_HOST", "localhost")
    port = port or int(os.getenv("REDIS_PORT", 6379))
    db = db if db is not None else int(os.getenv("REDIS_DB", 0))
    password = password or os.getenv("REDIS_PASSWORD", None)
    return redis.Redis(host=host, port=port, db=db, password=password, **kwargs)
