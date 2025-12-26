import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

import AnimatedBackground from '@/components/ui/AnimatedBackground';
import TextInput from '@/components/assistant/TextInput';
import VoiceButton from '@/components/assistant/VoiceButton';
import LanguageSelector from '@/components/assistant/LanguageSelector';

import { 
  ArrowLeft, 
  Mic, 
  Keyboard,
  Bot,
  User,
  Loader2,
  Volume2,
  Copy,
  Check,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [language, setLanguage] = useState('en-US');
  const [inputMode, setInputMode] = useState('text');
  const [copiedId, setCopiedId] = useState(null);
  const messagesEndRef = useRef(null);
  const queryClient = useQueryClient();

  // Initial greeting
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([{
        id: 'greeting',
        role: 'assistant',
        content: "Hello! I'm your AI assistant. I can help you open websites, search the web, send messages, and more. What would you like to do?",
        timestamp: new Date()
      }]);
    }
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const processMessage = async (text) => {
    if (!text.trim()) return;

    // Add user message
    const userMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setIsProcessing(true);

    try {
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `You are a helpful voice assistant. Respond to this user message conversationally.
        
User: "${text}"
Language: ${language}

If the user wants to:
- Open a website: Provide the URL and say you're opening it
- Search something: Say you're searching and what for
- Send a message: Ask for confirmation first
- Get help: List your capabilities

Keep responses concise and friendly. Respond in the same language as the user.`,
        response_json_schema: {
          type: "object",
          properties: {
            response: { type: "string" },
            action: { type: "string" },
            actionData: { type: "object" }
          }
        }
      });

      // Add assistant message
      const assistantMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: result.response,
        action: result.action,
        actionData: result.actionData,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, assistantMessage]);

      // Save to history
      await base44.entities.Command.create({
        utterance: text,
        response: result.response,
        status: 'executed',
        language: language
      });
      queryClient.invalidateQueries({ queryKey: ['commands'] });

      // Execute action if needed
      if (result.action === 'open' && result.actionData?.url) {
        window.open(result.actionData.url, '_blank');
      }
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I'm sorry, I encountered an error. Please try again.",
        timestamp: new Date(),
        error: true
      }]);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleVoiceTranscript = (text, isFinal) => {
    if (isFinal && text.trim()) {
      processMessage(text);
    }
  };

  const copyMessage = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const speakMessage = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="min-h-screen relative flex flex-col">
      <AnimatedBackground />

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-4 py-3 border-b border-white/10 bg-gray-900/50 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <Link
            to={createPageUrl('Home')}
            className="p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-400" />
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="text-white font-medium text-sm">AI Assistant</h1>
              <p className="text-gray-500 text-xs">Online</p>
            </div>
          </div>
        </div>

        <LanguageSelector value={language} onChange={setLanguage} compact />
      </header>

      {/* Messages */}
      <div className="relative z-10 flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "flex gap-3",
                msg.role === 'user' ? "justify-end" : "justify-start"
              )}
            >
              {msg.role === 'assistant' && (
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
              )}

              <div className={cn(
                "max-w-[80%] rounded-2xl px-4 py-3",
                msg.role === 'user' 
                  ? "bg-gradient-to-br from-blue-500 to-purple-600 text-white" 
                  : "bg-white/10 text-white border border-white/10",
                msg.error && "border-red-500/30"
              )}>
                <p className="text-sm leading-relaxed">{msg.content}</p>
                
                {msg.role === 'assistant' && (
                  <div className="flex items-center gap-2 mt-2 pt-2 border-t border-white/10">
                    <button
                      onClick={() => copyMessage(msg.id, msg.content)}
                      className="p-1 rounded hover:bg-white/10 transition-colors"
                    >
                      {copiedId === msg.id ? (
                        <Check className="w-3.5 h-3.5 text-green-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5 text-gray-500" />
                      )}
                    </button>
                    <button
                      onClick={() => speakMessage(msg.content)}
                      className="p-1 rounded hover:bg-white/10 transition-colors"
                    >
                      <Volume2 className="w-3.5 h-3.5 text-gray-500" />
                    </button>
                  </div>
                )}
              </div>

              {msg.role === 'user' && (
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 text-white" />
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {isProcessing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex gap-3"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
              <Loader2 className="w-4 h-4 text-white animate-spin" />
            </div>
            <div className="bg-white/10 rounded-2xl px-4 py-3 border border-white/10">
              <div className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    animate={{ scale: [1, 1.5, 1] }}
                    transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.15 }}
                    className="w-2 h-2 rounded-full bg-gray-400"
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="relative z-10 p-4 border-t border-white/10 bg-gray-900/50 backdrop-blur-xl">
        <div className="flex items-center gap-2 mb-3">
          <button
            onClick={() => setInputMode('text')}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-all",
              inputMode === 'text' 
                ? "bg-blue-500/20 text-blue-400" 
                : "text-gray-500 hover:text-gray-400"
            )}
          >
            <Keyboard className="w-4 h-4" />
            Text
          </button>
          <button
            onClick={() => setInputMode('voice')}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-all",
              inputMode === 'voice' 
                ? "bg-blue-500/20 text-blue-400" 
                : "text-gray-500 hover:text-gray-400"
            )}
          >
            <Mic className="w-4 h-4" />
            Voice
          </button>
        </div>

        {inputMode === 'text' ? (
          <TextInput
            onSubmit={processMessage}
            disabled={isProcessing}
            placeholder="Type a message..."
          />
        ) : (
          <div className="flex justify-center py-2">
            <VoiceButton
              onTranscript={handleVoiceTranscript}
              onListeningChange={setIsListening}
              isProcessing={isProcessing}
              language={language}
            />
          </div>
        )}
      </div>
    </div>
  );
}