import React from 'react';

export default function Layout({ children, currentPageName }) {
  // The layout is minimal as each page has its own background
  // This ensures consistent styling across all pages
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {children}
    </div>
  );
}