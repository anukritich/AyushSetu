import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { motion } from 'motion/react';
import { 
  TrendingUp, 
  Users, 
  Activity, 
  Heart, 
  Stethoscope, 
  BookOpen,
  MapPin,
  Zap,
  Award,
  Target,
  Globe,
  Search
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar
} from 'recharts';

const searchTrendsData = [
  { name: 'Jan', namaste: 1200, icd11: 800, traditional: 600 },
  { name: 'Feb', namaste: 1500, icd11: 950, traditional: 750 },
  { name: 'Mar', namaste: 1800, icd11: 1100, traditional: 900 },
  { name: 'Apr', namaste: 2200, icd11: 1400, traditional: 1100 },
  { name: 'May', namaste: 2800, icd11: 1800, traditional: 1350 },
  { name: 'Jun', namaste: 3200, icd11: 2100, traditional: 1600 }
];

const conditionDistribution = [
  { name: 'Respiratory', value: 30, color: '#ff6b35' },
  { name: 'Digestive', value: 25, color: '#138808' },
  { name: 'Musculoskeletal', value: 20, color: '#4c51bf' },
  { name: 'Circulatory', value: 15, color: '#f6ad55' },
  { name: 'Others', value: 10, color: '#9c4221' }
];

const mappingAccuracy = [
  { system: 'NAMASTE → ICD-11 TM2', accuracy: 85, total: 1240 },
  { system: 'NAMASTE → ICD-11 Biomed', accuracy: 78, total: 980 },
  { system: 'Ayurvedic → Modern', accuracy: 82, total: 756 },
  { system: 'Unani → ICD-11', accuracy: 76, total: 543 }
];

const regionalUsage = [
  { region: 'North India', namaste: 45, icd11: 35, hybrid: 20 },
  { region: 'South India', namaste: 38, icd11: 42, hybrid: 20 },
  { region: 'West India', namaste: 42, icd11: 38, hybrid: 20 },
  { region: 'East India', namaste: 48, icd11: 32, hybrid: 20 },
  { region: 'Central India', namaste: 52, icd11: 28, hybrid: 20 }
];

const stats = [
  {
    title: "Active Searches Today",
    value: "3,847",
    change: "+12.5%",
    icon: Search,
    color: "from-blue-500 to-blue-600",
    bgColor: "bg-blue-50"
  },
  {
    title: "Successful Mappings",
    value: "2,156",
    change: "+8.2%",
    icon: MapPin,
    color: "from-green-500 to-green-600",
    bgColor: "bg-green-50"
  },
  {
    title: "Problem Lists Created",
    value: "1,234",
    change: "+15.3%",
    icon: Heart,
    color: "from-red-500 to-red-600",
    bgColor: "bg-red-50"
  },
  {
    title: "API Response Time",
    value: "124ms",
    change: "-5.8%",
    icon: Zap,
    color: "from-yellow-500 to-yellow-600",
    bgColor: "bg-yellow-50"
  }
];

