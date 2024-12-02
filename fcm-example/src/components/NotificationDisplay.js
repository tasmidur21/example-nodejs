// NotificationDisplay.js
import React, { useEffect } from 'react';
import { useNotification } from '../hooks/useNotification';
import useRealtimeSync from '../hooks/useRealtimeSync';

const NotificationDisplay = () => {
  const {realTimeSyncData}=useRealtimeSync({topics:["notification-topic-1"]});
  const [showNotification, setShowNotification] = React.useState([]);
  useEffect(() => {
    if(realTimeSyncData){
      console.log("realTimeSyncData",realTimeSyncData);
      
      setShowNotification([...showNotification, realTimeSyncData?.notification]);
    }
  }, [realTimeSyncData]);


  
  
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