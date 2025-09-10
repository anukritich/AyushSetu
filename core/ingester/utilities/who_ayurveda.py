import json
from pathlib import Path

class WHOAyurvedaTerminology:
    def __init__(self, json_path: str = None):
        """
        Load WHO Ayurveda terminology JSON.
        If no path is given, it will look for ayurveda_terms.json in the same folder.
        """
        if json_path is None:
            json_path = Path(__file__).parent / "ayurveda_terms.json"
        else:
            json_path = Path(json_path)

        if not json_path.exists():
            raise FileNotFoundError(f"WHO Ayurveda JSON not found at {json_path}")

        with open(json_path, "r", encoding="utf-8") as f:
            self.entries = json.load(f)

    def get_all_entries(self):
        """Return all terminology entries."""
        return self.entries

    def find_by_term_id(self, term_id: str):
        """Find entry by ITA code (e.g., ITA-1.1.1)."""
        return next((e for e in self.entries if e["term_id"] == term_id), None)

    def search(self, keyword: str):
        """Search English term & description for a keyword."""
        keyword = keyword.lower()
        return [
            e for e in self.entries
            if keyword in e.get("english_term", "").lower()
            or keyword in e.get("description", "").lower()
        ]

    def get_sanskrit_terms(self, term_id: str):
        """Get Sanskrit (IAST + Devanagari) for a given term_id."""
        entry = self.find_by_term_id(term_id)
        if entry:
            return {
                "sanskrit_IAST": entry.get("sanskrit_IAST"),
                "sanskrit_devanagari": entry.get("sanskrit_devanagari")
            }
        return None
