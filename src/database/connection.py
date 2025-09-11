import os
from pathlib import Path
from typing import Optional, Any
import sqlite3

try:
    import psycopg2
except ImportError:
    psycopg2 = None

# SQLite connection

def get_sqlite_connection(db_path: Optional[str] = None) -> sqlite3.Connection:
    """
    Returns a SQLite connection object. Creates the database file if it doesn't exist.
    """
    db_path = db_path or os.getenv("WHO_TERMINOLOGIES_MASTER_DB", "./data/master.db")
    db_path = str(Path(db_path).resolve())
    os.makedirs(os.path.dirname(db_path), exist_ok=True)
    conn = sqlite3.connect(db_path)
    conn.execute("PRAGMA journal_mode=WAL;")
    conn.execute("PRAGMA foreign_keys=ON;")
    return conn

# PostgreSQL connection

def get_postgres_connection(
    host: Optional[str] = None,
    port: Optional[int] = None,
    user: Optional[str] = None,
    password: Optional[str] = None,
    dbname: Optional[str] = None,
    **kwargs: Any
):
    """
    Returns a PostgreSQL connection object using psycopg2. Reads from environment variables if not provided.
    """
    if psycopg2 is None:
        raise ImportError("psycopg2 is not installed. Please install it to use PostgreSQL.")
    host = host or os.getenv("PGHOST", "localhost")
    port = port or int(os.getenv("PGPORT", 5432))
    user = user or os.getenv("PGUSER", "postgres")
    password = password or os.getenv("PGPASSWORD", "")
    dbname = dbname or os.getenv("PGDATABASE", "postgres")
    conn = psycopg2.connect(
        host=host,
        port=port,
        user=user,
        password=password,
        dbname=dbname,
        **kwargs
    )
    return conn
