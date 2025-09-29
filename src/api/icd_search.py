#!/usr/bin/env python3
"""
ICD-11 MMS search example.

- Reads CLIENT_ID and CLIENT_SECRET from environment variables.
- Gets an OAuth2 token and searches the ICD-11 MMS 2024-01 release.
- Prints all matches with rank, code, title, URI, and score.
"""

import os
import sys
import requests
import urllib3
from typing import Dict, Any, List
import json

# --- CONFIGURATION ---
CLIENT_ID = os.getenv("ICD_API_CLIENT_ID", "5ac34ca1-0ef8-4f5f-b385-60e6f448f0a8_6be01352-1ce8-48fd-8d52-54506cddca91")
CLIENT_SECRET = os.getenv("ICD_API_CLIENT_SECRET", "wZ8A5GuuqZGaYBBODJuQg/kQTMSbV2Ag/PW42lK0Tqc=")

TOKEN_URL = "https://icdaccessmanagement.who.int/connect/token"
API_BASE_URL = "https://id.who.int/icd/release/11/2024-01/mms/search"
DEFAULT_SEARCH_TERM = "A disorder characterized by deafness/hearing impairment"

# --- SSL WARNINGS (for testing only) ---
VERIFY_SSL = False
if not VERIFY_SSL:
    urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

def get_token() -> str:
    """Obtains an OAuth2 access token from the WHO ICD API."""
    headers = {"Content-Type": "application/x-www-form-urlencoded"}
    data = {
        "client_id": CLIENT_ID,
        "client_secret": CLIENT_SECRET,
        "grant_type": "client_credentials",
        "scope": "icdapi_access",
    }
    
    try:
        resp = requests.post(TOKEN_URL, headers=headers, data=data, verify=VERIFY_SSL, timeout=30)
        resp.raise_for_status()
    except requests.RequestException as e:
        raise RuntimeError(f"Token request error: {e}")

    token_json = resp.json()
    if "access_token" not in token_json:
        raise RuntimeError(f"No 'access_token' in token response: {token_json}")
    
    return token_json["access_token"]

def search_icd(token: str, query: str) -> Dict[str, Any]:
    """Searches the ICD-11 MMS API with a given query."""
    headers = {
        "Authorization": f"Bearer {token}",
        "API-Version": "v2",
        "Accept": "application/json",
        "Accept-Language": "en", 
    }
    params = {
        "q": query,
        "flatResults": "true",
        "useFlexisearch":"true",
    }
    
    try:
        resp = requests.get(API_BASE_URL, headers=headers, params=params, verify=VERIFY_SSL, timeout=30)
        resp.raise_for_status()
    except requests.RequestException as e:
        raise RuntimeError(f"Search request error: {e}")
        
    return resp.json()

def print_results(entities: List[Dict[str, Any]]):
    """Formats and prints the search results to the console."""
    if not entities:
        print("No matches found.")
        return

    print(f"\nFound {len(entities)} matches:\n")
    for idx, ent in enumerate(entities, start=1):
        code = ent.get("code") or ent.get("theCode") or "N/A"
        title = ent.get("title") or ent.get("label") or ent.get("description") or "N/A"
        uri = ent.get("id") or ent.get("uri") or ent.get("theId") or "N/A"
        score = ent.get("score") if ent.get("score") is not None else ent.get("rank") or "N/A"
        
        print(f"Rank {idx}:")
        print(f"  Code : {code}")
        print(f"  Title: {title}")
        print(f"  URI  : {uri}")
        print(f"  Score: {score}\n")

def main():
    token = get_token()
    query = " ".join(sys.argv[1:]) if len(sys.argv) > 1 else DEFAULT_SEARCH_TERM
    results = search_icd(token, query)
    entities = results.get("destinationEntities", [])

    output = []
    for ent in entities:
        output.append({
            "icd_code": ent.get("code") or ent.get("theCode"),
            "title": ent.get("title") or ent.get("label"),
            "uri": ent.get("id") or ent.get("uri"),
        })
    
    # Print JSON so Node.js can parse it
    print(json.dumps(output))

if __name__ == "__main__":
    main()