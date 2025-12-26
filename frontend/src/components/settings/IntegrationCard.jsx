import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Check, X, ExternalLink, Loader2, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function IntegrationCard({ 
  icon: Icon, 
  name, 
  description, 
  connected, 
  onConnect, 
  onDisconnect,
  color = 'bg-gray-500',
  features = []
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const handleConnect = async () => {
    setIsLoading(true);
    try {
      await onConnect?.();
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisconnect = async () => {
    setIsLoading(true);
    try {
      await onDisconnect?.();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      layout
      className={cn(
        "group relative overflow-hidden",
        "bg-white/5 backdrop-blur-sm rounded-2xl",
        "border transition-all duration-300",
        connected ? "border-green-500/30" : "border-white/10 hover:border-white/20"
      )}
    >
      <div className="p-4">
        <div className="flex items-center gap-4">
          <div className={cn(
            "w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0",
            color,
            "shadow-lg"
          )}>
            {typeof Icon === 'string' ? (
              <span className="text-2xl">{Icon}</span>
            ) : (
              <Icon className="w-7 h-7 text-white" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h4 className="text-white font-semibold">{name}</h4>
              {connected && (
                <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 text-xs">
                  <Check className="w-3 h-3" />
                  Connected
                </span>
              )}
            </div>
            <p className="text-sm text-gray-400 mt-0.5">{description}</p>
          </div>

          <div className="flex items-center gap-2">
            {connected ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDisconnect}
                disabled={isLoading}
                className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <X className="w-4 h-4 mr-1" />
                    Disconnect
                  </>
                )}
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleConnect}
                disabled={isLoading}
                className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <ExternalLink className="w-4 h-4 mr-1" />
                    Connect
                  </>
                )}
              </Button>
            )}
          </div>
        </div>

        {/* Features toggle */}
        {features.length > 0 && (
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="mt-3 flex items-center gap-1 text-xs text-gray-500 hover:text-gray-400 transition-colors"
          >
            <ChevronRight className={cn(
              "w-3 h-3 transition-transform",
              showDetails && "rotate-90"
            )} />
            {features.length} capabilities
          </button>
        )}

        <AnimatePresence>
          {showDetails && features.length > 0 && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="mt-3 pt-3 border-t border-white/5">
                <div className="flex flex-wrap gap-2">
                  {features.map((feature, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 rounded-lg bg-white/5 text-xs text-gray-400"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Status indicator line */}
      <div className={cn(
        "absolute bottom-0 left-0 right-0 h-0.5",
        connected 
          ? "bg-gradient-to-r from-green-500 to-emerald-500" 
          : "bg-gradient-to-r from-gray-700 to-gray-600"
      )} />
    </motion.div>
  );
}