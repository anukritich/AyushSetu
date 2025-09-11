
import os
import json
import sqlite3
import logging
from pathlib import Path
from typing import Any, Dict, Iterable, Optional, Set


from dotenv import load_dotenv
from src.schema.table_schema import TableSchemas
from src.database import get_sqlite_connection



class TerminologyMasterDB:
    """
    Class-based refactor for initializing and populating a master SQLite DB
    for WHO/AYUSH terminologies (Ayurveda, Siddha, Unani).

    - Reads environment variables:
        WHO_TERMINOLOGIES_MASTER_DB (default: ./data/master.db)
        WHO_TERMINOLOGIES_JSON_FOLDER (default: ./data/who_terminologies/json)
    - Detects system by filename and imports JSON records into corresponding tables.
    """

    # Load schema from schema package
    TABLE_SCHEMAS: Dict[str, Dict[str, Any]] = TableSchemas.WHO_TERMINOLOGY_SCHEMAS

    def __init__(
        self,
        db_path: Optional[str | Path] = None,
        json_folder: Optional[str | Path] = None,
        logger: Optional[logging.Logger] = None,
    ) -> None:
        load_dotenv()
        self.db_path = Path(
            db_path or os.getenv("WHO_TERMINOLOGIES_MASTER_DB", "./data/master.db")
        ).resolve()
        self.json_folder = Path(
            json_folder or os.getenv("WHO_TERMINOLOGIES_JSON_FOLDER", "./data/who_terminologies/json")
        ).resolve()

        # Basic logger
        self.log = logger or logging.getLogger(self.__class__.__name__)
        if not logger:
            logging.basicConfig(
                level=logging.INFO,
                format="%(asctime)s %(levelname)s [%(name)s]: %(message)s",
            )

    def _connect(self) -> sqlite3.Connection:
        """
        Get a SQLite connection using the database package utility.
        """
        return get_sqlite_connection(str(self.db_path))

    def _ensure_tables(self, conn: sqlite3.Connection) -> None:
        for system, schema in self.TABLE_SCHEMAS.items():
            self.log.debug("Ensuring table for system=%s", system)
            conn.execute(schema["schema"])

    @staticmethod
    def detect_system(filename: str) -> Optional[str]:
        """Detect system name (ayurveda, siddha, unani) from filename."""
        name = filename.lower()
        if "ayurvedic" in name or "ayurveda" in name:
            return "ayurveda"
        elif "siddha" in name:
            return "siddha"
        elif "unani" in name:
            return "unani"
        return None

    def _import_json_record(
        self,
        conn: sqlite3.Connection,
        table_name: str,
        record: Dict[str, Any],
        valid_columns: Set[str],
    ) -> None:
        """Insert one record into the table (only keeping valid columns)."""
        clean_data = {k: record.get(k) for k in valid_columns if k in record}
        if not clean_data:
            return
        placeholders = ", ".join([f":{k}" for k in clean_data.keys()])
        columns = ", ".join(clean_data.keys())
        query = f"INSERT OR REPLACE INTO {table_name} ({columns}) VALUES ({placeholders})"
        conn.execute(query, clean_data)

    def _import_json_file(self, conn: sqlite3.Connection, file_path: Path) -> None:
        system = self.detect_system(file_path.name)
        if not system:
            self.log.warning("Skipping %s: system not recognized", file_path.name)
            return

        schema = self.TABLE_SCHEMAS[system]
        table_name = schema["table"]

        try:
            with file_path.open("r", encoding="utf-8") as f:
                data = json.load(f)
        except json.JSONDecodeError:
            self.log.error("Skipping %s: invalid JSON", file_path.name)
            return

        if isinstance(data, dict):
            self._import_json_record(conn, table_name, data, schema["columns"])
        elif isinstance(data, list):
            for record in data:
                if isinstance(record, dict):
                    self._import_json_record(conn, table_name, record, schema["columns"])
        else:
            self.log.warning("Skipping %s: JSON must be an object or array", file_path.name)
            return

        self.log.info("Imported %s → %s", file_path.name, table_name)

    def build_from_folder(self, folder: Optional[str | Path] = None) -> Path:
        """
        Create or update the master database by importing all JSON files from the folder.
        Returns the DB path.
        """
        src_folder = Path(folder).resolve() if folder else self.json_folder
        if not src_folder.exists() or not src_folder.is_dir():
            raise FileNotFoundError(f"JSON folder not found: {src_folder}")

        conn = self._connect()
        try:
            self._ensure_tables(conn)

            json_files = sorted([p for p in src_folder.iterdir() if p.suffix.lower() == ".json"])
            if not json_files:
                self.log.warning("No JSON files found in %s", src_folder)

            for file_path in json_files:
                self._import_json_file(conn, file_path)

            conn.commit()
        finally:
            conn.close()

        self.log.info("Master database created at: %s", self.db_path)
        return self.db_path

    # Optional: allow adding a new system at runtime (extensible design)
    def register_system(
        self,
        system_key: str,
        table_name: str,
        columns: Iterable[str],
        create_sql: str,
    ) -> None:
        """
        Register an additional terminology system dynamically.

        Example:
            register_system(
                system_key="homeopathy",
                table_name="homeopathy_terminologies",
                columns={"term_id", "english_term", "description"},
                create_sql=\"\"\"
                    CREATE TABLE IF NOT EXISTS homeopathy_terminologies (
                        term_id TEXT PRIMARY KEY,
                        english_term TEXT,
                        description TEXT
                    )
                \"\"\"
            )
        """
        system_key = system_key.lower()
        self.TABLE_SCHEMAS[system_key] = {
            "schema": create_sql,
            "columns": set(columns),
            "table": table_name,
        }
        self.log.info("Registered new system: %s -> %s", system_key, table_name)


if __name__ == "__main__":
    builder = TerminologyMasterDB()
    builder.build_from_folder()