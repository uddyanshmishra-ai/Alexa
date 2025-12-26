import React from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  MessageCircle, 
  Chrome, 
  ShoppingBag, 
  Facebook, 
  Mail, 
  Clock, 
  HelpCircle,
  Navigation,
  Youtube
} from 'lucide-react';

const quickCommands = [
  { 
    icon: Chrome, 
    label: 'Open Chrome', 
    command: 'Open Chrome',
    color: 'from-yellow-500 to-orange-500' 
  },
  { 
    icon: Search, 
    label: 'Search Google', 
    command: 'Search Google for latest news',
    color: 'from-blue-500 to-cyan-500' 
  },
  { 
    icon: MessageCircle, 
    label: 'Send WhatsApp', 
    command: 'Send a WhatsApp message',
    color: 'from-green-500 to-emerald-500' 
  },
  { 
    icon: ShoppingBag, 
    label: 'Open Flipkart', 
    command: 'Open Flipkart',
    color: 'from-yellow-400 to-amber-500' 
  },
  { 
    icon: Facebook, 
    label: 'Open Facebook', 
    command: 'Open Facebook',
    color: 'from-blue-600 to-blue-700' 
  },
  { 
    icon: Mail, 
    label: 'Open Gmail', 
    command: 'Open Gmail',
    color: 'from-red-500 to-rose-500' 
  },
  { 
    icon: Youtube, 
    label: 'Open YouTube', 
    command: 'Open YouTube',
    color: 'from-red-600 to-red-700' 
  },
  { 
    icon: Clock, 
    label: 'Last Commands', 
    command: 'What did I ask you last time?',
    color: 'from-purple-500 to-violet-500' 
  },
  { 
    icon: Navigation, 
    label: 'Navigate', 
    command: 'Navigate to',
    color: 'from-teal-500 to-cyan-500' 
  },
  { 
    icon: HelpCircle, 
    label: 'Help', 
    command: 'What can you do?',
    color: 'from-gray-500 to-slate-600' 
  },
];

export default function QuickCommands({ onCommandSelect, disabled }) {
  return (
    <div className="w-full max-w-3xl mx-auto">
      <p className="text-center text-gray-400 text-sm mb-4">Quick Commands</p>
      <div className="flex flex-wrap justify-center gap-2">
        {quickCommands.map((cmd, index) => (
          <motion.button
            key={cmd.label}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onCommandSelect(cmd.command)}
            disabled={disabled}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-xl
              bg-white/5 border border-white/10 hover:border-white/20
              transition-all duration-200 group
              disabled:opacity-50 disabled:cursor-not-allowed
            `}
          >
            <div className={`
              w-7 h-7 rounded-lg flex items-center justify-center
              bg-gradient-to-br ${cmd.color}
              shadow-lg group-hover:shadow-xl transition-shadow
            `}>
              <cmd.icon className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm text-gray-300 group-hover:text-white transition-colors">
              {cmd.label}
            </span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}