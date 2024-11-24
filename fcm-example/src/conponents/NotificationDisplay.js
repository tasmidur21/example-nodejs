// NotificationDisplay.js
import React from 'react';
import { useNotification } from '../hooks/useNotification';

const NotificationDisplay = () => {
  const { notification } = useNotification();
  
  if (!notification) {
    return null; // Don't render anything if there is no notification
  }
  
  console.log("notification",notification);
  

  return (
    <div style={{ padding: '10px', border: '1px solid #ccc', marginTop: '10px' }}>
      <h2>{notification.title}</h2>
      <p>{notification.body}</p>
    </div>
  );
};

export default NotificationDisplay