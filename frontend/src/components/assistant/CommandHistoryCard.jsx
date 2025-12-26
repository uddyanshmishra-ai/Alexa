import React from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  AlertCircle,
  MessageSquare,
  ArrowRight,
  RefreshCw
} from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

const statusConfig = {
  executed: { 
    icon: CheckCircle2, 
    color: 'text-green-400', 
    bg: 'bg-green-500/10',
    border: 'border-green-500/20',
    label: 'Executed' 
  },
  failed: { 
    icon: XCircle, 
    color: 'text-red-400', 
    bg: 'bg-red-500/10',
    border: 'border-red-500/20',
    label: 'Failed' 
  },
  pending: { 
    icon: Clock, 
    color: 'text-yellow-400', 
    bg: 'bg-yellow-500/10',
    border: 'border-yellow-500/20',
    label: 'Pending' 
  },
  confirmed: { 
    icon: CheckCircle2, 
    color: 'text-blue-400', 
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/20',
    label: 'Confirmed' 
  },
  cancelled: { 
    icon: AlertCircle, 
    color: 'text-gray-400', 
    bg: 'bg-gray-500/10',
    border: 'border-gray-500/20',
    label: 'Cancelled' 
  },
};

export default function CommandHistoryCard({ command, onRetry, index = 0 }) {
  const status = statusConfig[command.status] || statusConfig.pending;
  const StatusIcon = status.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={cn(
        "group relative overflow-hidden",
        "bg-white/5 backdrop-blur-sm rounded-2xl",
        "border transition-all duration-300",
        status.border,
        "hover:bg-white/8"
      )}
    >
      <div className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <div className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0",
              status.bg
            )}>
              <MessageSquare className="w-5 h-5 text-blue-400" />
            </div>
            
            <div className="flex-1 min-w-0">
              <p className="text-white font-medium truncate">
                {command.utterance}
              </p>
              {command.intent && (
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-gray-500">Intent:</span>
                  <span className="text-xs text-blue-400 font-mono">
                    {command.intent}
                  </span>
                </div>
              )}
              {command.response && (
                <p className="text-sm text-gray-400 mt-2 line-clamp-2">
                  {command.response}
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-col items-end gap-2">
            <div className={cn(
              "flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium",
              status.bg, status.color
            )}>
              <StatusIcon className="w-3.5 h-3.5" />
              {status.label}
            </div>
            <span className="text-xs text-gray-500">
              {format(new Date(command.created_date), 'MMM d, h:mm a')}
            </span>
          </div>
        </div>

        {command.entities && Object.keys(command.entities).length > 0 && (
          <div className="mt-3 pt-3 border-t border-white/5">
            <div className="flex flex-wrap gap-2">
              {Object.entries(command.entities).map(([key, value]) => (
                <span 
                  key={key}
                  className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-white/5 text-xs"
                >
                  <span className="text-gray-500">{key}:</span>
                  <span className="text-gray-300">{String(value)}</span>
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Retry button for failed commands */}
      {command.status === 'failed' && onRetry && (
        <motion.button
          onClick={() => onRetry(command)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="absolute bottom-4 right-4 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500/20 text-blue-400 text-sm hover:bg-blue-500/30 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Retry
        </motion.button>
      )}
    </motion.div>
  );
}