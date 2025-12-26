
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Check, X, Shield, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function ConfirmationDialog({ 
  isOpen, 
  onConfirm, 
  onCancel, 
  intent,
  isLoading 
}) {
  if (!intent) return null;

  const getActionDetails = () => {
    switch (intent.intent) {
      case 'message.send':
        return {
          title: 'Send Message',
          description: `Send "${intent.entities?.message}" to ${intent.entities?.recipient} via ${intent.entities?.channel}`,
          warning: 'This action will send a message on your behalf.',
          icon: '💬'
        };
      case 'navigation.open':
        return {
          title: 'Open Website',
          description: `Navigate to ${intent.entities?.url || intent.entities?.app}`,
          warning: 'This will open a new browser tab.',
          icon: '🌐'
        };
      case 'social.post':
        return {
          title: 'Create Post',
          description: `Post on ${intent.entities?.platform}`,
          warning: 'This action will create a public post.',
          icon: '📱'
        };
      default:
        return {
          title: 'Confirm Action',
          description: intent.utterance,
          warning: 'Please confirm you want to proceed.',
          icon: '⚡'
        };
    }
  };

  const details = getActionDetails();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={onCancel}
          />

          {/* Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md"
          >
            <div className="bg-gray-900 border border-white/10 rounded-3xl shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="p-6 pb-4">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center text-2xl">
                    {details.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-white mb-1">
                      {details.title}
                    </h3>
                    <p className="text-gray-400 text-sm">
                      {details.description}
                    </p>
                  </div>
                </div>
              </div>

              {/* Warning */}
              <div className="mx-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-amber-200">{details.warning}</p>
                    <p className="text-xs text-amber-400/60 mt-1">
                      This action will be logged for your records.
                    </p>
                  </div>
                </div>
              </div>

              {/* Intent details */}
              {intent.entities && Object.keys(intent.entities).length > 0 && (
                <div className="mx-6 mt-4 p-4 rounded-xl bg-white/5 border border-white/10">
                  <p className="text-xs text-gray-500 mb-2 flex items-center gap-1">
                    <Shield className="w-3 h-3" /> Action Details
                  </p>
                  <div className="space-y-2">
                    {Object.entries(intent.entities).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between">
                        <span className="text-sm text-gray-400 capitalize">
                          {key.replace(/_/g, ' ')}
                        </span>
                        <span className="text-sm text-white font-medium">
                          {String(value)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Confidence score */}
              {intent.confidence && (
                <div className="mx-6 mt-4">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-gray-500">Confidence</span>
                    <span className="text-gray-400">{Math.round(intent.confidence * 100)}%</span>
                  </div>
                  <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${intent.confidence * 100}%` }}
                      className={cn(
                        "h-full rounded-full",
                        intent.confidence > 0.8 
                          ? "bg-green-500" 
                          : intent.confidence > 0.5 
                            ? "bg-yellow-500" 
                            : "bg-red-500"
                      )}
                    />
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="p-6 pt-6 flex gap-3">
                <Button
                  variant="outline"
                  onClick={onCancel}
                  disabled={isLoading}
                  className="flex-1 h-12 bg-white/5 border-white/10 hover:bg-white/10 text-white"
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
                <Button
                  onClick={onConfirm}
                  disabled={isLoading}
                  className="flex-1 h-12 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white border-0"
                >
                  {isLoading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1 }}
                      className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                    />
                  ) : (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Confirm
                    </>
                  )}
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}