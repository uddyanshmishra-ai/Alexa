import React from 'react';
import { motion } from 'framer-motion';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';

export default function PermissionCard({ 
  icon: Icon, 
  title, 
  description, 
  enabled, 
  onToggle, 
  color = 'blue',
  locked = false 
}) {
  const colorClasses = {
    blue: 'from-blue-500 to-cyan-500',
    green: 'from-green-500 to-emerald-500',
    purple: 'from-purple-500 to-violet-500',
    orange: 'from-orange-500 to-amber-500',
    red: 'from-red-500 to-rose-500',
  };

  return (
    <motion.div
      whileHover={{ scale: locked ? 1 : 1.01 }}
      className={cn(
        "group relative overflow-hidden",
        "bg-white/5 backdrop-blur-sm rounded-2xl",
        "border border-white/10 hover:border-white/20",
        "transition-all duration-300",
        locked && "opacity-60"
      )}
    >
      <div className="p-4 flex items-center gap-4">
        <div className={cn(
          "w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0",
          `bg-gradient-to-br ${colorClasses[color]}`,
          "shadow-lg"
        )}>
          <Icon className="w-6 h-6 text-white" />
        </div>

        <div className="flex-1 min-w-0">
          <h4 className="text-white font-medium mb-0.5">{title}</h4>
          <p className="text-sm text-gray-400 line-clamp-2">{description}</p>
        </div>

        <Switch
          checked={enabled}
          onCheckedChange={onToggle}
          disabled={locked}
          className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-blue-500 data-[state=checked]:to-purple-500"
        />
      </div>

      {/* Glow effect when enabled */}
      {enabled && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={cn(
            "absolute inset-0 -z-10 blur-xl opacity-20",
            `bg-gradient-to-r ${colorClasses[color]}`
          )}
        />
      )}
    </motion.div>
  );
}