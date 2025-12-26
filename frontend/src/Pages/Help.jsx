import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

import AnimatedBackground from '@/components/ui/AnimatedBackground';
import { Input } from '@/components/ui/input';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

import { 
  ArrowLeft, 
  Search, 
  HelpCircle, 
  Globe, 
  MessageCircle, 
  Mic,
  BookOpen,
  ChevronRight,
  ExternalLink,
  Zap,
  Shield
} from 'lucide-react';

const categories = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    icon: BookOpen,
    color: 'from-blue-500 to-cyan-500',
    items: [
      {
        question: 'How do I use voice commands?',
        answer: 'Click the microphone button and speak your command clearly. The assistant will process your voice and respond accordingly. Make sure to grant microphone permission when prompted.'
      },
      {
        question: 'What languages are supported?',
        answer: 'The assistant supports 20+ languages including English, Spanish, French, German, Chinese, Japanese, Hindi, Arabic, and more. Select your preferred language from the dropdown in the header.'
      },
      {
        question: 'How do I switch to text input?',
        answer: 'Click the "Text" button below the main interface to switch from voice to text input mode. You can type your commands and press Enter or click the send button.'
      }
    ]
  },
  {
    id: 'commands',
    title: 'Available Commands',
    icon: Zap,
    color: 'from-purple-500 to-pink-500',
    items: [
      {
        question: 'What can I ask the assistant to do?',
        answer: 'You can ask to: Open websites (Chrome, Flipkart, Facebook, YouTube), search the web, send WhatsApp messages, compose emails, navigate to specific pages, and get help with commands.'
      },
      {
        question: 'How do I open a specific website?',
        answer: 'Simply say "Open [website name]" or "Navigate to [URL]". For example: "Open Flipkart", "Open YouTube", or "Navigate to gmail.com".'
      },
      {
        question: 'How do I send a WhatsApp message?',
        answer: 'Say "Send a WhatsApp to [contact name] saying [your message]". For example: "Send a WhatsApp to Mom saying I\'ll be home late". You\'ll be asked to confirm before sending.'
      },
      {
        question: 'Can I search for things online?',
        answer: 'Yes! Say "Search for [your query]" or "Google [topic]". For example: "Search for running shoes under 3000" or "Google latest tech news".'
      }
    ]
  },
  {
    id: 'privacy',
    title: 'Privacy & Security',
    icon: Shield,
    color: 'from-green-500 to-emerald-500',
    items: [
      {
        question: 'Is my voice data stored?',
        answer: 'Voice processing happens locally in your browser using the Web Speech API. Only the transcribed text and command results are stored in your command history.'
      },
      {
        question: 'Why does the assistant need confirmation for some actions?',
        answer: 'Actions like sending messages or posting content require explicit confirmation to prevent accidental execution. This is a security feature to protect your accounts.'
      },
      {
        question: 'How do I manage permissions?',
        answer: 'Go to Settings > Permissions to enable or disable specific capabilities like microphone access, notifications, navigation, and messaging.'
      }
    ]
  },
  {
    id: 'troubleshooting',
    title: 'Troubleshooting',
    icon: HelpCircle,
    color: 'from-orange-500 to-amber-500',
    items: [
      {
        question: 'The microphone isn\'t working',
        answer: 'Make sure you\'ve granted microphone permission in your browser. Check Settings > Permissions, and ensure your browser\'s site settings allow microphone access.'
      },
      {
        question: 'Voice recognition is inaccurate',
        answer: 'Try speaking more clearly and reducing background noise. Make sure you\'ve selected the correct language that matches your speech. The assistant works best in quiet environments.'
      },
      {
        question: 'Commands are not being executed',
        answer: 'Check if the required permissions are enabled in Settings. Some actions like messaging require explicit confirmation. Also ensure you have a stable internet connection.'
      }
    ]
  }
];

const quickTips = [
  { icon: '🎤', tip: 'Speak clearly and naturally' },
  { icon: '🌐', tip: 'Specify app names for faster results' },
  { icon: '✅', tip: 'Confirm sensitive actions' },
  { icon: '📝', tip: 'Use text mode in noisy environments' },
];

export default function Help() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);

  const filteredCategories = categories.map(cat => ({
    ...cat,
    items: cat.items.filter(item =>
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(cat => cat.items.length > 0);

  return (
    <div className="min-h-screen relative">
      <AnimatedBackground />

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 mb-8"
        >
          <Link
            to={createPageUrl('Home')}
            className="p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-400" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white">Help Center</h1>
            <p className="text-gray-500 text-sm">Learn how to use your voice assistant</p>
          </div>
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for help..."
              className="pl-12 py-6 text-lg bg-white/5 border-white/10 text-white placeholder-gray-500 rounded-xl"
            />
          </div>
        </motion.div>

        {/* Quick Tips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <h3 className="text-lg font-semibold text-white mb-4">Quick Tips</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {quickTips.map((tip, i) => (
              <div
                key={i}
                className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-4 text-center"
              >
                <span className="text-2xl mb-2 block">{tip.icon}</span>
                <p className="text-sm text-gray-400">{tip.tip}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Categories */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="text-lg font-semibold text-white mb-4">Browse Topics</h3>
          
          <div className="space-y-4">
            {filteredCategories.map((category, catIndex) => (
              <div
                key={category.id}
                className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden"
              >
                <button
                  onClick={() => setSelectedCategory(
                    selectedCategory === category.id ? null : category.id
                  )}
                  className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center`}>
                      <category.icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="text-left">
                      <p className="text-white font-medium">{category.title}</p>
                      <p className="text-sm text-gray-500">{category.items.length} articles</p>
                    </div>
                  </div>
                  <ChevronRight className={`w-5 h-5 text-gray-500 transition-transform ${
                    selectedCategory === category.id ? 'rotate-90' : ''
                  }`} />
                </button>

                <AnimatePresence>
                  {selectedCategory === category.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-4">
                        <Accordion type="single" collapsible>
                          {category.items.map((item, i) => (
                            <AccordionItem key={i} value={`item-${i}`} className="border-white/10">
                              <AccordionTrigger className="text-gray-300 hover:text-white text-left">
                                {item.question}
                              </AccordionTrigger>
                              <AccordionContent className="text-gray-400">
                                {item.answer}
                              </AccordionContent>
                            </AccordionItem>
                          ))}
                        </Accordion>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Still need help */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 text-center"
        >
          <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl border border-blue-500/20 p-6">
            <HelpCircle className="w-10 h-10 text-blue-400 mx-auto mb-3" />
            <h3 className="text-white font-semibold mb-2">Still need help?</h3>
            <p className="text-gray-400 text-sm mb-4">
              Try asking the assistant directly: "What can you do?" or "Help"
            </p>
            <Link
              to={createPageUrl('Home')}
              className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 text-sm"
            >
              Go to Assistant
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}