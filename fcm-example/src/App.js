import React, { useEffect } from 'react';
import { NotificationProvider } from './contexts/NotificationContext';
import { toast, Toaster } from 'sonner';
import FloatingChat from './components/FloatingChat';

// Toast helper function
const showSonarToast = (type, message, options = {}) => {
  const defaultOptions = {};
  const finalOptions = { ...defaultOptions, ...options };

  switch (type) {
    case 'success':
      toast.success(message, finalOptions);
      break;
    case 'error':
      toast.error(message, finalOptions);
      break;
    case 'info':
      toast(message, finalOptions);
      break;
    case 'loading':
      toast.loading(message, finalOptions);
      break;
    case 'custom':
      toast(message, finalOptions);
      break;
    default:
      console.warn('Invalid toast type provided. Use "success", "error", "info", "loading", or "custom".');
  }
};

const App = () => {
  const roomId="userA_userB";

  return (
    <NotificationProvider>
      <div>
        <h1>Notification and Chat Example</h1>
        <Toaster position="top-center" richColors={true} duration={5000} />
        {/* <Tabs /> Use the Tabs component here */}
        <div className="relative">
      <FloatingChat />
    </div>
      </div>
    </NotificationProvider>
  );
};

export default App;