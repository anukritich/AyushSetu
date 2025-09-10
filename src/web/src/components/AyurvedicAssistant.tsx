import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle,CardFooter } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Avatar, AvatarFallback } from './ui/avatar';
import { motion } from 'motion/react';
import { 
  MessageSquare, 
  Send, 
  Sparkles, 
  Leaf, 
  Coffee, 
  Thermometer,
  Flower2,
  Book,
  Star,
  Lightbulb,
  Heart,
  Brain,
  Droplets,
  Wind,
  Flame,
  Mountain,
  Sun,
  Moon
} from 'lucide-react';

const chatHistory = [
  {
    type: 'user',
    message: 'I have been experiencing digestive issues and stress. What would be the traditional Ayurvedic approach?',
    timestamp: '10:30 AM'
  },
  {
    type: 'assistant',
    message: 'Based on your symptoms, this appears to be a Pitta-Vata imbalance. In Ayurveda, digestive issues combined with stress indicate "Agni Mandya" (weak digestive fire) and "Vata Vriddhi" (excess air element). \n\nRecommended approach:\n\n🔥 **Agni Enhancement**: Ginger-lemon tea before meals, cumin-coriander-fennel tea\n\n🍃 **Herbs**: Brahmi for stress, Shankhpushpi for mental clarity, Ashwagandha for adaptogenic support\n\n🧘 **Lifestyle**: Practice Nadi Shodhana pranayama, eat warm cooked foods, maintain regular meal times\n\n💆 **Therapies**: Abhyanga (oil massage) with warm sesame oil, Shirodhara for stress relief',
    timestamp: '10:32 AM',
    confidence: 95
  },
  {
    type: 'user',
    message: 'How does this correlate with modern medical understanding?',
    timestamp: '10:35 AM'
  },
  {
    type: 'assistant',
    message: 'Excellent question! There\'s remarkable alignment between Ayurvedic and modern perspectives:\n\n🧬 **Modern Understanding**:\n- Stress affects gut-brain axis via vagus nerve\n- Cortisol disrupts digestive enzymes\n- Inflammatory markers increase with chronic stress\n\n🔄 **Ayurvedic Correlation**:\n- Vata governs nervous system (gut-brain axis)\n- Pitta manages digestive enzymes (Agni)\n- Stress creates "Ama" (toxins/inflammation)\n\n**FHIR Integration**: Your symptoms map to:\n- NAMASTE: V12.3 (Vataja Grahani) + M15.1 (Manasika Chinta)\n- ICD-11: MD90.0 (Functional dyspepsia) + QE10 (Stress-related disorder)\n\nThis dual coding enables comprehensive treatment tracking.',
    timestamp: '10:37 AM',
    confidence: 92
  }
];

const ayurvedicConditions = [
  {
    category: 'Digestive (पाचन)',
    conditions: [
      { name: 'Agnimandya', code: 'A001', description: 'Weak digestive fire', dosha: 'Pitta-Kapha' },
      { name: 'Ama', code: 'A002', description: 'Undigested toxins', dosha: 'Kapha' },
      { name: 'Grahani', code: 'A003', description: 'IBS-like condition', dosha: 'Vata-Pitta' }
    ]
  },
  {
    category: 'Mental (मानसिक)',
    conditions: [
      { name: 'Chittodvega', code: 'M001', description: 'Anxiety/restlessness', dosha: 'Vata' },
      { name: 'Manasika Chinta', code: 'M002', description: 'Mental worry/stress', dosha: 'Vata' },
      { name: 'Smriti Bhramsha', code: 'M003', description: 'Memory issues', dosha: 'Vata-Kapha' }
    ]
  },
  {
    category: 'Respiratory (श्वसन)',
    conditions: [
      { name: 'Shwasa', code: 'R001', description: 'Breathing difficulties', dosha: 'Vata-Kapha' },
      { name: 'Kasa', code: 'R002', description: 'Chronic cough', dosha: 'Kapha' },
      { name: 'Pratishyaya', code: 'R003', description: 'Allergic rhinitis', dosha: 'Kapha-Vata' }
    ]
  }
];

const treatmentModalities = [
  { name: 'Panchakarma', icon: Droplets, color: 'text-blue-600', description: 'Detoxification therapies' },
  { name: 'Pranayama', icon: Wind, color: 'text-green-600', description: 'Breathing techniques' },
  { name: 'Rasayana', icon: Leaf, color: 'text-emerald-600', description: 'Rejuvenation therapy' },
  { name: 'Satvavajaya', icon: Brain, color: 'text-purple-600', description: 'Psychotherapy' },
  { name: 'Dinacharya', icon: Sun, color: 'text-yellow-600', description: 'Daily routine' },
  { name: 'Ritucharya', icon: Mountain, color: 'text-orange-600', description: 'Seasonal regimen' }
];

