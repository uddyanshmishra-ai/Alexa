import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { api } from '@/api/restClient';

import AnimatedBackground from '@/components/ui/AnimatedBackground';
import LanguageSelector from '@/components/assistant/LanguageSelector';
import { Button } from '@/components/ui/button';

import { 
  Mic, 
  Globe, 
  MessageCircle, 
  Shield, 
  ChevronRight, 
  Check,
  Sparkles,
  Zap,
  Navigation
} from 'lucide-react';

const steps = [
  {
    id: 'welcome',
    title: 'Welcome to Voice Assistant',
    description: 'Your AI-powered assistant that understands natural language and helps you get things done faster.',
    icon: Sparkles,
    color: 'from-blue-500 to-purple-500'
  },
  {
    id: 'language',
    title: 'Choose Your Language',
    description: 'Select your preferred language for voice commands and responses.',
    icon: Globe,
    color: 'from-green-500 to-teal-500'
  },
  {
    id: 'permissions',
    title: 'Enable Permissions',
    description: 'Grant the necessary permissions for the best experience.',
    icon: Shield,
    color: 'from-orange-500 to-amber-500'
  },
  {
    id: 'capabilities',
    title: "What I Can Do",
    description: 'Here are some things you can ask me to help with.',
    icon: Zap,
    color: 'from-purple-500 to-pink-500'
  }
];

const capabilities = [
  { icon: '🌐', title: 'Open Websites', example: '"Open Flipkart"' },
  { icon: '🔍', title: 'Search the Web', example: '"Search for running shoes"' },
  { icon: '💬', title: 'Send Messages', example: '"Send WhatsApp to Mom"' },
  { icon: '📧', title: 'Compose Emails', example: '"Open Gmail"' },
  { icon: '📱', title: 'Navigate Apps', example: '"Go to Facebook notifications"' },
  { icon: '❓', title: 'Get Help', example: '"What can you do?"' },
];

export default function Onboarding() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [language, setLanguage] = useState('en-US');
  const [permissions, setPermissions] = useState({
    microphone: false,
    navigation: true
  });

  const step = steps[currentStep];

  const requestMicPermission = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      setPermissions(p => ({ ...p, microphone: true }));
      return true;
    } catch (err) {
      console.error('Mic permission denied:', err);
      return false;
    }
  };

  const handleNext = async () => {
    if (currentStep === steps.length - 1) {
      // Save preferences and navigate to home
      try {
        await api.preferences.create({
          language,
          voice_enabled: permissions.microphone,
          permissions: {
            microphone: permissions.microphone,
            navigation: permissions.navigation
          }
        });
      } catch (err) {
        console.error('Error saving preferences:', err);
      }
      navigate(createPageUrl('Home'));
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleSkip = () => {
    navigate(createPageUrl('Home'));
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-6">
      <AnimatedBackground />

      <div className="relative z-10 w-full max-w-xl">
        {/* Progress dots */}
        <div className="flex justify-center gap-2 mb-8">
          {steps.map((s, i) => (
            <motion.div
              key={s.id}
              animate={{
                scale: i === currentStep ? 1.2 : 1,
                opacity: i <= currentStep ? 1 : 0.3
              }}
              className={`w-2 h-2 rounded-full ${
                i <= currentStep ? 'bg-blue-500' : 'bg-gray-600'
              }`}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step.id}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-8"
          >
            {/* Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center mx-auto mb-6 shadow-lg`}
            >
              <step.icon className="w-10 h-10 text-white" />
            </motion.div>

            {/* Title & Description */}
            <h2 className="text-2xl font-bold text-white text-center mb-3">
              {step.title}
            </h2>
            <p className="text-gray-400 text-center mb-8">
              {step.description}
            </p>

            {/* Step-specific content */}
            {step.id === 'language' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-center mb-6"
              >
                <LanguageSelector value={language} onChange={setLanguage} />
              </motion.div>
            )}

            {step.id === 'permissions' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4 mb-6"
              >
                <button
                  onClick={requestMicPermission}
                  className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all ${
                    permissions.microphone 
                      ? 'bg-green-500/20 border-green-500/30' 
                      : 'bg-white/5 border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                      <Mic className="w-5 h-5 text-blue-400" />
                    </div>
                    <div className="text-left">
                      <p className="text-white font-medium">Microphone</p>
                      <p className="text-sm text-gray-500">For voice commands</p>
                    </div>
                  </div>
                  {permissions.microphone ? (
                    <Check className="w-5 h-5 text-green-400" />
                  ) : (
                    <span className="text-xs text-blue-400">Enable</span>
                  )}
                </button>

                <div
                  className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all bg-green-500/20 border-green-500/30`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
                      <Navigation className="w-5 h-5 text-green-400" />
                    </div>
                    <div className="text-left">
                      <p className="text-white font-medium">Navigation</p>
                      <p className="text-sm text-gray-500">Open websites & apps</p>
                    </div>
                  </div>
                  <Check className="w-5 h-5 text-green-400" />
                </div>
              </motion.div>
            )}

            {step.id === 'capabilities' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-2 gap-3 mb-6"
              >
                {capabilities.map((cap, i) => (
                  <motion.div
                    key={cap.title}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-white/5 rounded-xl p-3 border border-white/10"
                  >
                    <span className="text-2xl mb-2 block">{cap.icon}</span>
                    <p className="text-white text-sm font-medium">{cap.title}</p>
                    <p className="text-xs text-gray-500 mt-1">{cap.example}</p>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {/* Actions */}
            <div className="flex gap-3">
              <Button
                variant="ghost"
                onClick={handleSkip}
                className="flex-1 text-gray-400 hover:text-white"
              >
                Skip
              </Button>
              <Button
                onClick={handleNext}
                className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
              >
                {currentStep === steps.length - 1 ? 'Get Started' : 'Next'}
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}