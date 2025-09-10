import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Avatar, AvatarFallback } from './ui/avatar';
import { motion } from 'motion/react';
import { 
  User, 
  Calendar, 
  MapPin, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Heart,
  Activity,
  Thermometer,
  Brain,
  Eye,
  Lungs,
  Coffee,
  Flower2,
  Leaf
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  AreaChart,
  Area,
  BarChart,
  Bar
} from 'recharts';

const patientProfiles = [
  {
    id: 'P001',
    name: 'Rajesh Kumar',
    age: 45,
    gender: 'Male',
    location: 'Delhi',
    avatar: 'RK',
    primaryConditions: ['Diabetes', 'Hypertension'],
    ayurvedicConstitution: 'Vata-Pitta',
    lastVisit: '2024-01-15',
    riskLevel: 'Medium'
  },
  {
    id: 'P002', 
    name: 'Priya Sharma',
    age: 32,
    gender: 'Female',
    location: 'Mumbai',
    avatar: 'PS',
    primaryConditions: ['Digestive Issues', 'Stress'],
    ayurvedicConstitution: 'Pitta-Kapha',
    lastVisit: '2024-01-18',
    riskLevel: 'Low'
  },
  {
    id: 'P003',
    name: 'Arjun Reddy',
    age: 28,
    gender: 'Male', 
    location: 'Bangalore',
    avatar: 'AR',
    primaryConditions: ['Respiratory Issues', 'Allergies'],
    ayurvedicConstitution: 'Kapha-Vata',
    lastVisit: '2024-01-20',
    riskLevel: 'High'
  }
];

const healthTrendsData = [
  { month: 'Jul', vitalScore: 78, ayurvedicBalance: 72, compliance: 85 },
  { month: 'Aug', vitalScore: 82, ayurvedicBalance: 76, compliance: 88 },
  { month: 'Sep', vitalScore: 85, ayurvedicBalance: 80, compliance: 90 },
  { month: 'Oct', vitalScore: 88, ayurvedicBalance: 83, compliance: 92 },
  { month: 'Nov', vitalScore: 91, ayurvedicBalance: 87, compliance: 94 },
  { month: 'Dec', vitalScore: 94, ayurvedicBalance: 89, compliance: 96 }
];

const constitutionData = [
  { dosha: 'Vata', current: 30, ideal: 25, fullMark: 100 },
  { dosha: 'Pitta', current: 45, ideal: 40, fullMark: 100 },
  { dosha: 'Kapha', current: 25, ideal: 35, fullMark: 100 }
];

const symptomFrequency = [
  { symptom: 'Headache', traditional: 12, modern: 8, hybrid: 15 },
  { symptom: 'Fatigue', traditional: 18, modern: 14, hybrid: 20 },
  { symptom: 'Digestive', traditional: 25, modern: 12, hybrid: 22 },
  { symptom: 'Joint Pain', traditional: 20, modern: 16, hybrid: 18 },
  { symptom: 'Sleep Issues', traditional: 15, modern: 10, hybrid: 17 }
];

const treatmentOutcomes = [
  { treatment: 'Ayurvedic Only', success: 78, partial: 15, noImprovement: 7 },
  { treatment: 'Modern Only', success: 82, partial: 12, noImprovement: 6 },
  { treatment: 'Integrated', success: 89, partial: 8, noImprovement: 3 }
];

