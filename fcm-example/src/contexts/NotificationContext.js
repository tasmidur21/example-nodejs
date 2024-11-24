// NotificationContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';
import { getMessaging, getToken, onMessage, deleteToken } from 'firebase/messaging';
import { initializeApp } from 'firebase/app';

export const NotificationContext = createContext();

const vapidKey =
  "BI0cnTE9S1bjZL4C8fz2lXVIKyn5Zul46u_vN4MlGda5ucORqtEvmqJGTfLxzlzOftDLWm9NVcQZBKurCkYfiqM";
const firebaseConfig = {
  apiKey: "AIzaSyDt0X5idKwYUVqAMtb9Acc52ShZ8e0FCN4",
  authDomain: "tasmidur-fcm-testing.firebaseapp.com",
  projectId: "tasmidur-fcm-testing",
  storageBucket: "tasmidur-fcm-testing.firebasestorage.app",
  messagingSenderId: "138949322697",
  appId: "1:138949322697:web:27c70880f9c137f4406a18",
  measurementId: "G-YHQ9NY6C27",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

export const NotificationProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null);

  // Request notification permission and get token
  const requestPermission = async () => {
    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        const token = await getToken(messaging, { vapidKey: vapidKey });
        setToken(token);
        console.log('FCM Token:', token);
        // Send token to your server for registration
        await fetch('http://localhost:3010/register-token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId: 'userId-01', token }), // Replace USER_ID with actual user ID
        });
      } else {
        console.log('Unable to get permission to notify.');
      }
    } catch (err) {
      console.error('Error getting token:', err);
      setError(err);
    }
  };

  // Listen for messages when the app is in the foreground
  useEffect(() => {
    const unsubscribe = onMessage(messaging, (payload) => {
      console.log('Message received. ', payload);
      setNotification(payload.notification); // Set the received notification
      // Optionally, display the notification
      const notificationTitle = payload.notification.title;
      const notificationOptions = {
        body: payload.notification.body,
        icon: payload.notification.icon,
      };
      new Notification(notificationTitle, notificationOptions);
    });

    //return () => unsubscribe();
  }, []);

//   onMessage(messaging, (payload) => {
//     console.log('Message received. ', payload);
//     setNotification(payload.notification); // Set the received notification
//     // Optionally, display the notification
//     const notificationTitle = payload.notification.title;
//     const notificationOptions = {
//       body: payload.notification.body,
//       icon: payload.notification.icon,
//     };
//     new Notification(notificationTitle, notificationOptions);
//   })

  // Call requestPermission on mount
  useEffect(() => {
    requestPermission();
  }, []);

  // Function to delete token (e.g., on logout)
  const deleteNotificationToken = async () => {
    if (token) {
      try {
        await deleteToken(messaging);
        console.log('Token deleted successfully.');
        setToken(null);
      } catch (err) {
        console.error('Unable to delete token.', err);
      }
    }
  };

  return (
    <NotificationContext.Provider value={{ token, error, notification, deleteNotificationToken }}>
      {children}
    </NotificationContext.Provider>
  );
};
