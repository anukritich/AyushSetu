import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { Progress } from './ui/progress';
import { ArrowRight, Loader2, MapPin, Eye } from 'lucide-react';
import { useAuth } from './AuthContext';

interface MappingMatch {
  equivalence: string;
  concept: {
    system: string;
    code: string;
    display: string;
  };
  source: string;
  confidence: number;
}

interface MappingResult {
  result: boolean;
  matches: MappingMatch[];
}

export default function CodeMapping() {
  const { config, makeRequest } = useAuth();
  const [sourceSystem, setSourceSystem] = useState('http://namaste.gov.in/fhir/terminology');
  const [sourceCode, setSourceCode] = useState('');
  const [sourceDisplay, setSourceDisplay] = useState('');
  const [loading, setLoading] = useState(false);
  const [mappingResult, setMappingResult] = useState<MappingResult | null>(null);
  const [rawResponse, setRawResponse] = useState<any>(null);
  const [showRaw, setShowRaw] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleMapping = async () => {
    if (!config.isConfigured) {
      setError('Please configure authentication first');
      return;
    }

    if (!sourceCode.trim()) {
      setError('Please enter a source code');
      return;
    }

    setLoading(true);
    setError(null);
    setMappingResult(null);
    setRawResponse(null);

    try {
      // Call ConceptMap/$translate
      const endpoint = `/ConceptMap/$translate?system=${encodeURIComponent(sourceSystem)}&code=${encodeURIComponent(sourceCode)}&target=http://id.who.int/icd11/mms`;
      const response = await makeRequest(endpoint);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      setRawResponse(data);

      // Parse FHIR Parameters response
      if (data.resourceType === 'Parameters' && data.parameter) {
        const resultParam = data.parameter.find((p: any) => p.name === 'result');
        const matchParams = data.parameter.filter((p: any) => p.name === 'match');
        
        const matches: MappingMatch[] = matchParams.map((match: any) => {
          const equivalence = match.part?.find((p: any) => p.name === 'equivalence')?.valueCode || '';
          const concept = match.part?.find((p: any) => p.name === 'concept')?.valueCoding || {};
          const source = match.part?.find((p: any) => p.name === 'source')?.valueUri || '';
          const confidence = match.part?.find((p: any) => p.name === 'confidence')?.valueDecimal || 0;
          
          return { equivalence, concept, source, confidence };
        });

        setMappingResult({
          result: resultParam?.valueBoolean || false,
          matches
        });
      } else {
        setError('Invalid response format from ConceptMap/$translate');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Mapping failed');
    } finally {
      setLoading(false);
    }
  };

  const getEquivalenceBadgeColor = (equivalence: string) => {
    switch (equivalence) {
      case 'equivalent': return 'bg-green-100 text-green-800';
      case 'wider': return 'bg-blue-100 text-blue-800';
      case 'narrower': return 'bg-yellow-100 text-yellow-800';
      case 'inexact': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTargetSystemLabel = (system: string) => {
    if (system.includes('icd11')) {
      if (system.includes('biomed')) return 'ICD-11 Biomedicine';
      return 'ICD-11 TM2';
    }
    return system;
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="sourceCode">NAMASTE Code</Label>
            <Input
              id="sourceCode"
              value={sourceCode}
              onChange={(e) => setSourceCode(e.target.value)}
              placeholder="e.g., N001"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="sourceDisplay">Display Name (optional)</Label>
            <Input
              id="sourceDisplay"
              value={sourceDisplay}
              onChange={(e) => setSourceDisplay(e.target.value)}
              placeholder="e.g., Fever"
            />
          </div>
          <div className="space-y-2">
            <Label>&nbsp;</Label>
            <Button 
              onClick={handleMapping} 
              disabled={loading || !config.isConfigured}
              className="w-full"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <MapPin className="h-4 w-4 mr-2" />
              )}
              Map to ICD-11
            </Button>
          </div>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </div>

      {mappingResult && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Mapping Results</CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowRaw(!showRaw)}
              >
                <Eye className="h-4 w-4 mr-2" />
                {showRaw ? 'Hide' : 'Show'} Raw JSON
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <div className="font-medium">Source Concept</div>
                  <div className="text-sm text-gray-600">
                    {sourceDisplay || sourceCode} ({sourceCode})
                  </div>
                  <div className="text-xs text-gray-500">NAMASTE</div>
                </div>
                <ArrowRight className="h-6 w-6 text-gray-400" />
                <div className="flex-1 text-right">
                  <div className="font-medium">
                    {mappingResult.matches.length} mapping(s) found
                  </div>
                  <div className="text-sm text-gray-600">ICD-11</div>
                </div>
              </div>

              {mappingResult.matches.length === 0 ? (
                <Alert>
                  <AlertDescription>
                    No mappings found for this code. The concept may not have equivalent ICD-11 codes.
                  </AlertDescription>
                </Alert>
              ) : (
                <div className="space-y-3">
                  {mappingResult.matches.map((match, index) => (
                    <Card key={index} className="border-l-4 border-l-blue-500">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex-1">
                            <div className="font-medium text-gray-900">
                              {match.concept.display}
                            </div>
                            <div className="text-sm text-gray-600 mt-1">
                              Code: {match.concept.code}
                            </div>
                          </div>
                          <div className="flex gap-2 items-center">
                            <Badge className={getEquivalenceBadgeColor(match.equivalence)}>
                              {match.equivalence}
                            </Badge>
                            <Badge variant="outline">
                              {getTargetSystemLabel(match.concept.system)}
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div>
                            <Label className="text-xs font-medium text-gray-500">
                              Confidence Score
                            </Label>
                            <div className="flex items-center gap-2 mt-1">
                              <Progress 
                                value={match.confidence * 100} 
                                className="flex-1 h-2"
                              />
                              <span className="text-sm font-medium">
                                {Math.round(match.confidence * 100)}%
                              </span>
                            </div>
                          </div>
                          
                          <div className="text-xs text-gray-500">
                            <strong>System:</strong> {match.concept.system}
                          </div>
                          
                          {match.source && (
                            <div className="text-xs text-gray-500">
                              <strong>Mapping Source:</strong> {match.source}
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {showRaw && rawResponse && (
        <Card>
          <CardHeader>
            <CardTitle>Raw FHIR Response</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="text-xs bg-gray-100 p-4 rounded overflow-auto max-h-96">
              {JSON.stringify(rawResponse, null, 2)}
            </pre>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Mapping Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div>
            <strong>Equivalence Types:</strong>
            <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
              <li><Badge className="bg-green-100 text-green-800 mr-2">equivalent</Badge>Exact match</li>
              <li><Badge className="bg-blue-100 text-blue-800 mr-2">wider</Badge>Target is broader than source</li>
              <li><Badge className="bg-yellow-100 text-yellow-800 mr-2">narrower</Badge>Target is more specific than source</li>
              <li><Badge className="bg-orange-100 text-orange-800 mr-2">inexact</Badge>Approximate match</li>
            </ul>
          </div>
          <div>
            <strong>Confidence Score:</strong> Indicates the reliability of the mapping (0-100%).
          </div>
        </CardContent>
      </Card>
    </div>
  );
}