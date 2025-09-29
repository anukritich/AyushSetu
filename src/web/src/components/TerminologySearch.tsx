import React, { useState,useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Alert, AlertDescription } from './ui/alert';
import { Search, Loader2, Copy, Eye, Sparkles, TrendingUp, Filter, BookOpen } from 'lucide-react';
import { motion } from 'motion/react';
import { useAuth } from './AuthContext';

  interface CodeConcept {
    system: string;
    code: string;
    display: string;
    english:string;
    designation?: Array<{ language: string; value: string }>;
  }
interface NamasteTerm {
  NAMC_ID: number;
  NAMC_term: string;
  English_term: string;
  Short_definition: string;
  Long_definition?: string;
  code: string;
}

export default function TerminologySearch() {
  const { config, makeRequest } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<CodeConcept[]>([]);
  const [selectedConcept, setSelectedConcept] = useState<CodeConcept | null>(null);
  const [rawResponse, setRawResponse] = useState<any>(null);
  const [showRaw, setShowRaw] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mappedICD, setMappedICD] = useState<any>(null);

  // const handleSearch = async () => {
  //   if (!config.isConfigured) {
  //     setError('Please configure authentication first');
  //     return;
  //   }

  //   if (!searchTerm.trim()) {
  //     setError('Please enter a search term');
  //     return;
  //   }

  //   setLoading(true);
  //   setError(null);
  //   setResults([]);
  //   setRawResponse(null);

  //   try {
  //     // Search across multiple ValueSets
  //     const endpoint = `/ValueSet/$expand?url=http://namaste.gov.in/fhir/terminology&filter=${encodeURIComponent(searchTerm)}`;
  //     const response = await makeRequest(endpoint);
      
  //     if (!response.ok) {
  //       throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  //     }

  //     const data = await response.json();
  //     setRawResponse(data);

  //     if (data.expansion && data.expansion.contains) {
  //       setResults(data.expansion.contains);
  //     } else {
  //       setResults([]);
  //     }
  //   } catch (err) {
  //     setError(err instanceof Error ? err.message : 'Search failed');
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  useEffect(() => {
  const fetchICD = async () => {
    if (!selectedConcept) return;

    try {
      const response = await fetch("http://localhost:5000/api/map-to-icd", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          namaste_code: selectedConcept.code,
          description: selectedConcept.designation?.[0]?.value || ""
        })
      });

      const data = await response.json();

      if (data.success && data.data) {
        // ✅ Parse the stringified array
        const icdArray = JSON.parse(data.data);
        setMappedICD(icdArray);
      } else {
        setMappedICD([]);
      }
    } catch (err) {
      console.error("Error fetching ICD mapping:", err);
      setMappedICD([]);
    }
  };

  fetchICD();
}, [selectedConcept]);


