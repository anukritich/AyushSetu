import pandas as pd
from pathlib import Path

class NamasteTerminology:
    def __init__(self, files: dict = None):
        """
        files: dict like {"ayurveda": "/path/ayurveda.xls", "siddha": "/path/siddha.xls", ...}
        """
        self.data = {}
        if files:
            for k, p in files.items():
                df = pd.read_excel(p)
                self.data[k] = df

    def get_all(self, system="ayurveda"):
        return self.data.get(system)

    def infer_columns(self, system="ayurveda"):
        df = self.get_all(system)
        if df is None:
            return None, None
        cols = list(df.columns)
        low = [c.lower() for c in cols]
        code_col = next((c for c in cols if "code" in c.lower() or "id" in c.lower()), cols[0])
        term_col = next((c for c in cols if any(k in c.lower() for k in ("term","name","english","label","description"))), cols[1] if len(cols)>1 else cols[0])
        return code_col, term_col
