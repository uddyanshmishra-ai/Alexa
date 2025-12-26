import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { base44 } from '@/Api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import VoiceButton from '@/components/assistant/VoiceButton';
import TranscriptPanel from '@/components/assistant/TranscriptPanel';
import LanguageSelector from '@/components/assistant/LanguageSelector';
import QuickCommands from '@/components/assistant/QuickCommands';
import TextInput from '@/components/assistant/TextInput';
import IntentPreview from '@/components/assistant/IntentPreview';
import ConfirmationDialog from '@/components/assistant/ConfirmationDialog';
import WaveformBackground from '@/components/assistant/WaveformBackground';
import AnimatedBackground from '@/components/ui/AnimatedBackground';

import { Settings, History, Keyboard, Mic, HelpCircle, Play, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function Home() {
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [language, setLanguage] = useState('en-US');
  const [inputMode, setInputMode] = useState('voice');
  const [currentIntent, setCurrentIntent] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [audioIntensity, setAudioIntensity] = useState(0.3);
  const pendingWindowRef = useRef(null);
  
  const queryClient = useQueryClient();

  // Process command with AI
  const processCommand = useCallback(async (text) => {
    console.log('processCommand called with:', text);
    if (!text.trim()) return;
    
    setTranscript(text);
    setIsProcessing(true);
    setResponse('');
    setCurrentIntent(null);

    // Open a blank window immediately to avoid popup blockers
    // We'll navigate it later once we know the URL
    pendingWindowRef.current = window.open('about:blank', '_blank');

    try {
      // Use InvokeLLM to understand the command
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `You are an intelligent voice assistant. Analyze this user command and provide a structured response.

User command: "${text}"
Language: ${language}

IMPORTANT: 
- For navigation commands (opening apps/websites, searching), set requiresConfirmation to FALSE
- Only set requiresConfirmation to TRUE for actions like sending messages or posting content

Respond in JSON format:
{
  "intent": "navigation.open|navigation.search|message.send|system.help|system.history|system.settings|unknown",
  "entities": {
    "url": "extracted URL if any",
    "app": "app name if mentioned (e.g., Chrome, Flipkart, Facebook, YouTube, Gmail)",
    "query": "search query if any",
    "recipient": "message recipient if any",
    "message": "message content if any",
    "channel": "messaging channel (whatsapp, sms, email) if any"
  },
  "response": "A friendly, natural response to the user",
  "steps": ["Step 1 description"],
  "requiresConfirmation": false for navigation, true for messaging only,
  "confidence": 0.0-1.0,
  "deepLink": "URL or deep link if applicable"
}

Examples:
- "Open Flipkart" → intent: navigation.open, entities: {app: "Flipkart", url: "https://www.flipkart.com"}, requiresConfirmation: false
- "Search for running shoes" → intent: navigation.search, entities: {query: "running shoes"}, requiresConfirmation: false
- "Send WhatsApp to Mom saying I'll be late" → intent: message.send, entities: {channel: "whatsapp", recipient: "Mom", message: "I'll be late"}, requiresConfirmation: true`,
        response_json_schema: {
          type: "object",
          properties: {
            intent: { type: "string" },
            entities: { type: "object" },
            response: { type: "string" },
            steps: { type: "array", items: { type: "string" } },
            requiresConfirmation: { type: "boolean" },
            confidence: { type: "number" },
            deepLink: { type: "string" }
          }
        }
      });

      const intent = {
        id: Date.now().toString(),
        utterance: text,
        ...result
      };

      setCurrentIntent(intent);
      setResponse(result.response);

      // Save command to history
      await base44.entities.Command.create({
        utterance: text,
        intent: result.intent,
        entities: result.entities,
        response: result.response,
        confidence: result.confidence,
        language: language,
        status: result.requiresConfirmation ? 'pending' : 'executed'
      });

      // Speak the response
      speak(result.response);

      // If confirmation is required, show dialog
      if (result.requiresConfirmation) {
        console.log('Showing confirmation dialog');
        setShowConfirmation(true);
      } else {
        // Execute the action directly
        console.log('Executing action directly:', intent);
        executeAction(intent);
      }

      queryClient.invalidateQueries({ queryKey: ['commands'] });
    } catch (error) {
      console.error('Error processing command:', error);
      const errorResponse = "I'm sorry, I couldn't process that command. Please try again.";
      setResponse(errorResponse);
      speak(errorResponse);
      
      // Close the pending window if there was an error
      if (pendingWindowRef.current && !pendingWindowRef.current.closed) {
        pendingWindowRef.current.close();
      }
      pendingWindowRef.current = null;
    } finally {
      setIsProcessing(false);
    }
  }, [language, queryClient]);

  // Execute the action
  const executeAction = (intent) => {
    console.log('executeAction called with:', intent);
    if (!intent) {
      console.log('No intent provided');
      // Close pending window if action not needed
      if (pendingWindowRef.current && !pendingWindowRef.current.closed) {
        pendingWindowRef.current.close();
      }
      pendingWindowRef.current = null;
      return;
    }

    const { entities, deepLink } = intent;
    console.log('Entities:', entities, 'DeepLink:', deepLink);

    switch (intent.intent) {
      case 'navigation.open':
        console.log('Navigation.open action');
        const urls = {
          chrome: 'https://www.google.com',
          flipkart: 'https://www.flipkart.com',
          facebook: 'https://www.facebook.com',
          youtube: 'https://www.youtube.com',
          gmail: 'https://mail.google.com',
          twitter: 'https://twitter.com',
          instagram: 'https://www.instagram.com',
          linkedin: 'https://www.linkedin.com',
          amazon: 'https://www.amazon.com',
          netflix: 'https://www.netflix.com',
          spotify: 'https://open.spotify.com',
          whatsapp: 'https://web.whatsapp.com',
        };
        
        let url = entities?.url || deepLink;
        if (!url && entities?.app) {
          const appName = entities.app.toLowerCase();
          url = urls[appName] || `https://www.google.com/search?q=${encodeURIComponent(entities.app)}`;
        }
        
        if (url) {
          console.log('Opening URL:', url);
          // Use the pre-opened window if available
          if (pendingWindowRef.current && !pendingWindowRef.current.closed) {
            pendingWindowRef.current.location.href = url;
          } else {
            window.open(url, '_blank');
          }
          pendingWindowRef.current = null;
        } else {
          console.log('No URL found for navigation.open');
          // Close pending window if no URL
          if (pendingWindowRef.current && !pendingWindowRef.current.closed) {
            pendingWindowRef.current.close();
          }
          pendingWindowRef.current = null;
        }
        break;

      case 'navigation.search':
        console.log('Navigation.search action');
        const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(entities?.query || '')}`;
        console.log('Opening search URL:', searchUrl);
        // Use the pre-opened window if available
        if (pendingWindowRef.current && !pendingWindowRef.current.closed) {
          pendingWindowRef.current.location.href = searchUrl;
        } else {
          window.open(searchUrl, '_blank');
        }
        pendingWindowRef.current = null;
        break;

      case 'message.send':
        if (entities?.channel === 'whatsapp') {
          const waUrl = `https://wa.me/?text=${encodeURIComponent(entities?.message || '')}`;
          if (pendingWindowRef.current && !pendingWindowRef.current.closed) {
            pendingWindowRef.current.location.href = waUrl;
          } else {
            window.open(waUrl, '_blank');
          }
          pendingWindowRef.current = null;
        } else if (entities?.channel === 'email') {
          const mailUrl = `mailto:?subject=Message&body=${encodeURIComponent(entities?.message || '')}`;
          window.location.href = mailUrl;
          // Close pending window for email
          if (pendingWindowRef.current && !pendingWindowRef.current.closed) {
            pendingWindowRef.current.close();
          }
          pendingWindowRef.current = null;
        }
        break;

      default:
        // Close pending window for unknown actions
        if (pendingWindowRef.current && !pendingWindowRef.current.closed) {
          pendingWindowRef.current.close();
        }
        pendingWindowRef.current = null;
        break;
    }
  };

  // Text-to-Speech
  const speak = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  // Handle voice transcript
  const handleTranscript = useCallback((text, isFinal) => {
    console.log('Transcript received:', text, 'isFinal:', isFinal);
    setTranscript(text);
    if (isFinal && text.trim()) {
      console.log('Processing command:', text);
      processCommand(text);
    }
  }, [processCommand]);

  // Handle text input
  const handleTextSubmit = (text) => {
    processCommand(text);
  };

  // Handle quick command
  const handleQuickCommand = (command) => {
    processCommand(command);
  };

  // Handle confirmation
  const handleConfirm = async () => {
    setShowConfirmation(false);
    executeAction(currentIntent);
    
    // Update command status
    if (currentIntent?.id) {
      const commands = await base44.entities.Command.filter({ utterance: currentIntent.utterance });
      if (commands.length > 0) {
        await base44.entities.Command.update(commands[0].id, { status: 'executed' });
        queryClient.invalidateQueries({ queryKey: ['commands'] });
      }
    }
  };

  const handleCancel = async () => {
    setShowConfirmation(false);
    setResponse("Action cancelled. Let me know if you need anything else.");
    speak("Action cancelled.");
    
    // Update command status
    if (currentIntent?.utterance) {
      const commands = await base44.entities.Command.filter({ utterance: currentIntent.utterance });
      if (commands.length > 0) {
        await base44.entities.Command.update(commands[0].id, { status: 'cancelled' });
        queryClient.invalidateQueries({ queryKey: ['commands'] });
      }
    }
  };

  // Update audio intensity based on listening state
  useEffect(() => {
    setAudioIntensity(isListening ? 0.8 : isProcessing ? 0.5 : 0.3);
  }, [isListening, isProcessing]);

  return (
    <div className="min-h-screen relative overflow-hidden">
      <AnimatedBackground />
      <WaveformBackground isActive={isListening || isProcessing} intensity={audioIntensity} />

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-6 py-4">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
            <span className="text-white text-lg font-bold">V</span>
          </div>
          <div>
            <h1 className="text-white font-semibold text-lg">Voice Assistant</h1>
            <p className="text-gray-500 text-xs">Powered by AI</p>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3"
        >
          <LanguageSelector value={language} onChange={setLanguage} />
          
          <Link
            to={createPageUrl('Chat')}
            className="p-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
            title="Chat Mode"
          >
            <MessageSquare className="w-5 h-5 text-gray-400" />
          </Link>
          
          <Link
            to={createPageUrl('Demo')}
            className="p-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
            title="Demo"
          >
            <Play className="w-5 h-5 text-gray-400" />
          </Link>
          
          <Link
            to={createPageUrl('History')}
            className="p-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
            title="History"
          >
            <History className="w-5 h-5 text-gray-400" />
          </Link>
          
          <Link
            to={createPageUrl('Help')}
            className="p-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
            title="Help"
          >
            <HelpCircle className="w-5 h-5 text-gray-400" />
          </Link>
          
          <Link
            to={createPageUrl('Settings')}
            className="p-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
            title="Settings"
          >
            <Settings className="w-5 h-5 text-gray-400" />
          </Link>
        </motion.div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-180px)] px-6">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-3">
            How can I help you?
          </h2>
          <p className="text-gray-400 text-lg">
            Speak or type your command
          </p>
        </motion.div>

        {/* Transcript Panel */}
        <div className="w-full mb-8">
          <TranscriptPanel
            transcript={transcript}
            response={response}
            isListening={isListening}
            isProcessing={isProcessing}
            isSpeaking={isSpeaking}
          />
        </div>

        {/* Intent Preview */}
        <AnimatePresence>
          {currentIntent && !showConfirmation && (
            <div className="w-full mb-8">
              <IntentPreview intent={currentIntent} isVisible={true} />
            </div>
          )}
        </AnimatePresence>

        {/* Input Mode Toggle */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center gap-2 mb-6"
        >
          <button
            onClick={() => setInputMode('voice')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
              inputMode === 'voice' 
                ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' 
                : 'bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10'
            }`}
          >
            <Mic className="w-4 h-4" />
            Voice
          </button>
          <button
            onClick={() => setInputMode('text')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
              inputMode === 'text' 
                ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' 
                : 'bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10'
            }`}
          >
            <Keyboard className="w-4 h-4" />
            Text
          </button>
        </motion.div>

        {/* Voice Button or Text Input */}
        {inputMode === 'voice' ? (
          <motion.div
            key="voice"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="mb-12"
          >
            <VoiceButton
              onTranscript={handleTranscript}
              onListeningChange={setIsListening}
              isProcessing={isProcessing}
              language={language}
            />
          </motion.div>
        ) : (
          <motion.div
            key="text"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full max-w-2xl mb-12"
          >
            <TextInput
              onSubmit={handleTextSubmit}
              disabled={isProcessing}
              placeholder="Type your command..."
            />
          </motion.div>
        )}

        {/* Quick Commands */}
        <QuickCommands
          onCommandSelect={handleQuickCommand}
          disabled={isProcessing || isListening}
        />
      </main>

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={showConfirmation}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        intent={currentIntent}
        isLoading={false}
      />
    </div>
  );
}