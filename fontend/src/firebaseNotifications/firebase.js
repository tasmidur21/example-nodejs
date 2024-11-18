// Firebase Cloud Messaging Configuration File. 
// Read more at https://firebase.google.com/docs/cloud-messaging/js/client && https://firebase.google.com/docs/cloud-messaging/js/receive

import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
const vapidKey='BNInzPGAC4FKCoObk8_ONDreVfG_Vk-T6XYJua5uJEKzGJ0LjNJ-pRwfqqvfBU40ftOencn6_IeE-GMpU6PXuf4';
var firebaseConfig = {
  apiKey: "AIzaSyDt0X5idKwYUVqAMtb9Acc52ShZ8e0FCN4",
  authDomain: "tasmidur-fcm-testing.firebaseapp.com",
  projectId: "tasmidur-fcm-testing",
  storageBucket: "tasmidur-fcm-testing.firebasestorage.app",
  messagingSenderId: "138949322697",
  appId: "1:138949322697:web:27c70880f9c137f4406a18",
  measurementId: "G-YHQ9NY6C27"
};

initializeApp(firebaseConfig);

export const messaging = getMessaging();

export const requestForToken = () => {
  return getToken(messaging, { vapidKey: vapidKey })
    .then((currentToken) => {
      if (currentToken) {
        console.log('current token for client: ', currentToken);
        // Perform any other neccessary action with the token
      } else {
        // Show permission request UI
        console.log('No registration token available. Request permission to generate one.');
      }
    })
    .catch((err) => {
      console.log('An error occurred while retrieving token. ', err);
    });
};

// Handle incoming messages. Called when:
// - a message is received while the app has focus
// - the user clicks on an app notification created by a service worker `messaging.onBackgroundMessage` handler.
export const onMessageListener = () =>
  new Promise((resolve) => {    
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
  });

  
