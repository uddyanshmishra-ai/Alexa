import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { api } from '@/api/restClient';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

import CommandHistoryCard from '@/components/assistant/CommandHistoryCard';
import AnimatedBackground from '@/components/ui/AnimatedBackground';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { 
  ArrowLeft, 
  Search, 
  Filter, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  Trash2,
  Download
} from 'lucide-react';

export default function History() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [intentFilter, setIntentFilter] = useState('all');

  const { data: commands = [], isLoading, refetch } = useQuery({
    queryKey: ['commands'],
    queryFn: () => api.commands.list({ sort: '-created_date', limit: 100 }),
  });

  // Get unique intents for filter
  const uniqueIntents = [...new Set(commands.map(c => c.intent).filter(Boolean))];

  // Filter commands
  const filteredCommands = commands.filter(cmd => {
    const matchesSearch = !searchQuery || 
      cmd.utterance?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cmd.response?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || cmd.status === statusFilter;
    const matchesIntent = intentFilter === 'all' || cmd.intent === intentFilter;

    return matchesSearch && matchesStatus && matchesIntent;
  });

  // Stats
  const stats = {
    total: commands.length,
    executed: commands.filter(c => c.status === 'executed').length,
    failed: commands.filter(c => c.status === 'failed').length,
    pending: commands.filter(c => c.status === 'pending').length,
  };

  const handleRetry = (command) => {
    // Navigate to home with the command pre-filled
    window.location.href = createPageUrl('Home') + `?command=${encodeURIComponent(command.utterance)}`;
  };

  const exportHistory = () => {
    const data = filteredCommands.map(cmd => ({
      date: cmd.created_date,
      command: cmd.utterance,
      intent: cmd.intent,
      status: cmd.status,
      response: cmd.response
    }));
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'command-history.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen relative">
      <AnimatedBackground />

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center gap-4">
            <Link
              to={createPageUrl('Home')}
              className="p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-400" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-white">Command History</h1>
              <p className="text-gray-500 text-sm">View and manage your past commands</p>
            </div>
          </div>

          <Button
            variant="outline"
            onClick={exportHistory}
            className="bg-white/5 border-white/10 text-white hover:bg-white/10"
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          {[
            { label: 'Total', value: stats.total, icon: Clock, color: 'blue' },
            { label: 'Executed', value: stats.executed, icon: CheckCircle2, color: 'green' },
            { label: 'Failed', value: stats.failed, icon: XCircle, color: 'red' },
            { label: 'Pending', value: stats.pending, icon: AlertCircle, color: 'yellow' },
          ].map((stat, index) => (
            <div
              key={stat.label}
              className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-4"
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl bg-${stat.color}-500/20 flex items-center justify-center`}>
                  <stat.icon className={`w-5 h-5 text-${stat.color}-400`} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                  <p className="text-xs text-gray-500">{stat.label}</p>
                </div>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col md:flex-row gap-4 mb-6"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search commands..."
              className="pl-10 bg-white/5 border-white/10 text-white placeholder-gray-500"
            />
          </div>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-40 bg-white/5 border-white/10 text-white">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="executed">Executed</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>

          <Select value={intentFilter} onValueChange={setIntentFilter}>
            <SelectTrigger className="w-full md:w-48 bg-white/5 border-white/10 text-white">
              <SelectValue placeholder="Intent" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Intents</SelectItem>
              {uniqueIntents.map(intent => (
                <SelectItem key={intent} value={intent}>{intent}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </motion.div>

        {/* Commands List */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-gray-400">Loading history...</p>
            </div>
          ) : filteredCommands.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-gray-500" />
              </div>
              <h3 className="text-white font-medium mb-2">No commands found</h3>
              <p className="text-gray-500 text-sm">
                {searchQuery || statusFilter !== 'all' || intentFilter !== 'all' 
                  ? 'Try adjusting your filters'
                  : 'Your command history will appear here'}
              </p>
            </motion.div>
          ) : (
            filteredCommands.map((command, index) => (
              <CommandHistoryCard
                key={command.id}
                command={command}
                index={index}
                onRetry={handleRetry}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}