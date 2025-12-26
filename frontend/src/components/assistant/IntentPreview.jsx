import React from 'react';
import { motion } from 'framer-motion';
import { 
  Target, 
  Zap, 
  ArrowRight, 
  Globe, 
  MessageCircle, 
  Search, 
  Settings,
  HelpCircle,
  Clock
} from 'lucide-react';
import { cn } from '@/lib/utils';

const intentIcons = {
  'navigation.open': Globe,
  'navigation.search': Search,
  'message.send': MessageCircle,
  'system.help': HelpCircle,
  'system.settings': Settings,
  'system.history': Clock,
  'default': Target
};

const intentColors = {
  'navigation.open': 'from-blue-500 to-cyan-500',
  'navigation.search': 'from-purple-500 to-pink-500',
  'message.send': 'from-green-500 to-emerald-500',
  'system.help': 'from-gray-500 to-slate-500',
  'system.settings': 'from-orange-500 to-amber-500',
  'system.history': 'from-violet-500 to-purple-500',
  'default': 'from-blue-500 to-purple-500'
};

export default function IntentPreview({ intent, isVisible }) {
  if (!intent || !isVisible) return null;

  const IconComponent = intentIcons[intent.intent] || intentIcons.default;
  const colorClass = intentColors[intent.intent] || intentColors.default;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      className="w-full max-w-xl mx-auto"
    >
      <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center",
              `bg-gradient-to-br ${colorClass}`
            )}>
              <IconComponent className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-gray-500 mb-0.5">Detected Intent</p>
              <p className="text-white font-medium">{intent.intent}</p>
            </div>
            {intent.confidence && (
              <div className="flex flex-col items-end">
                <div className={cn(
                  "px-2 py-1 rounded-lg text-xs font-medium",
                  intent.confidence > 0.8 
                    ? "bg-green-500/20 text-green-400" 
                    : intent.confidence > 0.5 
                      ? "bg-yellow-500/20 text-yellow-400" 
                      : "bg-red-500/20 text-red-400"
                )}>
                  {Math.round(intent.confidence * 100)}% confident
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Steps */}
        {intent.steps && intent.steps.length > 0 && (
          <div className="p-4 space-y-2">
            <p className="text-xs text-gray-500 mb-3">Execution Plan</p>
            {intent.steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-3"
              >
                <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs text-gray-400">
                  {index + 1}
                </div>
                <ArrowRight className="w-4 h-4 text-gray-600" />
                <span className="text-sm text-gray-300">{step}</span>
              </motion.div>
            ))}
          </div>
        )}

        {/* Entities */}
        {intent.entities && Object.keys(intent.entities).length > 0 && (
          <div className="px-4 pb-4">
            <div className="flex flex-wrap gap-2">
              {Object.entries(intent.entities).map(([key, value]) => (
                <span 
                  key={key}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10"
                >
                  <span className="text-xs text-gray-500">{key}:</span>
                  <span className="text-sm text-white">{String(value)}</span>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Action required indicator */}
        {intent.requiresConfirmation && (
          <div className="px-4 pb-4">
            <div className="flex items-center gap-2 p-2 rounded-lg bg-amber-500/10 border border-amber-500/20">
              <Zap className="w-4 h-4 text-amber-400" />
              <span className="text-xs text-amber-300">
                This action requires your confirmation
              </span>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}