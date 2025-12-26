import React from 'react';
import { motion } from 'framer-motion';
import { Wifi, WifiOff, Server, Mic, MicOff } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function StatusIndicator({ 
  isOnline = true, 
  isListening = false,
  serverStatus = 'connected' 
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-4 left-4 z-50"
    >
      <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-900/80 backdrop-blur-sm border border-white/10">
        {/* Network status */}
        <div className="flex items-center gap-1.5">
          {isOnline ? (
            <Wifi className="w-3.5 h-3.5 text-green-400" />
          ) : (
            <WifiOff className="w-3.5 h-3.5 text-red-400" />
          )}
          <span className={cn(
            "text-xs",
            isOnline ? "text-green-400" : "text-red-400"
          )}>
            {isOnline ? 'Online' : 'Offline'}
          </span>
        </div>

        <div className="w-px h-4 bg-white/10" />

        {/* Server status */}
        <div className="flex items-center gap-1.5">
          <Server className={cn(
            "w-3.5 h-3.5",
            serverStatus === 'connected' ? "text-blue-400" : "text-gray-500"
          )} />
          <span className={cn(
            "text-xs",
            serverStatus === 'connected' ? "text-blue-400" : "text-gray-500"
          )}>
            {serverStatus === 'connected' ? 'AI Ready' : 'Connecting...'}
          </span>
        </div>

        <div className="w-px h-4 bg-white/10" />

        {/* Mic status */}
        <div className="flex items-center gap-1.5">
          {isListening ? (
            <>
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 1 }}
              >
                <Mic className="w-3.5 h-3.5 text-red-400" />
              </motion.div>
              <span className="text-xs text-red-400">Recording</span>
            </>
          ) : (
            <>
              <MicOff className="w-3.5 h-3.5 text-gray-500" />
              <span className="text-xs text-gray-500">Mic off</span>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
}