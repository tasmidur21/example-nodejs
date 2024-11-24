// App.js
import React from 'react';
import { NotificationProvider } from './contexts/NotificationContext';
import NotificationDisplay from './conponents/NotificationDisplay';


const App = () => {
  return (
    <NotificationProvider>
      <div>
        <h1>Notification Example</h1>
        <NotificationDisplay />
      </div>
    </NotificationProvider>
  );
};

export default App;