const doshaCharacteristics = {
  vata: {
    label: "Vata (वात)",
    icon: Wind,
    color: 'from-blue-400 to-cyan-500',
    qualities: ['Light', 'Dry', 'Cold', 'Mobile', 'Rough'],
    functions: ['Movement', 'Circulation', 'Nervous System'],
    imbalance: ['Anxiety', 'Insomnia', 'Constipation', 'Joint Pain']
  },
  pitta: {
    label: "Pitta (पित्त)",
    icon: Flame,
    color: 'from-red-400 to-orange-500',
    qualities: ['Hot', 'Sharp', 'Light', 'Liquid', 'Oily'],
    functions: ['Metabolism', 'Digestion', 'Body Temperature'],
    imbalance: ['Acidity', 'Skin Issues', 'Anger', 'Inflammation']
  },
  kapha: {
    label: "Kapha (कफ)",
    icon: Droplets,
    color: 'from-green-400 to-emerald-500',
    qualities: ['Heavy', 'Slow', 'Cool', 'Stable', 'Smooth'],
    functions: ['Structure', 'Immunity', 'Lubrication'],
    imbalance: ['Weight Gain', 'Congestion', 'Depression', 'Lethargy']
  }
};

export default function AyurvedicAssistant() {
  const [message, setMessage] = useState('');
  const [selectedCondition, setSelectedCondition] = useState('');
  const [selectedDosha, setSelectedDosha] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSendMessage = async () => {
    if (!message.trim()) return;
    
    setIsTyping(true);
    // Simulate AI response delay
    setTimeout(() => {
      setIsTyping(false);
      setMessage('');
    }, 2000);
  };

  const getDoshaIcon = (dosha: string) => {
    if (dosha.includes('Vata ( वात )')) return <Wind className="w-4 h-4 text-blue-600" />;
    if (dosha.includes('Pitta ( पित्त )')) return <Flame className="w-4 h-4 text-red-600" />;
    if (dosha.includes('Kapha ( कफ )')) return <Droplets className="w-4 h-4 text-green-600" />;
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
          <div className="flex justify-center items-center gap-4 mb-4">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            >
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
            </motion.div>
            <h2 className="text-4xl font-bold bg-gradient-to-r from-orange-600 via-red-600 to-purple-600 bg-clip-text text-transparent">
              AyurVedic AI Assistant
            </h2>
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            >
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                <Leaf className="w-8 h-8 text-white" />
              </div>
            </motion.div>
          </div>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto">
            Advanced AI-powered Ayurvedic consultation with FHIR integration • वेदान्तं चिकित्सा शास्त्रम्
          </p>
          <p className="text-lg text-gray-500 mt-2">
            Traditional wisdom meets modern digital healthcare
          </p>
        </motion.div>
      </div>

      {/* Dosha Analysis Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {Object.entries(doshaCharacteristics).map(([dosha, details]) => (
          <motion.div
            key={dosha}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: Object.keys(doshaCharacteristics).indexOf(dosha) * 0.1 }}
          >
            <Card className="border-2 hover:shadow-xl transition-all duration-300">
              <CardHeader className={`bg-gradient-to-br ${details.color} text-white`}>
                <CardTitle className="flex items-center gap-3 text-white">
                  <details.icon className="w-6 h-6" />
                  <span className="capitalize font-bold">{details.label}</span>
                </CardTitle>
                <CardDescription className="text-white/90">
                  {dosha === 'vata' && 'Movement & Nervous System'}
                  {dosha === 'pitta' && 'Metabolism & Digestion'}
                  {dosha === 'kapha' && 'Structure & Immunity'}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-800 mb-2">Qualities (गुण)</h4>
                    <div className="flex flex-wrap gap-1">
                      {details.qualities.map((quality) => (
                        <Badge key={quality} variant="outline" className="text-xs">
                          {quality}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-800 mb-2">Functions</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {details.functions.map((func) => (
                        <li key={func} className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                          {func}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-800 mb-2">Imbalance Signs</h4>
                    <ul className="text-sm text-red-600 space-y-1">
                      {details.imbalance.map((sign) => (
                        <li key={sign} className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                          {sign}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Chat Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chat History */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Card className="border-2 border-indigo-200 h-96 flex flex-col">
  {/* Header */}
  <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50">
    <CardTitle className="flex items-center gap-2">
      <MessageSquare className="w-5 h-5 text-indigo-600" />
      AI Consultation Chat
    </CardTitle>
    <CardDescription>
      Intelligent Ayurvedic health assistant with FHIR code mapping
    </CardDescription>
  </CardHeader>

  {/* Messages */}
  <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
    {chatHistory.map((chat, index) => (
      <div key={index} className={`flex ${chat.type === 'user' ? 'justify-end' : 'justify-start'}`}>
        <div
          className={`max-w-xs lg:max-w-md xl:max-w-lg ${
            chat.type === 'user'
              ? 'bg-indigo-600 text-white rounded-l-2xl rounded-tr-2xl'
              : 'bg-gray-100 text-gray-800 rounded-r-2xl rounded-tl-2xl'
          } p-3`}
        >
          {chat.type === 'assistant' && (
            <div className="flex items-center gap-2 mb-2">
              <Avatar className="h-6 w-6">
                <AvatarFallback className="bg-gradient-to-br from-orange-500 to-red-500 text-white text-xs">
                  AI
                </AvatarFallback>
              </Avatar>
              <span className="text-xs font-medium text-gray-600">AyurVedic AI</span>
              {chat.confidence && (
                <Badge variant="outline" className="text-xs">
                  {chat.confidence}% confident
                </Badge>
              )}
            </div>
          )}
          <p className="text-sm whitespace-pre-line">{chat.message}</p>
          <span className="text-xs opacity-75 mt-2 block">{chat.timestamp}</span>
        </div>
      </div>
    ))}

    {isTyping && (
      <div className="flex justify-start">
        <div className="bg-gray-100 rounded-r-2xl rounded-tl-2xl p-3">
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarFallback className="bg-gradient-to-br from-orange-500 to-red-500 text-white text-xs">
                AI
              </AvatarFallback>
            </Avatar>
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
          </div>
        </div>
      </div>
    )}
  </CardContent>

  {/* Input */}
  <CardFooter className="p-3 border-t">
    <div className="flex items-center w-full border rounded-lg overflow-hidden">
      <Input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Ask about symptoms, treatments, or doshas..."
        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
        className="flex-1 border-0 focus:ring-0 focus:outline-none"
      />
      <Button
        onClick={handleSendMessage}
        disabled={!message.trim() || isTyping}
        className="rounded-none"
      >
        <Send className="w-4 h-4" />
      </Button>
    </div>
  </CardFooter>
</Card>

        </motion.div>

        {/* Condition Database */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Card className="border-2 border-green-200 h-96">
            <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
              <CardTitle className="flex items-center gap-2">
                <Book className="w-5 h-5 text-green-600" />
                Ayurvedic Condition Database
              </CardTitle>
              <CardDescription>
                Traditional conditions with modern FHIR code mapping
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 h-80 overflow-y-auto">
              <div className="space-y-4">
                {ayurvedicConditions.map((category, categoryIndex) => (
                  <div key={categoryIndex}>
                    <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                      <Star className="w-4 h-4 text-yellow-500" />
                      {category.category}
                    </h4>
                    <div className="space-y-2 ml-6">
                      {category.conditions.map((condition, conditionIndex) => (
                        <div 
                          key={conditionIndex}
                          className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                          onClick={() => setSelectedCondition(condition.name)}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h5 className="font-medium text-gray-900">{condition.name}</h5>
                              <p className="text-sm text-gray-600">{condition.description}</p>
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {condition.code}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2">
                            {getDoshaIcon(condition.dosha)}
                            <span className="text-xs text-gray-500">{condition.dosha} predominant</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Treatment Modalities */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <Card className="border-2 border-yellow-200">
          <CardHeader className="bg-gradient-to-r from-yellow-50 to-orange-50">
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-yellow-600" />
              Traditional Treatment Modalities (चिकित्सा पद्धति)
            </CardTitle>
            <CardDescription>
              Comprehensive Ayurvedic therapeutic approaches integrated with modern healthcare
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {treatmentModalities.map((modality, index) => (
                <motion.div
                  key={modality.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="p-4 border-2 border-gray-100 rounded-xl hover:border-orange-300 hover:shadow-lg transition-all duration-300 cursor-pointer"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-100 to-yellow-100 rounded-full flex items-center justify-center">
                      <modality.icon className={`w-6 h-6 ${modality.color}`} />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800">{modality.name}</h4>
                      <p className="text-sm text-gray-600">{modality.description}</p>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full text-sm">
                    Learn More
                  </Button>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <Card className="border-2 border-purple-200">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
            <CardTitle className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-purple-600" />
              Quick Consultation Tools
            </CardTitle>
            <CardDescription>
              Instant assessment and recommendation tools
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button className="h-20 flex flex-col items-center gap-2 bg-gradient-to-br from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600">
                <Wind className="w-6 h-6" />
                <span>Dosha Quiz</span>
              </Button>
              <Button className="h-20 flex flex-col items-center gap-2 bg-gradient-to-br from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600">
                <Leaf className="w-6 h-6" />
                <span>Herb Guide</span>
              </Button>
              <Button className="h-20 flex flex-col items-center gap-2 bg-gradient-to-br from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600">
                <Flame className="w-6 h-6" />
                <span>Agni Test</span>
              </Button>
              <Button className="h-20 flex flex-col items-center gap-2 bg-gradient-to-br from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                <Moon className="w-6 h-6" />
                <span>Sleep Analysis</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}