import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Loader2, Volume2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function TranscriptPanel({ 
  transcript, 
  response, 
  isListening, 
  isProcessing,
  isSpeaking 
}) {
  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">
      {/* User transcript */}
      <AnimatePresence mode="wait">
        {(transcript || isListening) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="relative"
          >
            <div className="flex items-start gap-3 bg-white/5 backdrop-blur-xl rounded-2xl p-4 border border-white/10">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                <MessageSquare className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-400 mb-1">You</p>
                <p className={cn(
                  "text-white text-lg",
                  isListening && !transcript && "text-gray-400 italic"
                )}>
                  {transcript || "Listening..."}
                  {isListening && (
                    <motion.span
                      animate={{ opacity: [1, 0] }}
                      transition={{ repeat: Infinity, duration: 0.8 }}
                      className="inline-block ml-1"
                    >
                      |
                    </motion.span>
                  )}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Processing indicator */}
      <AnimatePresence>
        {isProcessing && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="flex items-center justify-center gap-2 py-4"
          >
            <div className="flex gap-1">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  animate={{ scale: [1, 1.5, 1] }}
                  transition={{ 
                    repeat: Infinity, 
                    duration: 0.6, 
                    delay: i * 0.15 
                  }}
                  className="w-2 h-2 rounded-full bg-blue-500"
                />
              ))}
            </div>
            <span className="text-gray-400 text-sm ml-2">Processing...</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Assistant response */}
      <AnimatePresence>
        {response && !isProcessing && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="relative"
          >
            <div className="flex items-start gap-3 bg-gradient-to-br from-blue-500/10 to-purple-500/10 backdrop-blur-xl rounded-2xl p-4 border border-blue-500/20">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center flex-shrink-0 relative">
                <motion.div
                  animate={isSpeaking ? { scale: [1, 1.2, 1] } : {}}
                  transition={{ repeat: isSpeaking ? Infinity : 0, duration: 0.5 }}
                >
                  <Volume2 className="w-4 h-4 text-white" />
                </motion.div>
                {isSpeaking && (
                  <motion.div
                    className="absolute inset-0 rounded-full bg-emerald-500/50"
                    animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
                    transition={{ repeat: Infinity, duration: 1 }}
                  />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-emerald-400 mb-1">Assistant</p>
                <p className="text-white text-lg leading-relaxed">{response}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}