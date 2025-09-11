import os
import pandas as pd
from pathlib import Path
from typing import Dict, Any
from src.database import get_sqlite_connection

# Define the mapping of system to xls file
NAMASTE_CODES = {
    "ayurveda": "src/data/namasteCodes/ayurveda.xls",
    "siddha": "src/data/namasteCodes/siddha.xls",
    "unani": "src/data/namasteCodes/unani.xls",
}

# Define the schema for each system (customize columns as needed)
TABLE_SCHEMAS = {
    "ayurveda": """
        CREATE TABLE IF NOT EXISTS namaste_ayurveda (
            code TEXT PRIMARY KEY,
            english_term TEXT,
            description TEXT
        )
    """,
    "siddha": """
        CREATE TABLE IF NOT EXISTS namaste_siddha (
            code TEXT PRIMARY KEY,
            english_term TEXT,
            description TEXT
        )
    """,
    "unani": """
        CREATE TABLE IF NOT EXISTS namaste_unani (
            code TEXT PRIMARY KEY,
            english_term TEXT,
            description TEXT
        )
    """,
}

DB_PATH = os.getenv("NAMASTE_MASTER_DB", "./data/namaste_master.db")

def build_namaste_master_db():
    conn = get_sqlite_connection(DB_PATH)
    try:
        for system, xls_path in NAMASTE_CODES.items():
            abs_path = Path(xls_path).resolve()
            if not abs_path.exists():
                print(f"File not found: {abs_path}")
                continue
            # Create table
            conn.execute(TABLE_SCHEMAS[system])
            # Read Excel
            df = pd.read_excel(abs_path)
            # Expect columns: code, english_term, description (customize as needed)
            for _, row in df.iterrows():
                code = str(row.get("code") or row.get("Code") or row.get("CODE") or "").strip()
                english_term = str(row.get("english_term") or row.get("English Term") or row.get("ENGLISH_TERM") or "").strip()
                description = str(row.get("description") or row.get("Description") or row.get("DESCRIPTION") or "").strip()
                if not code:
                    continue
                conn.execute(
                    f"INSERT OR REPLACE INTO namaste_{system} (code, english_term, description) VALUES (?, ?, ?)",
                    (code, english_term, description)
                )
            print(f"Imported {system} NAMASTE codes from {abs_path}")
        conn.commit()
        print(f"NAMASTE master DB created at: {DB_PATH}")
    finally:
        conn.close()

if __name__ == "__main__":
    build_namaste_master_db()
