// Helper to generate URLs based on page names
export const createPageUrl = (pageName) => {
  const routes = {
    'Home': '/',
    'Chat': '/chat',
    'History': '/history',
    'Settings': '/settings',
    'Help': '/help',
    'Demo': '/demo',
    'Onboarding': '/onboarding'
  };
  return routes[pageName] || '/';
};