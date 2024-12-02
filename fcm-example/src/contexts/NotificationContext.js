import React, { createContext, useContext, useEffect, useState } from 'react';
import { getMessaging, getToken, onMessage, deleteToken } from 'firebase/messaging';
import { initializeApp } from 'firebase/app';

export const NotificationContext = createContext();

const vapidKey = "BCGl2N9mhMuOJR5YCpQjQdQCiSFsgxoiMQqHe_-Zk70f2dHdH62Rpf4bYq9o5tZjcaktFN6D5ztmdafsRwTMpVc";

const firebaseConfig = {
  apiKey: "AIzaSyDt0X5idKwYUVqAMtb9Acc52ShZ8e0FCN4",
  authDomain: "tasmidur-fcm-testing.firebaseapp.com",
  databaseURL: "https://tasmidur-fcm-testing-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "tasmidur-fcm-testing",
  storageBucket: "tasmidur-fcm-testing.firebasestorage.app",
  messagingSenderId: "138949322697",
  appId: "1:138949322697:web:27c70880f9c137f4406a18",
  measurementId: "G-YHQ9NY6C27"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

export const NotificationProvider = ({ children }) => {
    const [token, setToken] = useState(null);
    const [error, setError] = useState(null);
    const [notification, setNotification] = useState(null);

    // Create a Broadcast Channel
    const channel = new BroadcastChannel('foreground_notification_channel');

    // Request notification permission and get token
    const requestPermission = async () => {
        try {
            const permission = await Notification.requestPermission();
            if (permission === 'granted') {
                const token = await getToken(messaging, { vapidKey: vapidKey });
                setToken(token);
                console.log('FCM Token:', token);
                // Send token to your server for registration
                await fetch('http://192.168.1.18:3010/register-token', {
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
            setNotification(payload); // Set the received notification
        });
        return () => {
            unsubscribe();
        };
    }, []);

    // Listen for messages from other tabs
    useEffect(() => {
        channel.onmessage = (event) => {
            console.log('Received broadcasted notification:', event);
            setNotification(event.data); // Update state with the broadcasted notification
        };
        return () => {
            channel.close(); // Clean up the channel on unmount
        };
    }, [channel]);

    // Call requestPermission on mount
    useEffect(() => {
        requestPermission();
    }, []);

    // Function to delete token (e.g., on logout)
    const deleteNotificationToken = async () => {
        if (token) {
            try {
                await deleteToken(messaging);
                await fetch('http://localhost:3010/delete-token', {
                  method: 'POST',
                  headers: {
                      'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({ userId: 'userId-01'}), // Replace USER_ID with actual user ID
              });
                console.log('Token deleted successfully.');
                setToken(null);
            } catch (err) {
                console.error('Unable to delete token.', err);
            }
        }
    };

    const subscribeToTopic = async (topic,token) => {
        try {
            await fetch('http://192.168.1.18:3010/subscribe', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ topic, token }), // Replace USER_ID with actual user ID
            });
            console.log('Successfully subscribed to topic:', topic);
        } catch (error) {
            console.error('Error subscribing to topic:', error);
        }
    };

    return (
        <NotificationContext.Provider value={{ token, error, notification , deleteNotificationToken,subscribeToTopic }}>
            {children}
        </NotificationContext.Provider>
    );
};