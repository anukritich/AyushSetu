# import csv
# from pathlib import Path
# from connection import get_sqlite_connection  

# conn = get_sqlite_connection()
# cursor = conn.cursor()

# # Create table if it doesn't exist
# cursor.execute("""
# CREATE TABLE IF NOT EXISTS namaste_terms (
#     id INTEGER PRIMARY KEY AUTOINCREMENT,
#     NAMC_ID TEXT,
#     NAMC_CODE TEXT,
#     NAMC_term TEXT,
#     NAMC_term_diacritical TEXT,
#     NAMC_term_DEVANAGARI TEXT,
#     Short_definition TEXT,
#     Long_definition TEXT,
#     Ontology_branches TEXT,
#     Term_ID TEXT,
#     English_term TEXT,
#     Description TEXT,
#     Sanskrit_IAST TEXT,
#     Sanskrit TEXT
# )
# """)
# conn.commit()

# csv_path = Path(__file__).resolve().parent.parent.parent / "data" / "namaste_codes" / "IAST_Sanskrit_Matching.csv"
# with open(csv_path, newline='', encoding='utf-8') as csvfile:
#     reader = csv.DictReader(csvfile)
#     for row in reader:
#         cursor.execute("""
#             INSERT INTO namaste_terms (
#                 NAMC_ID, NAMC_CODE, NAMC_term, NAMC_term_diacritical, NAMC_term_DEVANAGARI,
#                 Short_definition, Long_definition, Ontology_branches, Term_ID,
#                 English_term, Description, Sanskrit_IAST, Sanskrit
#             ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
#         """, (
#             row["NAMC_ID"], row["NAMC_CODE"], row["NAMC_term"], row["NAMC_term_diacritical"], row["NAMC_term_DEVANAGARI"],
#             row["Short_definition"], row["Long_definition"], row["Ontology_branches"], row["Term ID"],
#             row["English term"], row["Description"], row["Sanskrit (IAST)"], row["Sanskrit"]
#         ))

# conn.commit()
# print("CSV loaded successfully!")
# conn.close()

# from connection import get_sqlite_connection

# conn = get_sqlite_connection()
# cursor = conn.cursor()

# cursor.execute("SELECT COUNT(*) FROM namaste_terms")
# count = cursor.fetchone()[0]
# print(f"Total rows in namaste_terms: {count}")

# cursor.execute("SELECT * FROM namaste_terms LIMIT 5")
# for row in cursor.fetchall():
#     print(row)

# conn.close()
