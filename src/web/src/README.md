# FHIR R4 Terminology Service UI

A minimal web application for dual coding of Ayush diagnoses using NAMASTE and ICD-11 terminologies via FHIR R4 APIs.

## Features

- **Authentication**: OAuth2 bearer token support for secure API access
- **Terminology Search**: Search across NAMASTE and ICD-11 code systems
- **Code Mapping**: Map NAMASTE codes to ICD-11 (TM2 and Biomedicine) using ConceptMap/$translate
- **Problem List**: Create FHIR Condition resources with dual coding
- **Bundle Generation**: Generate FHIR Bundles for batch submission
- **Raw JSON Viewer**: Inspect FHIR responses and generated resources

## Quick Start

1. **Configure Authentication**:
   - Go to the "Authentication" tab
   - Enter your FHIR server base URL (e.g., `https://your-fhir-server.com/fhir`)
   - Paste your OAuth2 bearer token
   - Click "Save Configuration"

2. **Search Terminologies**:
   - Navigate to "Search Terms" tab
   - Enter a diagnosis term (e.g., "fever", "headache")
   - Browse results from NAMASTE and ICD-11 systems

3. **Map Codes**:
   - Go to "Code Mapping" tab
   - Enter a NAMASTE code (e.g., "N001")
   - View equivalent ICD-11 mappings with confidence scores

4. **Create Problem List**:
   - Use "Problem List" tab
   - Add diagnosis codings from both NAMASTE and ICD-11
   - Generate FHIR Condition resources
   - Download as FHIR Bundle

## Configuration Requirements

### FHIR Server Requirements

Your FHIR R4 server must support:

- **ValueSet/$expand**: For terminology search operations
- **ConceptMap/$translate**: For code mapping between terminologies
- **Condition resources**: For problem list management
- **Bundle resources**: For batch operations

### Required Terminologies

- **NAMASTE**: Ayush diagnosis codes (`http://namaste.gov.in/fhir/terminology`)
- **ICD-11 TM2**: Traditional Medicine Module 2 (`http://id.who.int/icd11/mms`)
- **ICD-11 Biomedicine**: Optional biomedical codes (`http://id.who.int/icd11/biomedicine`)

### OAuth2 Token

Obtain a bearer token with appropriate scopes:
- `system/ValueSet.read`
- `system/ConceptMap.read`
- `system/Condition.write` (for creating problem lists)

### CORS Configuration

Ensure your FHIR server allows cross-origin requests from your domain.

## API Endpoints Used

| Operation | Endpoint | Purpose |
|-----------|----------|---------|
| Search | `GET /ValueSet/$expand?url={system}&filter={term}` | Search terminology |
| Mapping | `GET /ConceptMap/$translate?system={source}&code={code}&target={target}` | Code mapping |
| Create | `POST /Condition` | Create condition resource |
| Bundle | `POST /Bundle` | Submit problem list bundle |

## Example Usage

### 1. Search for "fever":
```
GET /ValueSet/$expand?url=http://namaste.gov.in/fhir/terminology&filter=fever
```

### 2. Map NAMASTE code to ICD-11:
```
GET /ConceptMap/$translate?system=http://namaste.gov.in/fhir/terminology&code=N001&target=http://id.who.int/icd11/mms
```

### 3. Create dual-coded condition:
```json
{
  "resourceType": "Condition",
  "clinicalStatus": {
    "coding": [{"system": "http://terminology.hl7.org/CodeSystem/condition-clinical", "code": "active"}]
  },
  "code": {
    "coding": [
      {"system": "http://namaste.gov.in/fhir/terminology", "code": "N001", "display": "Fever"},
      {"system": "http://id.who.int/icd11/mms", "code": "MG30.0", "display": "Fever, unspecified"}
    ]
  },
  "subject": {"reference": "Patient/example"}
}
```

## Development Notes

This application currently uses mock responses for demonstration. To connect to a real FHIR server:

1. Update the `makeRequest` function in `AuthContext.tsx`
2. Remove mock response handling
3. Ensure proper error handling for real API responses
4. Implement proper FHIR response parsing

## Security Considerations

- Bearer tokens are stored in browser memory only
- No sensitive data is persisted locally
- HTTPS required for production deployment
- Validate all API responses before processing

## Troubleshooting

**"API not configured" error**: Ensure both base URL and bearer token are provided in the Authentication tab.

**Search returns no results**: Check that your FHIR server has the required terminologies loaded.

**Mapping fails**: Verify that ConceptMap resources exist linking NAMASTE to ICD-11 codes.

**CORS errors**: Configure your FHIR server to allow requests from your domain.

## Browser Support

- Modern browsers with ES6+ support
- Local storage for configuration persistence
- Fetch API for HTTP requests