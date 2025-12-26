import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

import AnimatedBackground from '@/components/ui/AnimatedBackground';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

import { 
  ArrowLeft,
  Play,
  ChevronRight,
  Check,
  Globe,
  MessageCircle,
  Search,
  Mic,
  Smartphone,
  Monitor,
  Shield
} from 'lucide-react';

const demoCommands = [
  {
    id: 1,
    category: 'Navigation',
    commands: [
      { text: 'Open Flipkart', result: 'Opens flipkart.com in new tab', status: 'web' },
      { text: 'Open YouTube', result: 'Opens youtube.com in new tab', status: 'web' },
      { text: 'Navigate to Gmail', result: 'Opens mail.google.com', status: 'web' },
      { text: 'Open Facebook notifications', result: 'Opens facebook.com/notifications', status: 'web' },
    ]
  },
  {
    id: 2,
    category: 'Search',
    commands: [
      { text: 'Search for running shoes under 3000', result: 'Google search results', status: 'web' },
      { text: 'Google latest tech news', result: 'Opens Google with search query', status: 'web' },
      { text: 'Find restaurants near me', result: 'Google Maps search', status: 'web' },
    ]
  },
  {
    id: 3,
    category: 'Messaging',
    commands: [
      { text: 'Send WhatsApp to Mom: I\'m on my way', result: 'Opens WhatsApp with message', status: 'deeplink' },
      { text: 'Compose email to team', result: 'Opens Gmail compose', status: 'deeplink' },
      { text: 'Send SMS to John', result: 'Opens SMS app (mobile)', status: 'mobile' },
    ]
  },
  {
    id: 4,
    category: 'System',
    commands: [
      { text: 'What can you do?', result: 'Shows capabilities list', status: 'info' },
      { text: 'Show my history', result: 'Opens command history', status: 'info' },
      { text: 'Help', result: 'Opens help center', status: 'info' },
    ]
  }
];

const statusColors = {
  web: { bg: 'bg-green-500/20', text: 'text-green-400', label: 'Web' },
  deeplink: { bg: 'bg-blue-500/20', text: 'text-blue-400', label: 'Deep Link' },
  mobile: { bg: 'bg-purple-500/20', text: 'text-purple-400', label: 'Mobile' },
  info: { bg: 'bg-gray-500/20', text: 'text-gray-400', label: 'Info' },
};

const features = [
  { icon: Globe, title: 'Web Navigation', desc: 'Open any website with voice' },
  { icon: Search, title: 'Smart Search', desc: 'Search the web naturally' },
  { icon: MessageCircle, title: 'Messaging', desc: 'Send messages via deep links' },
  { icon: Shield, title: 'Secure', desc: 'Confirmation for sensitive actions' },
  { icon: Mic, title: 'Voice Input', desc: '20+ languages supported' },
  { icon: Monitor, title: 'Cross-Platform', desc: 'Works on any modern browser' },
];

export default function Demo() {
  const [selectedCategory, setSelectedCategory] = useState(null);

  return (
    <div className="min-h-screen relative">
      <AnimatedBackground />

      <div className="relative z-10 max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center gap-4">
            <Link
              to={createPageUrl('Home')}
              className="p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-400" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-white">Demo & Capabilities</h1>
              <p className="text-gray-500 text-sm">See what the assistant can do</p>
            </div>
          </div>

          <Link to={createPageUrl('Home')}>
            <Button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600">
              <Play className="w-4 h-4 mr-2" />
              Try It Now
            </Button>
          </Link>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-4"
            >
              <feature.icon className="w-8 h-8 text-blue-400 mb-3" />
              <h3 className="text-white font-medium">{feature.title}</h3>
              <p className="text-sm text-gray-500">{feature.desc}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Command Categories */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-xl font-semibold text-white mb-4">Supported Commands</h2>
          
          <div className="space-y-4">
            {demoCommands.map((category, catIndex) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: catIndex * 0.1 }}
                className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden"
              >
                <button
                  onClick={() => setSelectedCategory(
                    selectedCategory === category.id ? null : category.id
                  )}
                  className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors"
                >
                  <h3 className="text-white font-medium">{category.category}</h3>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="bg-white/10 text-gray-300">
                      {category.commands.length} commands
                    </Badge>
                    <ChevronRight className={`w-5 h-5 text-gray-500 transition-transform ${
                      selectedCategory === category.id ? 'rotate-90' : ''
                    }`} />
                  </div>
                </button>

                {selectedCategory === category.id && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: 'auto' }}
                    className="border-t border-white/10"
                  >
                    <div className="p-4 space-y-3">
                      {category.commands.map((cmd, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5"
                        >
                          <div className="flex-1">
                            <p className="text-white font-medium">"{cmd.text}"</p>
                            <p className="text-sm text-gray-500 mt-0.5">{cmd.result}</p>
                          </div>
                          <Badge className={`${statusColors[cmd.status].bg} ${statusColors[cmd.status].text} border-0`}>
                            {statusColors[cmd.status].label}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Platform Support */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8"
        >
          <h2 className="text-xl font-semibold text-white mb-4">How It Works</h2>
          
          <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-2xl border border-blue-500/20 p-6">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center mx-auto mb-3">
                  <Mic className="w-6 h-6 text-blue-400" />
                </div>
                <h4 className="text-white font-medium mb-1">1. Speak or Type</h4>
                <p className="text-sm text-gray-400">Use voice or text to give commands</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center mx-auto mb-3">
                  <Monitor className="w-6 h-6 text-purple-400" />
                </div>
                <h4 className="text-white font-medium mb-1">2. AI Processing</h4>
                <p className="text-sm text-gray-400">AI understands your intent</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center mx-auto mb-3">
                  <Check className="w-6 h-6 text-green-400" />
                </div>
                <h4 className="text-white font-medium mb-1">3. Execute Action</h4>
                <p className="text-sm text-gray-400">Action performed securely</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Limitations Notice */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20"
        >
          <h3 className="text-amber-400 font-medium mb-2">Web Platform Limitations</h3>
          <p className="text-sm text-amber-200/80">
            This web-based assistant uses browser APIs and deep links. Some actions like directly 
            controlling phone apps require a companion mobile app. Messaging features open the 
            respective apps with pre-filled content - you'll need to confirm sending manually.
          </p>
        </motion.div>
      </div>
    </div>
  );
}