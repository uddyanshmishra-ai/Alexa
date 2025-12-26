import React from 'react';
import { cn } from '@/lib/utils';

const languageFlags = {
  'en-US': '🇺🇸',
  'en-GB': '🇬🇧',
  'es-ES': '🇪🇸',
  'fr-FR': '🇫🇷',
  'de-DE': '🇩🇪',
  'it-IT': '🇮🇹',
  'pt-BR': '🇧🇷',
  'zh-CN': '🇨🇳',
  'ja-JP': '🇯🇵',
  'ko-KR': '🇰🇷',
  'hi-IN': '🇮🇳',
  'ar-SA': '🇸🇦',
  'ru-RU': '🇷🇺',
  'nl-NL': '🇳🇱',
  'pl-PL': '🇵🇱',
  'tr-TR': '🇹🇷',
  'vi-VN': '🇻🇳',
  'th-TH': '🇹🇭',
  'id-ID': '🇮🇩',
  'sv-SE': '🇸🇪',
};

const languageNames = {
  'en-US': 'English',
  'en-GB': 'English (UK)',
  'es-ES': 'Spanish',
  'fr-FR': 'French',
  'de-DE': 'German',
  'it-IT': 'Italian',
  'pt-BR': 'Portuguese',
  'zh-CN': 'Chinese',
  'ja-JP': 'Japanese',
  'ko-KR': 'Korean',
  'hi-IN': 'Hindi',
  'ar-SA': 'Arabic',
  'ru-RU': 'Russian',
  'nl-NL': 'Dutch',
  'pl-PL': 'Polish',
  'tr-TR': 'Turkish',
  'vi-VN': 'Vietnamese',
  'th-TH': 'Thai',
  'id-ID': 'Indonesian',
  'sv-SE': 'Swedish',
};

export default function LanguageBadge({ code, showName = false, size = 'sm' }) {
  const flag = languageFlags[code] || '🌐';
  const name = languageNames[code] || code;

  const sizeClasses = {
    xs: 'text-sm px-1.5 py-0.5',
    sm: 'text-base px-2 py-1',
    md: 'text-lg px-2.5 py-1.5',
    lg: 'text-xl px-3 py-2'
  };

  return (
    <span className={cn(
      "inline-flex items-center gap-1.5 rounded-lg bg-white/5 border border-white/10",
      sizeClasses[size]
    )}>
      <span>{flag}</span>
      {showName && <span className="text-gray-300 text-xs">{name}</span>}
    </span>
  );
}