export default function Dashboard() {
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl font-bold bg-gradient-to-r from-orange-600 via-green-600 to-blue-600 bg-clip-text text-transparent mb-4">
            Healthcare Intelligence Dashboard
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Real-time insights into terminology usage, mapping accuracy, and healthcare digitization trends across India
          </p>
        </motion.div>
      </div>

      {/* Key Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="border-2 hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                    <div className="flex items-center mt-2">
                      <Badge 
                        variant={stat.change.startsWith('+') ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {stat.change}
                      </Badge>
                      <span className="text-xs text-gray-500 ml-2">vs last month</span>
                    </div>
                  </div>
                  <div className={`w-16 h-16 bg-gradient-to-br ${stat.color} rounded-2xl flex items-center justify-center`}>
                    <stat.icon className="w-8 h-8 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Search Trends */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Card className="border-2 border-blue-200">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                Search Trends Analytics
              </CardTitle>
              <CardDescription>
                Monthly terminology search patterns across different systems
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={searchTrendsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="name" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#f8fafc', 
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px'
                    }} 
                  />
                  <Area type="monotone" dataKey="namaste" stackId="1" stroke="#ff6b35" fill="#ff6b35" fillOpacity={0.6} />
                  <Area type="monotone" dataKey="icd11" stackId="1" stroke="#138808" fill="#138808" fillOpacity={0.6} />
                  <Area type="monotone" dataKey="traditional" stackId="1" stroke="#4c51bf" fill="#4c51bf" fillOpacity={0.6} />
                </AreaChart>
              </ResponsiveContainer>
              <div className="flex justify-center gap-6 mt-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">NAMASTE</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                  <span className="text-sm text-gray-600">ICD-11</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-indigo-600 rounded-full"></div>
                  <span className="text-sm text-gray-600">Traditional</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Condition Distribution */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Card className="border-2 border-orange-200">
            <CardHeader className="bg-gradient-to-r from-orange-50 to-red-50">
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-orange-600" />
                Top Condition Categories
              </CardTitle>
              <CardDescription>
                Distribution of most commonly searched medical conditions
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={conditionDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={120}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {conditionDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => [`${value}%`, 'Percentage']}
                    contentStyle={{ 
                      backgroundColor: '#f8fafc', 
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-2 gap-2 mt-4">
                {conditionDistribution.map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                    <span className="text-sm text-gray-600">{item.name} ({item.value}%)</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Mapping Accuracy */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="border-2 border-green-200">
            <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-green-600" />
                Mapping Accuracy Dashboard
              </CardTitle>
              <CardDescription>
                AI-powered code mapping accuracy across different terminology systems
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              {mappingAccuracy.map((mapping, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-700">{mapping.system}</span>
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant={mapping.accuracy >= 80 ? "default" : "secondary"}
                        className="text-xs"
                      >
                        {mapping.accuracy}%
                      </Badge>
                      <span className="text-xs text-gray-500">({mapping.total} total)</span>
                    </div>
                  </div>
                  <Progress 
                    value={mapping.accuracy} 
                    className="h-3"
                    style={{
                      backgroundColor: '#f1f5f9'
                    }}
                  />
                </div>
              ))}
              <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Award className="w-5 h-5 text-green-600" />
                  <span className="font-medium text-green-800">Overall Performance</span>
                </div>
                <p className="text-sm text-green-700">
                  Average mapping accuracy: <strong>80.2%</strong> | Total mappings: <strong>3,519</strong>
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Regional Usage */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Card className="border-2 border-purple-200">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-purple-600" />
                Regional Usage Patterns
              </CardTitle>
              <CardDescription>
                Terminology system preferences across different Indian regions
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={regionalUsage} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis type="number" stroke="#64748b" />
                  <YAxis type="category" dataKey="region" stroke="#64748b" width={80} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#f8fafc', 
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar dataKey="namaste" stackId="a" fill="#ff6b35" />
                  <Bar dataKey="icd11" stackId="a" fill="#138808" />
                  <Bar dataKey="hybrid" stackId="a" fill="#4c51bf" />
                </BarChart>
              </ResponsiveContainer>
              <div className="flex justify-center gap-6 mt-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">NAMASTE Preference</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                  <span className="text-sm text-gray-600">ICD-11 Preference</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-indigo-600 rounded-full"></div>
                  <span className="text-sm text-gray-600">Hybrid Usage</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Recent Activities */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <Card className="border-2 border-gray-200">
          <CardHeader className="bg-gradient-to-r from-gray-50 to-slate-50">
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-gray-600" />
              Recent Platform Activity
            </CardTitle>
            <CardDescription>
              Live feed of terminology searches, mappings, and system integrations
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {[
                { 
                  time: '2 min ago', 
                  action: 'New NAMASTE code mapped', 
                  details: 'Fever (N001) → ICD-11 MG30.0 with 87% confidence',
                  icon: MapPin,
                  color: 'text-green-600'
                },
                { 
                  time: '5 min ago', 
                  action: 'Problem list created', 
                  details: 'Patient condition with dual coding: Traditional + Modern',
                  icon: Heart,
                  color: 'text-red-600'
                },
                { 
                  time: '8 min ago', 
                  action: 'Terminology search spike', 
                  details: 'Respiratory conditions: 45% increase in searches',
                  icon: TrendingUp,
                  color: 'text-blue-600'
                },
                { 
                  time: '12 min ago', 
                  action: 'API integration successful', 
                  details: 'New healthcare provider connected to FHIR services',
                  icon: Zap,
                  color: 'text-yellow-600'
                },
                { 
                  time: '15 min ago', 
                  action: 'AI Assistant query', 
                  details: 'Ayurvedic treatment recommendation for digestive issues',
                  icon: BookOpen,
                  color: 'text-purple-600'
                }
              ].map((activity, index) => (
                <div key={index} className="flex items-start gap-4 p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                  <div className={`w-10 h-10 rounded-full bg-white flex items-center justify-center ${activity.color}`}>
                    <activity.icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-gray-900">{activity.action}</h4>
                      <span className="text-sm text-gray-500">{activity.time}</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{activity.details}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}