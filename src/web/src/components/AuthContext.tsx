import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AuthConfig {
  baseUrl: string;
  bearerToken: string;
  isConfigured: boolean;
}

interface AuthContextType {
  config: AuthConfig;
  updateConfig: (baseUrl: string, bearerToken: string) => void;
  makeRequest: (endpoint: string, options?: RequestInit) => Promise<Response>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<AuthConfig>({
    baseUrl: '',
    bearerToken: '',
    isConfigured: false
  });

  const updateConfig = (baseUrl: string, bearerToken: string) => {
    setConfig({
      baseUrl: baseUrl.replace(/\/$/, ''), // Remove trailing slash
      bearerToken,
      isConfigured: !!(baseUrl && bearerToken)
    });
  };

  const makeRequest = async (endpoint: string, options: RequestInit = {}) => {
    if (!config.isConfigured) {
      throw new Error('API not configured. Please set base URL and bearer token.');
    }

    const url = `${config.baseUrl}${endpoint}`;
    const headers = {
      'Authorization': `Bearer ${config.bearerToken}`,
      'Accept': 'application/fhir+json',
      'Content-Type': 'application/fhir+json',
      ...options.headers
    };

    // For demo purposes, return mock responses
    console.log('Would make request to:', url, 'with headers:', headers);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Return mock response based on endpoint
    if (endpoint.includes('ValueSet/$expand')) {
      return new Response(JSON.stringify(getMockValueSetExpansion(endpoint)), {
        status: 200,
        headers: { 'content-type': 'application/fhir+json' }
      });
    } else if (endpoint.includes('ConceptMap/$translate')) {
      return new Response(JSON.stringify(getMockTranslateResult(endpoint)), {
        status: 200,
        headers: { 'content-type': 'application/fhir+json' }
      });
    }
    
    return new Response(JSON.stringify({ error: 'Endpoint not mocked' }), {
      status: 404,
      headers: { 'content-type': 'application/json' }
    });
  };

  return (
    <AuthContext.Provider value={{ config, updateConfig, makeRequest }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Mock data functions
function getMockValueSetExpansion(endpoint: string) {
  const searchTerm = new URL(endpoint, 'http://example.com').searchParams.get('filter') || '';
  
  // Enhanced mock data with more diverse conditions and Indian terms
  const mockData = {
    fever: [
      {
        system: 'http://namaste.gov.in/fhir/terminology',
        code: 'N001',
        display: `ज्वर (Fever) - Traditional`,
        designation: [{
          language: 'en',
          value: 'Fever according to Ayurvedic principles - Pittaja Jwara'
        }]
      },
      {
        system: 'http://id.who.int/icd11/mms',
        code: 'MG30.0',
        display: `ICD-11 TM2: Fever, unspecified`,
        designation: [{
          language: 'en',
          value: 'Fever of unknown origin in traditional medicine context'
        }]
      },
      {
        system: 'http://id.who.int/icd11/biomedicine',
        code: 'MG30.1',
        display: `ICD-11 Biomed: Pyrexia`,
        designation: [{
          language: 'en',
          value: 'Elevated body temperature - biomedical classification'
        }]
      }
    ],
    headache: [
      {
        system: 'http://namaste.gov.in/fhir/terminology',
        code: 'N002',
        display: `शिरःशूल (Shirahshool) - Head Pain`,
        designation: [{
          language: 'en',
          value: 'Headache as per Ayurvedic classification - Vataja/Pittaja'
        }]
      },
      {
        system: 'http://id.who.int/icd11/mms',
        code: '8A80.0',
        display: `Primary headache disorders`,
        designation: [{
          language: 'en',
          value: 'Primary headache conditions including traditional triggers'
        }]
      }
    ],
    diabetes: [
      {
        system: 'http://namaste.gov.in/fhir/terminology',
        code: 'N003',
        display: `मधुमेह (Madhumeha) - Sweet Urine Disease`,
        designation: [{
          language: 'en',
          value: 'Diabetes mellitus as described in ancient Ayurvedic texts'
        }]
      },
      {
        system: 'http://id.who.int/icd11/mms',
        code: '5A10',
        display: `Type 2 diabetes mellitus`,
        designation: [{
          language: 'en',
          value: 'Non-insulin dependent diabetes mellitus'
        }]
      }
    ]
  };

  // Determine which mock data to return based on search term
  let results = [];
  const term = searchTerm.toLowerCase();
  
  if (term.includes('fever') || term.includes('बुखार') || term.includes('ज्वर')) {
    results = mockData.fever;
  } else if (term.includes('headache') || term.includes('सिरदर्द') || term.includes('शिर')) {
    results = mockData.headache;
  } else if (term.includes('diabetes') || term.includes('मधुमेह')) {
    results = mockData.diabetes;
  } else {
    // Default mixed results
    results = [...mockData.fever.slice(0, 1), ...mockData.headache.slice(0, 1), ...mockData.diabetes.slice(0, 1)];
  }
  
  return {
    resourceType: 'ValueSet',
    id: 'mock-expansion',
    expansion: {
      total: results.length,
      contains: results
    }
  };
}

function getMockTranslateResult(endpoint: string) {
  const params = new URL(endpoint, 'http://example.com').searchParams;
  const sourceCode = params.get('code') || 'N001';
  
  return {
    resourceType: 'Parameters',
    parameter: [
      {
        name: 'result',
        valueBoolean: true
      },
      {
        name: 'match',
        part: [
          {
            name: 'equivalence',
            valueCode: 'equivalent'
          },
          {
            name: 'concept',
            valueCoding: {
              system: 'http://id.who.int/icd11/mms',
              code: 'MG30.0',
              display: 'Fever, unspecified'
            }
          },
          {
            name: 'source',
            valueUri: 'http://example.org/fhir/ConceptMap/namaste-to-icd11'
          },
          {
            name: 'confidence',
            valueDecimal: 0.85
          }
        ]
      },
      {
        name: 'match',
        part: [
          {
            name: 'equivalence',
            valueCode: 'wider'
          },
          {
            name: 'concept',
            valueCoding: {
              system: 'http://id.who.int/icd11/mms',
              code: 'MG30.1',
              display: 'Pyrexia'
            }
          },
          {
            name: 'source',
            valueUri: 'http://example.org/fhir/ConceptMap/namaste-to-icd11-biomed'
          },
          {
            name: 'confidence',
            valueDecimal: 0.72
          }
        ]
      }
    ]
  };
}