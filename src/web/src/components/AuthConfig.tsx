import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Alert, AlertDescription } from './ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { CheckCircle, XCircle, Eye, EyeOff } from 'lucide-react';
import { useAuth } from './AuthContext';

export default function AuthConfig() {
  const { config, updateConfig } = useAuth();
  const [baseUrl, setBaseUrl] = useState(config.baseUrl || 'https://your-fhir-server.com/fhir');
  const [bearerToken, setBearerToken] = useState(config.bearerToken || '');
  const [showToken, setShowToken] = useState(false);

  const handleSave = () => {
    updateConfig(baseUrl, bearerToken);
  };

  const handleTestConnection = async () => {
    try {
      // In a real implementation, this would test the connection
      console.log('Testing connection to:', baseUrl);
      alert('Connection test would be performed here. Currently using mock responses.');
    } catch (error) {
      console.error('Connection test failed:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4">
        <div className="space-y-2">
          <Label htmlFor="baseUrl">FHIR Base URL</Label>
          <Input
            id="baseUrl"
            value={baseUrl}
            onChange={(e) => setBaseUrl(e.target.value)}
            placeholder="https://your-fhir-server.com/fhir"
          />
          <p className="text-sm text-gray-500">
            Base URL for your FHIR R4 terminology service
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="bearerToken">OAuth2 Bearer Token</Label>
          <div className="relative">
            <Textarea
              id="bearerToken"
              value={bearerToken}
              onChange={(e) => setBearerToken(e.target.value)}
              placeholder="eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9..."
              className="pr-10"
              type={showToken ? 'text' : 'password'}
              rows={3}
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-2 top-2"
              onClick={() => setShowToken(!showToken)}
            >
              {showToken ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>
          <p className="text-sm text-gray-500">
            Paste your OAuth2 bearer token for API authentication
          </p>
        </div>
      </div>

      <div className="flex gap-2">
        <Button onClick={handleSave} className="flex-1">
          Save Configuration
        </Button>
        <Button onClick={handleTestConnection} variant="outline">
          Test Connection
        </Button>
      </div>

      {config.isConfigured && (
        <Alert>
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>
            Configuration saved. You can now search terminologies and perform mappings.
          </AlertDescription>
        </Alert>
      )}

      {!config.isConfigured && (baseUrl || bearerToken) && (
        <Alert variant="destructive">
          <XCircle className="h-4 w-4" />
          <AlertDescription>
            Please provide both base URL and bearer token to continue.
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Setup Instructions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div>
            <strong>1. FHIR Server:</strong> Ensure your FHIR R4 server supports:
            <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
              <li>ValueSet/$expand operation for terminology search</li>
              <li>ConceptMap/$translate for code mapping</li>
              <li>NAMASTE and ICD-11 terminologies</li>
            </ul>
          </div>
          <div>
            <strong>2. Authentication:</strong> Obtain an OAuth2 bearer token with appropriate scopes for terminology operations.
          </div>
          <div>
            <strong>3. CORS:</strong> Ensure your FHIR server allows cross-origin requests from this domain.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}