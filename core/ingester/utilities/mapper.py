import json
from pathlib import Path
from rapidfuzz import process, fuzz

class TerminologyMapper:
    def __init__(self, enriched_json_path: str):
        self.path = Path(enriched_json_path)
        if not self.path.exists():
            raise FileNotFoundError(f"Enriched JSON not found: {self.path}")
        with open(self.path, "r", encoding="utf-8") as f:
            self.entries = json.load(f)

    def find_by_term_id(self, term_id: str):
        return next((e for e in self.entries if e.get("term_id")==term_id), None)

    def search(self, query: str, limit: int = 10):
        q = query.lower()
        results = []
        for e in self.entries:
            combined = " ".join([str(e.get("english_term","")), str(e.get("description",""))]).lower()
            if q in combined:
                results.append({"score": 100, "entry": e})
        # If few exact matches, add fuzzy matches
        if len(results) < limit:
            choices = {e["term_id"]: (e.get("english_term","") + " " + e.get("description","")) for e in self.entries}
            matches = process.extract(query, choices, scorer=fuzz.token_set_ratio, limit=limit)
            for term_id, score, _ in matches:
                if score < 35:
                    continue
                ent = self.find_by_term_id(term_id)
                results.append({"score": int(score), "entry": ent})
        # sort by score desc
        results_sorted = sorted(results, key=lambda r: r["score"], reverse=True)
        # dedupe by term_id
        seen = set()
        out = []
        for r in results_sorted:
            tid = r["entry"]["term_id"]
            if tid not in seen:
                seen.add(tid)
                out.append(r)
            if len(out) >= limit:
                break
        return out

    def search_by_symptom(self, symptom: str, limit: int = 10):
        return self.search(symptom, limit=limit)
