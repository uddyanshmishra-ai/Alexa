import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

const suggestions = [
  "Open Flipkart and search for phones",
  "Send a WhatsApp to John",
  "What's the weather today?",
  "Open my Gmail inbox",
  "Search for latest tech news",
  "Navigate to YouTube",
  "Open Facebook notifications",
  "What can you help me with?"
];

export default function CommandSuggestions({ onSelect, visible = true }) {
  if (!visible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="w-full max-w-2xl mx-auto"
    >
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="w-4 h-4 text-purple-400" />
        <span className="text-sm text-gray-400">Try saying:</span>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {suggestions.map((suggestion, index) => (
          <motion.button
            key={suggestion}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelect(suggestion)}
            className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-sm text-gray-300 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all"
          >
            "{suggestion}"
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}