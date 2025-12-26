import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Send, Keyboard } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function TextInput({ onSubmit, disabled, placeholder }) {
  const [text, setText] = useState('');
  const inputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim() && !disabled) {
      onSubmit(text.trim());
      setText('');
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-2xl mx-auto"
    >
      <div className={cn(
        "relative flex items-center gap-2",
        "bg-white/5 backdrop-blur-xl rounded-2xl",
        "border border-white/10 hover:border-white/20",
        "transition-all duration-300",
        "focus-within:border-blue-500/50 focus-within:ring-2 focus-within:ring-blue-500/20"
      )}>
        <Keyboard className="absolute left-4 w-5 h-5 text-gray-500" />
        <input
          ref={inputRef}
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={disabled}
          placeholder={placeholder || "Type your command..."}
          className={cn(
            "flex-1 bg-transparent py-4 pl-12 pr-14",
            "text-white placeholder-gray-500",
            "focus:outline-none",
            "disabled:opacity-50"
          )}
        />
        <motion.button
          type="submit"
          disabled={!text.trim() || disabled}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={cn(
            "absolute right-2 p-2 rounded-xl",
            "transition-all duration-200",
            text.trim() && !disabled
              ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white"
              : "bg-white/10 text-gray-500"
          )}
        >
          <Send className="w-5 h-5" />
        </motion.button>
      </div>
    </motion.form>
  );
}