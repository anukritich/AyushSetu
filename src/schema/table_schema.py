    # Mapping between system → schema + allowed columns
from typing import Dict, Any, Set 

class TableSchemas:
        
    WHO_TERMINOLOGY_SCHEMAS: Dict[str, Dict[str, Any]] = {
        "ayurveda": {
            "schema": """
                CREATE TABLE IF NOT EXISTS ayurveda_terminologies (
                    term_id TEXT PRIMARY KEY,
                    english_term TEXT,
                    description TEXT,
                    sanskrit_IAST TEXT,
                    sanskrit_devanagari TEXT
                )
            """,
            "columns": {"term_id", "english_term", "description", "sanskrit_IAST", "sanskrit_devanagari"},
            "table": "ayurveda_terminologies",
        },
        "siddha": {
            "schema": """
                CREATE TABLE IF NOT EXISTS siddha_terminologies (
                    term_id TEXT PRIMARY KEY,
                    english_term TEXT,
                    description TEXT,
                    transliteration TEXT,
                    native_term TEXT
                )
            """,
            "columns": {"term_id", "english_term", "description", "transliteration", "native_term"},
            "table": "siddha_terminologies",
        },
        "unani": {
            "schema": """
                CREATE TABLE IF NOT EXISTS unani_terminologies (
                    term_id TEXT PRIMARY KEY,
                    english_term TEXT,
                    description TEXT,
                    transliteration TEXT,
                    native_term TEXT
                )
            """,
            "columns": {"term_id", "english_term", "description", "transliteration", "native_term"},
            "table": "unani_terminologies",
        },
    }
