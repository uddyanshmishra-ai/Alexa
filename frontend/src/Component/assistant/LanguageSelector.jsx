import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Globe, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

const languages = [
  { code: 'en-US', name: 'English', flag: '🇺🇸', native: 'English' },
  { code: 'en-GB', name: 'English (UK)', flag: '🇬🇧', native: 'English' },
  { code: 'es-ES', name: 'Spanish', flag: '🇪🇸', native: 'Español' },
  { code: 'fr-FR', name: 'French', flag: '🇫🇷', native: 'Français' },
  { code: 'de-DE', name: 'German', flag: '🇩🇪', native: 'Deutsch' },
  { code: 'it-IT', name: 'Italian', flag: '🇮🇹', native: 'Italiano' },
  { code: 'pt-BR', name: 'Portuguese', flag: '🇧🇷', native: 'Português' },
  { code: 'zh-CN', name: 'Chinese', flag: '🇨🇳', native: '中文' },
  { code: 'ja-JP', name: 'Japanese', flag: '🇯🇵', native: '日本語' },
  { code: 'ko-KR', name: 'Korean', flag: '🇰🇷', native: '한국어' },
  { code: 'hi-IN', name: 'Hindi', flag: '🇮🇳', native: 'हिन्दी' },
  { code: 'ar-SA', name: 'Arabic', flag: '🇸🇦', native: 'العربية' },
  { code: 'ru-RU', name: 'Russian', flag: '🇷🇺', native: 'Русский' },
  { code: 'nl-NL', name: 'Dutch', flag: '🇳🇱', native: 'Nederlands' },
  { code: 'pl-PL', name: 'Polish', flag: '🇵🇱', native: 'Polski' },
  { code: 'tr-TR', name: 'Turkish', flag: '🇹🇷', native: 'Türkçe' },
  { code: 'vi-VN', name: 'Vietnamese', flag: '🇻🇳', native: 'Tiếng Việt' },
  { code: 'th-TH', name: 'Thai', flag: '🇹🇭', native: 'ไทย' },
  { code: 'id-ID', name: 'Indonesian', flag: '🇮🇩', native: 'Bahasa Indonesia' },
  { code: 'sv-SE', name: 'Swedish', flag: '🇸🇪', native: 'Svenska' },
];

export default function LanguageSelector({ value, onChange, compact = false }) {
  const [isOpen, setIsOpen] = useState(false);
  const selectedLang = languages.find(l => l.code === value) || languages[0];

  return (
    <div className="relative">
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={cn(
          "flex items-center gap-2 px-3 py-2 rounded-xl",
          "bg-white/5 border border-white/10 hover:border-white/20",
          "transition-all duration-200",
          compact ? "text-sm" : "text-base"
        )}
      >
        <Globe className="w-4 h-4 text-gray-400" />
        <span className="text-lg">{selectedLang.flag}</span>
        {!compact && (
          <span className="text-white">{selectedLang.native}</span>
        )}
        <ChevronDown className={cn(
          "w-4 h-4 text-gray-400 transition-transform",
          isOpen && "rotate-180"
        )} />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className={cn(
                "absolute right-0 mt-2 z-50 w-64 max-h-80 overflow-auto",
                "bg-gray-900/95 backdrop-blur-xl rounded-xl border border-white/10",
                "shadow-2xl shadow-black/50"
              )}
            >
              <div className="p-2">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      onChange(lang.code);
                      setIsOpen(false);
                    }}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2 rounded-lg",
                      "transition-all duration-150",
                      value === lang.code 
                        ? "bg-blue-500/20 text-white" 
                        : "hover:bg-white/5 text-gray-300"
                    )}
                  >
                    <span className="text-xl">{lang.flag}</span>
                    <div className="flex-1 text-left">
                      <p className="text-sm font-medium">{lang.native}</p>
                      <p className="text-xs text-gray-500">{lang.name}</p>
                    </div>
                    {value === lang.code && (
                      <Check className="w-4 h-4 text-blue-400" />
                    )}
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}