export default function PatientInsights() {
  const [selectedPatient, setSelectedPatient] = useState(patientProfiles[0]);
  const [timeRange, setTimeRange] = useState('6months');

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'Low': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'High': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getConstitutionIcon = (constitution: string) => {
    if (constitution.includes('Vata')) return <Coffee className="w-4 h-4" />;
    if (constitution.includes('Pitta')) return <Thermometer className="w-4 h-4" />;
    if (constitution.includes('Kapha')) return <Flower2 className="w-4 h-4" />;
    return <Leaf className="w-4 h-4" />;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 bg-clip-text text-transparent mb-4">
            Patient Health Insights & Analytics
          </h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto">
            Comprehensive patient analysis combining traditional Ayurvedic assessment with modern medical diagnostics
          </p>
        </motion.div>
      </div>

      {/* Patient Selection */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="border-2 border-indigo-200">
          <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50">
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5 text-indigo-600" />
              Patient Selection & Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {patientProfiles.map((patient) => (
                <div
                  key={patient.id}
                  className={`p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 hover:shadow-lg ${
                    selectedPatient.id === patient.id 
                      ? 'border-indigo-500 bg-indigo-50 shadow-lg' 
                      : 'border-gray-200 hover:border-indigo-300'
                  }`}
                  onClick={() => setSelectedPatient(patient)}
                >
                  <div className="flex items-center gap-4 mb-4">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-medium">
                        {patient.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-bold text-gray-900">{patient.name}</h3>
                      <p className="text-sm text-gray-600">{patient.age}y, {patient.gender}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-700">{patient.location}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {getConstitutionIcon(patient.ayurvedicConstitution)}
                      <span className="text-sm text-gray-700">{patient.ayurvedicConstitution}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Badge className={getRiskLevelColor(patient.riskLevel)}>
                        {patient.riskLevel} Risk
                      </Badge>
                      <span className="text-xs text-gray-500">
                        Last: {new Date(patient.lastVisit).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Patient Details Dashboard */}
      {selectedPatient && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Health Trends */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card className="border-2 border-green-200">
              <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                  Health Progress Tracking
                </CardTitle>
                <CardDescription>
                  {selectedPatient.name}'s health metrics over time
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <div className="space-y-1">
                    <h3 className="font-bold text-lg">{selectedPatient.name}</h3>
                    <p className="text-sm text-gray-600">Current Health Score: <strong className="text-green-600">94/100</strong></p>
                  </div>
                  <Select value={timeRange} onValueChange={setTimeRange}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3months">3 Months</SelectItem>
                      <SelectItem value="6months">6 Months</SelectItem>
                      <SelectItem value="1year">1 Year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={healthTrendsData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="month" stroke="#64748b" />
                    <YAxis stroke="#64748b" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#f8fafc', 
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px'
                      }} 
                    />
                    <Line type="monotone" dataKey="vitalScore" stroke="#10b981" strokeWidth={3} dot={{ fill: '#10b981', strokeWidth: 2, r: 6 }} />
                    <Line type="monotone" dataKey="ayurvedicBalance" stroke="#f59e0b" strokeWidth={3} dot={{ fill: '#f59e0b', strokeWidth: 2, r: 6 }} />
                    <Line type="monotone" dataKey="compliance" stroke="#6366f1" strokeWidth={3} dot={{ fill: '#6366f1', strokeWidth: 2, r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
                
                <div className="flex justify-center gap-6 mt-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">Vital Score</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">Ayurvedic Balance</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-indigo-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">Treatment Compliance</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Dosha Constitution Analysis */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Card className="border-2 border-orange-200">
              <CardHeader className="bg-gradient-to-r from-orange-50 to-yellow-50">
                <CardTitle className="flex items-center gap-2">
                  <Leaf className="w-5 h-5 text-orange-600" />
                  Ayurvedic Constitution (Prakriti)
                </CardTitle>
                <CardDescription>
                  Current dosha balance vs ideal constitution
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-lg">Constitution Type</span>
                    <Badge className="bg-orange-100 text-orange-800">
                      {selectedPatient.ayurvedicConstitution}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    Current balance analysis shows mild Pitta excess. Recommend cooling herbs and practices.
                  </p>
                </div>

                <ResponsiveContainer width="100%" height={280}>
                  <RadarChart data={constitutionData}>
                    <PolarGrid stroke="#e2e8f0" />
                    <PolarAngleAxis dataKey="dosha" tick={{ fontSize: 12, fill: '#64748b' }} />
                    <PolarRadiusAxis 
                      angle={90} 
                      domain={[0, 100]} 
                      tick={{ fontSize: 10, fill: '#64748b' }}
                    />
                    <Radar
                      name="Current"
                      dataKey="current"
                      stroke="#ff6b35"
                      fill="#ff6b35"
                      fillOpacity={0.3}
                      strokeWidth={2}
                    />
                    <Radar
                      name="Ideal"
                      dataKey="ideal"
                      stroke="#10b981"
                      fill="#10b981"
                      fillOpacity={0.1}
                      strokeWidth={2}
                      strokeDasharray="5 5"
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#f8fafc', 
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px'
                      }}
                    />
                  </RadarChart>
                </ResponsiveContainer>

                <div className="flex justify-center gap-6 mt-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">Current Balance</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full border-2 border-dashed border-green-500"></div>
                    <span className="text-sm text-gray-600">Ideal Balance</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      )}

      {/* Analytics Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Symptom Frequency Analysis */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="border-2 border-blue-200">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50">
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-blue-600" />
                Symptom Pattern Analysis
              </CardTitle>
              <CardDescription>
                Comparative analysis of symptom reporting across treatment approaches
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={symptomFrequency}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="symptom" stroke="#64748b" fontSize={12} />
                  <YAxis stroke="#64748b" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#f8fafc', 
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar dataKey="traditional" fill="#ff6b35" name="Traditional Medicine" />
                  <Bar dataKey="modern" fill="#10b981" name="Modern Medicine" />
                  <Bar dataKey="hybrid" fill="#6366f1" name="Integrated Approach" />
                </BarChart>
              </ResponsiveContainer>
              <div className="flex justify-center gap-4 mt-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Traditional</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Modern</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-indigo-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Integrated</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Treatment Outcomes */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Card className="border-2 border-purple-200">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-purple-600" />
                Treatment Effectiveness
              </CardTitle>
              <CardDescription>
                Success rates across different treatment modalities
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                {treatmentOutcomes.map((outcome, index) => (
                  <div key={index} className="space-y-3">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium text-gray-800">{outcome.treatment}</h4>
                      <div className="flex items-center gap-2">
                        <Badge variant="default" className="bg-green-100 text-green-800">
                          {outcome.success}% Success
                        </Badge>
                      </div>
                    </div>
                    <div className="flex w-full h-4 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className="bg-green-500 flex items-center justify-center text-xs text-white font-medium"
                        style={{ width: `${outcome.success}%` }}
                      >
                        {outcome.success > 15 && `${outcome.success}%`}
                      </div>
                      <div 
                        className="bg-yellow-500 flex items-center justify-center text-xs text-white font-medium"
                        style={{ width: `${outcome.partial}%` }}
                      >
                        {outcome.partial > 10 && `${outcome.partial}%`}
                      </div>
                      <div 
                        className="bg-red-500 flex items-center justify-center text-xs text-white font-medium"
                        style={{ width: `${outcome.noImprovement}%` }}
                      >
                        {outcome.noImprovement > 5 && `${outcome.noImprovement}%`}
                      </div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-600">
                      <span>Complete Success</span>
                      <span>Partial Improvement</span>
                      <span>No Improvement</span>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
                <h4 className="font-medium text-purple-800 mb-2">Key Insights</h4>
                <ul className="text-sm text-purple-700 space-y-1">
                  <li>• Integrated approach shows highest success rate (89%)</li>
                  <li>• Traditional methods effective for digestive and stress-related issues</li>
                  <li>• Modern medicine excels in acute conditions</li>
                  <li>• Combined approach reduces treatment failure by 50%</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Health Recommendations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <Card className="border-2 border-yellow-200">
          <CardHeader className="bg-gradient-to-r from-yellow-50 to-orange-50">
            <CardTitle className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-yellow-600" />
              Personalized Health Recommendations
            </CardTitle>
            <CardDescription>
              AI-powered suggestions based on patient profile and health trends
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-4">
                <h4 className="font-bold text-gray-800 flex items-center gap-2">
                  <Leaf className="w-5 h-5 text-green-600" />
                  Ayurvedic Recommendations
                </h4>
                <div className="space-y-3">
                  <div className="p-3 bg-green-50 rounded-lg">
                    <p className="text-sm font-medium text-green-800">Dietary</p>
                    <p className="text-sm text-green-700">Reduce spicy foods, increase cooling herbs like fennel and coriander</p>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm font-medium text-blue-800">Lifestyle</p>
                    <p className="text-sm text-blue-700">Practice Shitali pranayama, early morning meditation</p>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <p className="text-sm font-medium text-purple-800">Herbs</p>
                    <p className="text-sm text-purple-700">Brahmi, Shankhpushpi for mental clarity and stress</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-bold text-gray-800 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-blue-600" />
                  Modern Medical
                </h4>
                <div className="space-y-3">
                  <div className="p-3 bg-red-50 rounded-lg">
                    <p className="text-sm font-medium text-red-800">Monitoring</p>
                    <p className="text-sm text-red-700">Weekly BP checks, monthly HbA1c testing</p>
                  </div>
                  <div className="p-3 bg-yellow-50 rounded-lg">
                    <p className="text-sm font-medium text-yellow-800">Preventive</p>
                    <p className="text-sm text-yellow-700">Annual cardiac screening, eye examination</p>
                  </div>
                  <div className="p-3 bg-indigo-50 rounded-lg">
                    <p className="text-sm font-medium text-indigo-800">Medications</p>
                    <p className="text-sm text-indigo-700">Continue metformin, consider ACE inhibitor</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-bold text-gray-800 flex items-center gap-2">
                  <Thermometer className="w-5 h-5 text-orange-600" />
                  Integrated Care
                </h4>
                <div className="space-y-3">
                  <div className="p-3 bg-orange-50 rounded-lg">
                    <p className="text-sm font-medium text-orange-800">Exercise</p>
                    <p className="text-sm text-orange-700">Yoga asanas + 30min walking, avoid intense workouts</p>
                  </div>
                  <div className="p-3 bg-pink-50 rounded-lg">
                    <p className="text-sm font-medium text-pink-800">Stress Management</p>
                    <p className="text-sm text-pink-700">Combine meditation with CBT techniques</p>
                  </div>
                  <div className="p-3 bg-teal-50 rounded-lg">
                    <p className="text-sm font-medium text-teal-800">Follow-up</p>
                    <p className="text-sm text-teal-700">Bi-weekly integrated consultations</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}