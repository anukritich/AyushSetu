import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';
import AuthConfig from './components/AuthConfig';
import TerminologySearch from './components/TerminologySearch';
import CodeMapping from './components/CodeMapping';
import ProblemList from './components/ProblemList';
import Dashboard from './components/Dashboard';
import PatientInsights from './components/PatientInsights';
import AyurvedicAssistant from './components/AyurvedicAssistant';
import { AuthProvider } from './components/AuthContext';
import { ImageWithFallback } from './components/figma/ImageWithFallback';
import { motion } from 'motion/react';
import { Heart, Stethoscope, Users, Activity, Sparkles, Flower2 } from 'lucide-react';

export default function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen" style={{
        background: 'linear-gradient(135deg, #fff8dc 0%, #ffffff 30%, #f0fff0 70%, #ffe4b5 100%)',
      }}>
        {/* Header with Indian-inspired design */}
        <div className="relative overflow-hidden">
          <div 
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `url("https://images.unsplash.com/photo-1703145219083-6037d97decb5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBtZWRpY2FsJTIwcGF0dGVybiUyMG1hbmRhbGF8ZW58MXx8fHwxNzU2NjcxNzY0fDA&ixlib=rb-4.1.0&q=80&w=1080")`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          />
          
          <div className="relative border-b-4 border-gradient-to-r from-orange-500 via-white to-green-500 p-6">
            <div className="max-w-7xl mx-auto">
              <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-center"
              >
                <div className="flex justify-center items-center gap-4 mb-4">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  >
                    <Flower2 className="w-12 h-12 text-orange-500" />
                  </motion.div>
                  <h1 className="text-5xl font-bold bg-gradient-to-r from-orange-500 via-green-600 to-orange-500 bg-clip-text text-transparent">
                    आयुष FHIR Platform
                  </h1>
                  <motion.div
                    animate={{ rotate: -360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  >
                    <Sparkles className="w-12 h-12 text-green-600" />
                  </motion.div>
                </div>
                
                <p className="text-xl text-gray-700 mb-2">
                  स्वास्थ्य सेवा का डिजिटल भविष्य | The Digital Future of Healthcare
                </p>
                <p className="text-lg text-gray-600">
                  Advanced FHIR R4 Terminology Service with NAMASTE & ICD-11 Integration
                </p>
                
                <div className="flex justify-center gap-8 mt-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Stethoscope className="w-8 h-8 text-white" />
                    </div>
                    <p className="text-sm font-medium text-gray-700">Traditional Medicine</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Activity className="w-8 h-8 text-white" />
                    </div>
                    <p className="text-sm font-medium text-gray-700">Modern Healthcare</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Heart className="w-8 h-8 text-white" />
                    </div>
                    <p className="text-sm font-medium text-gray-700">Patient Care</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Users className="w-8 h-8 text-white" />
                    </div>
                    <p className="text-sm font-medium text-gray-700">Community Health</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto p-6">
          <Tabs defaultValue="dashboard" className="space-y-6">
            <TabsList className="grid w-full grid-cols-7 h-14 bg-white/80 backdrop-blur-sm border-2 border-orange-200">
              <TabsTrigger value="dashboard" className="text-sm font-medium data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-orange-600 data-[state=active]:text-white">
                🏠 Dashboard
              </TabsTrigger>
              <TabsTrigger value="auth" className="text-sm font-medium data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-green-600 data-[state=active]:text-white">
                🔐 Auth
              </TabsTrigger>
              <TabsTrigger value="search" className="text-sm font-medium data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-blue-600 data-[state=active]:text-white">
                🔍 Search
              </TabsTrigger>
              <TabsTrigger value="mapping" className="text-sm font-medium data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-purple-600 data-[state=active]:text-white">
                🗺️ Mapping
              </TabsTrigger>
              <TabsTrigger value="problems" className="text-sm font-medium data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-500 data-[state=active]:to-red-600 data-[state=active]:text-white">
                📋 Problems
              </TabsTrigger>
              <TabsTrigger value="insights" className="text-sm font-medium data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-500 data-[state=active]:to-yellow-600 data-[state=active]:text-white">
                📊 Insights
              </TabsTrigger>
              <TabsTrigger value="assistant" className="text-sm font-medium data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-indigo-600 data-[state=active]:text-white">
                🕉️ Ayurvedic AI
              </TabsTrigger>
            </TabsList>

            <TabsContent value="dashboard" className="space-y-6">
              <Dashboard />
            </TabsContent>

            <TabsContent value="auth" className="space-y-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Card className="border-2 border-gradient-to-r from-orange-200 to-green-200 shadow-xl">
                  <CardHeader className="bg-gradient-to-r from-orange-50 to-green-50">
                    <CardTitle className="text-2xl text-gray-800">🔐 API Configuration</CardTitle>
                    <CardDescription className="text-gray-600">
                      Configure your secure FHIR terminology service connection
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    <AuthConfig />
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            <TabsContent value="search" className="space-y-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Card className="border-2 border-blue-200 shadow-xl">
                  <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
                    <CardTitle className="text-2xl text-gray-800">🔍 Advanced Terminology Search</CardTitle>
                    <CardDescription className="text-gray-600">
                      Intelligent search across NAMASTE, ICD-11, and traditional medicine terminologies
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    <TerminologySearch />
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            <TabsContent value="mapping" className="space-y-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Card className="border-2 border-purple-200 shadow-xl">
                  <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
                    <CardTitle className="text-2xl text-gray-800">🗺️ Intelligent Code Mapping</CardTitle>
                    <CardDescription className="text-gray-600">
                      AI-powered mapping between NAMASTE and ICD-11 with confidence scoring
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    <CodeMapping />
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            <TabsContent value="problems" className="space-y-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Card className="border-2 border-red-200 shadow-xl">
                  <CardHeader className="bg-gradient-to-r from-red-50 to-orange-50">
                    <CardTitle className="text-2xl text-gray-800">📋 Comprehensive Problem List</CardTitle>
                    <CardDescription className="text-gray-600">
                      Create detailed FHIR Condition resources with dual traditional-modern coding
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    <ProblemList />
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            <TabsContent value="insights" className="space-y-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <PatientInsights />
              </motion.div>
            </TabsContent>

            <TabsContent value="assistant" className="space-y-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <AyurvedicAssistant />
              </motion.div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Footer with Indian design elements */}
        <footer className="mt-12 border-t-4 border-gradient-to-r from-orange-500 via-white to-green-500 bg-gradient-to-r from-orange-50 to-green-50 p-8">
          <div className="max-w-7xl mx-auto text-center">
            <div className="flex justify-center items-center gap-2 mb-4">
              <Flower2 className="w-6 h-6 text-orange-500" />
              <p className="text-gray-700 font-medium">
                सर्वे भवन्तु सुखिनः सर्वे सन्तु निरामयाः | May all beings be healthy and happy
              </p>
              <Flower2 className="w-6 h-6 text-green-500" />
            </div>
            <p className="text-sm text-gray-600">
              Built with ❤️ for the future of integrated traditional and modern healthcare in India
            </p>
          </div>
        </footer>
      </div>
    </AuthProvider>
  );
}