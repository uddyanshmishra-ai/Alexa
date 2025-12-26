import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { api } from '@/api/restClient';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

import AnimatedBackground from '@/components/ui/AnimatedBackground';
import PermissionCard from '@/components/settings/PermissionCard';
import IntegrationCard from '@/components/settings/IntegrationCard';
import LanguageSelector from '@/components/assistant/LanguageSelector';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { 
  ArrowLeft, 
  Mic, 
  Bell, 
  Globe, 
  MessageCircle, 
  Navigation,
  Shield,
  Palette,
  Volume2,
  Save,
  User,
  Chrome,
  Mail
} from 'lucide-react';

export default function Settings() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('general');
  
  const [preferences, setPreferences] = useState({
    language: 'en-US',
    voice_enabled: true,
    theme: 'dark',
    tts_voice: 'default',
    permissions: {
      microphone: false,
      notifications: false,
      navigation: true,
      messaging: false
    }
  });

  const { data: savedPrefs } = useQuery({
    queryKey: ['userPreferences'],
    queryFn: async () => {
      const prefs = await api.preferences.list({ sort: '-created_date', limit: 1 });
      return prefs[0] || null;
    }
  });

  useEffect(() => {
    if (savedPrefs) {
      setPreferences({
        ...preferences,
        ...savedPrefs,
        permissions: { ...preferences.permissions, ...savedPrefs.permissions }
      });
    }
  }, [savedPrefs]);

  const saveMutation = useMutation({
    mutationFn: async (data) => {
      if (savedPrefs?.id) {
        return api.preferences.update(savedPrefs.id, data);
      } else {
        return api.preferences.create(data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userPreferences'] });
    }
  });

  const handleSave = () => {
    saveMutation.mutate(preferences);
  };

  const updatePermission = (key, value) => {
    setPreferences(prev => ({
      ...prev,
      permissions: { ...prev.permissions, [key]: value }
    }));
  };

  const integrations = [
    {
      icon: '🟢',
      name: 'WhatsApp',
      description: 'Send messages via WhatsApp',
      connected: false,
      color: 'bg-green-500',
      features: ['Send messages', 'Share links', 'Send to contacts']
    },
    {
      icon: Chrome,
      name: 'Chrome Browser',
      description: 'Control browser navigation',
      connected: true,
      color: 'bg-yellow-500',
      features: ['Open tabs', 'Search', 'Navigate URLs']
    },
    {
      icon: '📘',
      name: 'Facebook',
      description: 'Access Facebook features',
      connected: false,
      color: 'bg-blue-600',
      features: ['Open pages', 'View notifications', 'Navigate sections']
    },
    {
      icon: Mail,
      name: 'Gmail',
      description: 'Compose and send emails',
      connected: false,
      color: 'bg-red-500',
      features: ['Compose email', 'Open inbox', 'Search emails']
    }
  ];

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
              <h1 className="text-2xl font-bold text-white">Settings</h1>
              <p className="text-gray-500 text-sm">Customize your assistant experience</p>
            </div>
          </div>

          <Button
            onClick={handleSave}
            disabled={saveMutation.isPending}
            className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
          >
            <Save className="w-4 h-4 mr-2" />
            {saveMutation.isPending ? 'Saving...' : 'Save Changes'}
          </Button>
        </motion.div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-white/5 border border-white/10 p-1">
            <TabsTrigger 
              value="general"
              className="data-[state=active]:bg-white/10 data-[state=active]:text-white"
            >
              <Palette className="w-4 h-4 mr-2" />
              General
            </TabsTrigger>
            <TabsTrigger 
              value="permissions"
              className="data-[state=active]:bg-white/10 data-[state=active]:text-white"
            >
              <Shield className="w-4 h-4 mr-2" />
              Permissions
            </TabsTrigger>
            <TabsTrigger 
              value="integrations"
              className="data-[state=active]:bg-white/10 data-[state=active]:text-white"
            >
              <Globe className="w-4 h-4 mr-2" />
              Integrations
            </TabsTrigger>
          </TabsList>

          {/* General Settings */}
          <TabsContent value="general" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6"
            >
              <h3 className="text-lg font-semibold text-white mb-6">Language & Voice</h3>
              
              <div className="grid gap-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-white">Interface Language</Label>
                    <p className="text-sm text-gray-500">Choose your preferred language</p>
                  </div>
                  <LanguageSelector 
                    value={preferences.language} 
                    onChange={(val) => setPreferences({ ...preferences, language: val })} 
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-white">Voice Response</Label>
                    <p className="text-sm text-gray-500">Enable text-to-speech responses</p>
                  </div>
                  <Select 
                    value={preferences.voice_enabled ? 'enabled' : 'disabled'}
                    onValueChange={(val) => setPreferences({ ...preferences, voice_enabled: val === 'enabled' })}
                  >
                    <SelectTrigger className="w-32 bg-white/5 border-white/10 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="enabled">Enabled</SelectItem>
                      <SelectItem value="disabled">Disabled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-white">TTS Voice</Label>
                    <p className="text-sm text-gray-500">Select voice style</p>
                  </div>
                  <Select 
                    value={preferences.tts_voice}
                    onValueChange={(val) => setPreferences({ ...preferences, tts_voice: val })}
                  >
                    <SelectTrigger className="w-32 bg-white/5 border-white/10 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="default">Default</SelectItem>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6"
            >
              <h3 className="text-lg font-semibold text-white mb-6">Appearance</h3>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-white">Theme</Label>
                  <p className="text-sm text-gray-500">Choose your preferred theme</p>
                </div>
                <Select 
                  value={preferences.theme}
                  onValueChange={(val) => setPreferences({ ...preferences, theme: val })}
                >
                  <SelectTrigger className="w-32 bg-white/5 border-white/10 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </motion.div>
          </TabsContent>

          {/* Permissions */}
          <TabsContent value="permissions" className="space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <p className="text-gray-400 mb-6">
                Control what the assistant can access and do on your behalf.
              </p>
              
              <div className="grid gap-4">
                <PermissionCard
                  icon={Mic}
                  title="Microphone Access"
                  description="Allow voice input for hands-free commands"
                  enabled={preferences.permissions.microphone}
                  onToggle={(val) => updatePermission('microphone', val)}
                  color="blue"
                />
                
                <PermissionCard
                  icon={Bell}
                  title="Notifications"
                  description="Receive alerts and command confirmations"
                  enabled={preferences.permissions.notifications}
                  onToggle={(val) => updatePermission('notifications', val)}
                  color="purple"
                />
                
                <PermissionCard
                  icon={Navigation}
                  title="Navigation"
                  description="Open websites and apps in new tabs"
                  enabled={preferences.permissions.navigation}
                  onToggle={(val) => updatePermission('navigation', val)}
                  color="green"
                />
                
                <PermissionCard
                  icon={MessageCircle}
                  title="Messaging"
                  description="Send messages via WhatsApp, email, etc."
                  enabled={preferences.permissions.messaging}
                  onToggle={(val) => updatePermission('messaging', val)}
                  color="orange"
                />
              </div>
            </motion.div>
          </TabsContent>

          {/* Integrations */}
          <TabsContent value="integrations" className="space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <p className="text-gray-400 mb-6">
                Connect external services to enhance your assistant's capabilities.
              </p>
              
              <div className="grid gap-4">
                {integrations.map((integration, index) => (
                  <IntegrationCard
                    key={integration.name}
                    {...integration}
                    onConnect={() => console.log('Connect:', integration.name)}
                    onDisconnect={() => console.log('Disconnect:', integration.name)}
                  />
                ))}
              </div>

              <div className="mt-6 p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
                <p className="text-sm text-blue-300">
                  <strong>Note:</strong> Some integrations require additional setup. 
                  Web-based actions use deep links and may have limited functionality 
                  compared to native app integrations.
                </p>
              </div>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}