const handleSearch = async () => {
  if (!searchTerm.trim()) {
    setError('Please enter a search term');
    return;
  }

  setLoading(true);
  setError(null);
  setResults([]);
  setRawResponse(null);

  try {
    // Call your Node.js API
    const res = await fetch(`http://localhost:5000/api/search?q=${encodeURIComponent(searchTerm)}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);

    const data = await res.json();
    setRawResponse(data);

    // Map API response to CodeConcept structure for your UI
    const mappedResults = data.map((item: any) => ({
      system: 'namaste', // for badge styling
      code: item.NAMC_CODE,           // NAMASTE code
      display: item.NAMC_term,        // NAMASTE term
      english:item.English_term,
      
      designation: [
        { 
          language: 'en', 
          value: `${item.Description||item.Short_definition || item.Long_definition || ''}` 
        },
      ],
    }));

    setResults(mappedResults);
  } catch (err) {
    setError(err instanceof Error ? err.message : 'Search failed');
  } finally {
    setLoading(false);
  }
};



  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const getSystemBadgeColor = (system: string) => {
    if (system.includes('namaste')) return 'bg-blue-100 text-blue-800';
    if (system.includes('icd11')) return 'bg-green-100 text-green-800';
    return 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      {/* Enhanced Search Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center py-4"
      >
        <div className="flex justify-center items-center gap-3 mb-3">
          <Sparkles className="w-6 h-6 text-blue-600" />
          <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Intelligent Terminology Search
          </h3>
          <TrendingUp className="w-6 h-6 text-green-600" />
        </div>
        <p className="text-gray-600">
          Search across NAMASTE, ICD-11, and traditional medicine terminologies with AI-powered suggestions
        </p>
      </motion.div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="search" className="text-lg font-medium flex items-center gap-2">
            <Search className="w-4 h-4" />
            Search Term (खोजें)
          </Label>
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Input
                id="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter diagnosis term (e.g., fever, बुखार, headache, सिरदर्द)"
                className="flex-1 text-lg h-12 pr-12 border-2 border-blue-200 focus:border-blue-500"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <BookOpen className="w-5 h-5 text-gray-400" />
              </div>
            </div>
            <Button 
              onClick={handleSearch} 
              //disabled={loading || !config.isConfigured}
              className="px-8 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin mr-2" />
              ) : (
                <Search className="h-5 w-5 mr-2" />
              )}
              Search
            </Button>
          </div>
          
          {/* Popular Search Terms */}
          <div className="flex flex-wrap gap-2 mt-3">
            <span className="text-sm text-gray-500">Popular searches:</span>
            {['Fever (बुखार)', 'Headache (सिरदर्द)', 'Diabetes (मधुमेह)', 'Hypertension', 'Asthma (दमा)'].map((term) => (
              <button
                key={term}
                onClick={() => setSearchTerm(term.split(' ')[0])}
                className="text-xs bg-gradient-to-r from-orange-100 to-yellow-100 text-orange-700 px-3 py-1 rounded-full hover:from-orange-200 hover:to-yellow-200 transition-colors"
              >
                {term}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </div>

      {results.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="border-2 border-gradient-to-r from-blue-200 to-green-200 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-blue-50 via-indigo-50 to-green-50">
              <div className="flex justify-between items-center">
                <CardTitle className="text-xl flex items-center gap-2">
                  <Filter className="w-5 h-5 text-blue-600" />
                  Search Results ({results.length})
                </CardTitle>
                <div className="flex gap-2">
                  <Badge className="bg-green-100 text-green-800">
                    {results.filter(r => r.system.includes('namaste')).length} NAMASTE
                  </Badge>
                  <Badge className="bg-blue-100 text-blue-800">
                    {results.filter(r => r.system.includes('icd11')).length} ICD-11
                  </Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowRaw(!showRaw)}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    {showRaw ? 'Hide' : 'Show'} Raw JSON
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6 bg-gradient-to-br from-white to-blue-50">
            <div className="space-y-3">
              {results.map((concept, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className={`p-5 border-2 rounded-xl cursor-pointer transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1 ${
                    selectedConcept === concept 
                      ? 'border-blue-500 bg-gradient-to-r from-blue-50 to-indigo-50 shadow-lg' 
                      : 'border-gray-200 hover:border-blue-300 bg-white'
                  }`}
                  onClick={() => setSelectedConcept(concept)}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <div className="font-bold text-gray-900 text-lg">{concept.display}</div>
                      <div className="text-sm font-medium text-gray-600 mt-1">
                        Code: <span className="font-mono bg-gray-100 px-2 py-1 rounded">{concept.code}</span>
                      </div>
                    </div>
                    <div className="flex gap-2 items-center">
                      <Badge className={`${getSystemBadgeColor(concept.system)} text-sm font-medium px-3 py-1`}>
                        {concept.system.includes('namaste') ? '🕉️ NAMASTE' : 
                         concept.system.includes('icd11') ? '🌍 ICD-11' : '📋 Other'}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          copyToClipboard(`${concept.system}|${concept.code}`);
                        }}
                        className="hover:bg-blue-100"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  {concept.designation && concept.designation.length > 0 && (
                    <div className="text-sm text-gray-600 mt-2">
                      <strong>Description:</strong> {concept.designation[0].value}
                    </div>
                  )}
                  
                  <div className="text-xs text-gray-500 mt-2">
                    System: {concept.system}
                  </div>
                </motion.div>
              ))}
            </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {selectedConcept && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
        >
          <Card className="border-2 border-orange-200 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-orange-50 to-yellow-50">
              <CardTitle className="text-xl text-orange-800">🎯 Search Results</CardTitle>
            </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Display</Label>
                  <div className="text-sm text-gray-900">{selectedConcept.display}</div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Code</Label>
                  <div className="text-sm text-gray-900">{selectedConcept.code}</div>
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium">System</Label>
                <div className="text-sm text-gray-900">{selectedConcept.system}</div>
              </div>
              {selectedConcept.english && (
                <div>
                  <Label className="text-sm font-medium">English Term</Label>
                  <div className="text-sm text-gray-900">{selectedConcept.english}</div>
                </div>
              )}
              {selectedConcept.designation && selectedConcept.designation.length > 0 && (
                <div>
                  <Label className="text-sm font-medium">Description</Label>
                  <div className="text-sm text-gray-900" style={{ whiteSpace: 'pre-line' }}>
                    {selectedConcept.designation[0].value}
                    </div>
                </div>
              )}
              {mappedICD && mappedICD.length > 0 && (
                <div className="mt-4">
                  <Label className="text-sm font-medium">Mapped ICD Codes</Label>
                  <div className="space-y-2">
                    {mappedICD.map((item: any, index: number) => (
                      <Card key={index} className="p-3 border rounded shadow-sm">
                        <div className="flex justify-between">
                          <div>
                            <strong>Rank {index + 1}:</strong> {item.icd_code} - <span dangerouslySetInnerHTML={{__html: item.title}} />
                          </div>
                          <a href={item.uri} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                            View
                          </a>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
          </Card>
        </motion.div>
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
    </div>
  );
}