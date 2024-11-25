// NotificationDisplay.js
import React, { useEffect } from 'react';
import { useNotification } from '../hooks/useNotification';

const NotificationDisplay = () => {
  const { notification } = useNotification();
  const [showNotification, setShowNotification] = React.useState([]);
  
  useEffect(() => {
      if(!notification){
        return;
      }
      setShowNotification([...showNotification, notification]);
  }, [notification]);
  
  return (
    <div style={{ padding: '10px', border: '1px solid #ccc', marginTop: '10px' }}>
      {
        showNotification.map((item, index) => (
          <div key={index}>
            <h2>{item.title}</h2>
            <p>{item.body}</p>
            </div>
        ))
      }
    </div>
  );
};

export default NotificationDisplay