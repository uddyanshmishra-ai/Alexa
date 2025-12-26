import React from 'react';
import { motion } from 'framer-motion';
import { 
  ExternalLink, 
  MessageCircle, 
  Search, 
  Globe, 
  Check,
  Copy,
  Volume2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const actionIcons = {
  'navigation.open': Globe,
  'navigation.search': Search,
  'message.send': MessageCircle,
  'default': ExternalLink
};

export default function ResponseCard({ 
  intent, 
  response, 
  onExecute, 
  onCopy,
  onSpeak,
  showActions = true 
}) {
  if (!response) return null;

  const ActionIcon = actionIcons[intent?.intent] || actionIcons.default;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      className="w-full max-w-2xl mx-auto"
    >
      <div className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden">
        {/* Response content */}
        <div className="p-5">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center flex-shrink-0">
              <ActionIcon className="w-5 h-5 text-white" />
            </div>
            
            <div className="flex-1">
              <p className="text-white text-lg leading-relaxed">{response}</p>
              
              {intent?.entities && Object.keys(intent.entities).length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {Object.entries(intent.entities).map(([key, value]) => (
                    value && (
                      <span 
                        key={key}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5 text-xs"
                      >
                        <span className="text-gray-500">{key}:</span>
                        <span className="text-gray-300">{String(value)}</span>
                      </span>
                    )
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action buttons */}
        {showActions && (
          <div className="flex items-center justify-end gap-2 px-5 py-3 bg-white/[0.02] border-t border-white/5">
            <Button
              variant="ghost"
              size="sm"
              onClick={onCopy}
              className="text-gray-400 hover:text-white"
            >
              <Copy className="w-4 h-4 mr-1.5" />
              Copy
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={onSpeak}
              className="text-gray-400 hover:text-white"
            >
              <Volume2 className="w-4 h-4 mr-1.5" />
              Speak
            </Button>

            {intent?.deepLink && (
              <Button
                size="sm"
                onClick={onExecute}
                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
              >
                <ExternalLink className="w-4 h-4 mr-1.5" />
                Open
              </Button>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}