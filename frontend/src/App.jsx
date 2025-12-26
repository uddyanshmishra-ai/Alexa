import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Import your pages here (Make sure files are in src/pages/)
import Home from './Pages/Home';
import Chat from './Pages/Chat';
import History from './Pages/History';
import Settings from './Pages/Settings';
import Help from './Pages/Help';
import Demo from './Pages/Demo';
import Onboarding from './Pages/Onboarding';

// Initialize React Query Client
const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          {/* Default Route */}
          <Route path="/" element={<Home />} />
          
          {/* App Routes */}
          <Route path="/chat" element={<Chat />} />
          <Route path="/history" element={<History />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/help" element={<Help />} />
          <Route path="/demo" element={<Demo />} />
          <Route path="/onboarding" element={<Onboarding />} />

          {/* Fallback route (agar koi galat URL dale toh Home par bhej do) */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}