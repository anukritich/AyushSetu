import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Alert, AlertDescription } from './ui/alert';
import { Plus, Trash2, Eye, Download, CheckCircle } from 'lucide-react';

interface Coding {
  system: string;
  code: string;
  display: string;
}

interface ConditionEntry {
  id: string;
  clinicalStatus: string;
  verificationStatus: string;
  category: string;
  codings: Coding[];
  subject: string;
  onsetDateTime?: string;
  note?: string;
}

export default function ProblemList() {
  const [conditions, setConditions] = useState<ConditionEntry[]>([]);
  const [currentCondition, setCurrentCondition] = useState<Partial<ConditionEntry>>({
    clinicalStatus: 'active',
    verificationStatus: 'confirmed',
    category: 'problem-list-item',
    codings: [],
    subject: 'Patient/example'
  });
  const [showBundle, setShowBundle] = useState(false);
  const [newCoding, setNewCoding] = useState<Partial<Coding>>({});

  const addCoding = () => {
    if (newCoding.system && newCoding.code && newCoding.display) {
      setCurrentCondition(prev => ({
        ...prev,
        codings: [...(prev.codings || []), newCoding as Coding]
      }));
      setNewCoding({});
    }
  };

  const removeCoding = (index: number) => {
    setCurrentCondition(prev => ({
      ...prev,
      codings: prev.codings?.filter((_, i) => i !== index) || []
    }));
  };

  const addCondition = () => {
    if (currentCondition.codings && currentCondition.codings.length > 0) {
      const condition: ConditionEntry = {
        ...currentCondition,
        id: `condition-${Date.now()}`,
        codings: currentCondition.codings
      } as ConditionEntry;
      
      setConditions(prev => [...prev, condition]);
      setCurrentCondition({
        clinicalStatus: 'active',
        verificationStatus: 'confirmed',
        category: 'problem-list-item',
        codings: [],
        subject: 'Patient/example'
      });
    }
  };

  const removeCondition = (id: string) => {
    setConditions(prev => prev.filter(c => c.id !== id));
  };

  const generateFHIRCondition = (condition: ConditionEntry) => {
    return {
      resourceType: 'Condition',
      id: condition.id,
      clinicalStatus: {
        coding: [{
          system: 'http://terminology.hl7.org/CodeSystem/condition-clinical',
          code: condition.clinicalStatus
        }]
      },
      verificationStatus: {
        coding: [{
          system: 'http://terminology.hl7.org/CodeSystem/condition-ver-status',
          code: condition.verificationStatus
        }]
      },
      category: [{
        coding: [{
          system: 'http://terminology.hl7.org/CodeSystem/condition-category',
          code: condition.category
        }]
      }],
      code: {
        coding: condition.codings
      },
      subject: {
        reference: condition.subject
      },
      ...(condition.onsetDateTime && {
        onsetDateTime: condition.onsetDateTime
      }),
      ...(condition.note && {
        note: [{
          text: condition.note
        }]
      })
    };
  };

  const generateFHIRBundle = () => {
    return {
      resourceType: 'Bundle',
      id: `problem-list-${Date.now()}`,
      type: 'collection',
      timestamp: new Date().toISOString(),
      total: conditions.length,
      entry: conditions.map(condition => ({
        resource: generateFHIRCondition(condition)
      }))
    };
  };

  const downloadBundle = () => {
    const bundle = generateFHIRBundle();
    const blob = new Blob([JSON.stringify(bundle, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `problem-list-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getSystemLabel = (system: string) => {
    if (system.includes('namaste')) return 'NAMASTE';
    if (system.includes('icd11')) return 'ICD-11';
    if (system.includes('snomed')) return 'SNOMED CT';
    return 'Other';
  };

  const getSystemColor = (system: string) => {
    if (system.includes('namaste')) return 'bg-blue-100 text-blue-800';
    if (system.includes('icd11')) return 'bg-green-100 text-green-800';
    if (system.includes('snomed')) return 'bg-purple-100 text-purple-800';
    return 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="create" className="space-y-4">
        <TabsList>
          <TabsTrigger value="create">Create Condition</TabsTrigger>
          <TabsTrigger value="list">Problem List ({conditions.length})</TabsTrigger>
          <TabsTrigger value="bundle">FHIR Bundle</TabsTrigger>
        </TabsList>

        <TabsContent value="create" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Create New Condition</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="clinicalStatus">Clinical Status</Label>
                  <Select
                    value={currentCondition.clinicalStatus}
                    onValueChange={(value) => setCurrentCondition(prev => ({ ...prev, clinicalStatus: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="recurrence">Recurrence</SelectItem>
                      <SelectItem value="relapse">Relapse</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="remission">Remission</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="verificationStatus">Verification Status</Label>
                  <Select
                    value={currentCondition.verificationStatus}
                    onValueChange={(value) => setCurrentCondition(prev => ({ ...prev, verificationStatus: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="confirmed">Confirmed</SelectItem>
                      <SelectItem value="provisional">Provisional</SelectItem>
                      <SelectItem value="differential">Differential</SelectItem>
                      <SelectItem value="unconfirmed">Unconfirmed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject">Subject Reference</Label>
                <Input
                  id="subject"
                  value={currentCondition.subject}
                  onChange={(e) => setCurrentCondition(prev => ({ ...prev, subject: e.target.value }))}
                  placeholder="Patient/example"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="onsetDateTime">Onset Date (optional)</Label>
                <Input
                  id="onsetDateTime"
                  type="datetime-local"
                  value={currentCondition.onsetDateTime || ''}
                  onChange={(e) => setCurrentCondition(prev => ({ ...prev, onsetDateTime: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="note">Clinical Notes (optional)</Label>
                <Textarea
                  id="note"
                  value={currentCondition.note || ''}
                  onChange={(e) => setCurrentCondition(prev => ({ ...prev, note: e.target.value }))}
                  placeholder="Additional clinical notes..."
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Diagnosis Codings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="system">System</Label>
                  <Select
                    value={newCoding.system}
                    onValueChange={(value) => setNewCoding(prev => ({ ...prev, system: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select system" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="http://namaste.gov.in/fhir/terminology">NAMASTE</SelectItem>
                      <SelectItem value="http://id.who.int/icd11/mms">ICD-11 TM2</SelectItem>
                      <SelectItem value="http://id.who.int/icd11/biomedicine">ICD-11 Biomedicine</SelectItem>
                      <SelectItem value="http://snomed.info/sct">SNOMED CT</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="code">Code</Label>
                  <Input
                    id="code"
                    value={newCoding.code || ''}
                    onChange={(e) => setNewCoding(prev => ({ ...prev, code: e.target.value }))}
                    placeholder="e.g., N001"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="display">Display</Label>
                  <Input
                    id="display"
                    value={newCoding.display || ''}
                    onChange={(e) => setNewCoding(prev => ({ ...prev, display: e.target.value }))}
                    placeholder="e.g., Fever"
                  />
                </div>

                <div className="space-y-2">
                  <Label>&nbsp;</Label>
                  <Button onClick={addCoding} className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Coding
                  </Button>
                </div>
              </div>

              {currentCondition.codings && currentCondition.codings.length > 0 && (
                <div className="space-y-2">
                  <Label>Added Codings</Label>
                  <div className="space-y-2">
                    {currentCondition.codings.map((coding, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge className={getSystemColor(coding.system)}>
                              {getSystemLabel(coding.system)}
                            </Badge>
                            <span className="font-medium">{coding.display}</span>
                          </div>
                          <div className="text-sm text-gray-600">
                            {coding.code} | {coding.system}
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeCoding(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <Button 
                onClick={addCondition} 
                disabled={!currentCondition.codings || currentCondition.codings.length === 0}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add to Problem List
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="list" className="space-y-4">
          {conditions.length === 0 ? (
            <Alert>
              <AlertDescription>
                No conditions in the problem list. Create a condition in the "Create Condition" tab.
              </AlertDescription>
            </Alert>
          ) : (
            <div className="space-y-4">
              {conditions.map((condition) => (
                <Card key={condition.id}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant={condition.clinicalStatus === 'active' ? 'default' : 'secondary'}>
                            {condition.clinicalStatus}
                          </Badge>
                          <Badge variant="outline">{condition.verificationStatus}</Badge>
                        </div>
                        <div className="space-y-1">
                          {condition.codings.map((coding, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <Badge className={getSystemColor(coding.system)}>
                                {getSystemLabel(coding.system)}
                              </Badge>
                              <span className="font-medium">{coding.display}</span>
                              <span className="text-sm text-gray-500">({coding.code})</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeCondition(condition.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    {condition.note && (
                      <div className="text-sm text-gray-600 mt-2">
                        <strong>Notes:</strong> {condition.note}
                      </div>
                    )}
                    
                    <div className="text-xs text-gray-500 mt-2">
                      Subject: {condition.subject}
                      {condition.onsetDateTime && ` | Onset: ${new Date(condition.onsetDateTime).toLocaleDateString()}`}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="bundle" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>FHIR Bundle Preview</CardTitle>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowBundle(!showBundle)}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    {showBundle ? 'Hide' : 'Show'} JSON
                  </Button>
                  <Button
                    onClick={downloadBundle}
                    disabled={conditions.length === 0}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download Bundle
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {conditions.length === 0 ? (
                <Alert>
                  <AlertDescription>
                    No conditions available. Create conditions to generate a FHIR Bundle.
                  </AlertDescription>
                </Alert>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Bundle ready with {conditions.length} condition(s)
                  </div>
                  
                  {showBundle && (
                    <pre className="text-xs bg-gray-100 p-4 rounded overflow-auto max-h-96">
                      {JSON.stringify(generateFHIRBundle(), null, 2)}
                    </pre>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Bundle Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <strong>Bundle Type:</strong> Collection - A collection of resources for problem list management.
              </div>
              <div>
                <strong>Usage:</strong> This bundle can be POSTed to a FHIR server to create multiple Condition resources at once.
              </div>
              <div>
                <strong>Dual Coding:</strong> Each condition includes both NAMASTE and ICD-11 codes for comprehensive documentation.
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}