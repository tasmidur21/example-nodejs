// This a service worker file for receiving push notifitications.
// See `Access registration token section` @ https://firebase.google.com/docs/cloud-messaging/js/client#retrieve-the-current-registration-token

// Scripts for firebase and firebase messaging
importScripts('https://www.gstatic.com/firebasejs/8.2.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.2.0/firebase-messaging.js');


// Initialize the Firebase app in the service worker by passing the generated config
const firebaseConfig = {
  apiKey: "AIzaSyDt0X5idKwYUVqAMtb9Acc52ShZ8e0FCN4",
  authDomain: "tasmidur-fcm-testing.firebaseapp.com",
  projectId: "tasmidur-fcm-testing",
  storageBucket: "tasmidur-fcm-testing.firebasestorage.app",
  messagingSenderId: "138949322697",
  appId: "1:138949322697:web:27c70880f9c137f4406a18",
  measurementId: "G-YHQ9NY6C27",
};


firebase.initializeApp(firebaseConfig);

// Retrieve firebase messaging
const messaging = firebase.messaging();

// Handle incoming messages while the app is not in focus (i.e in the background, hidden behind other tabs, or completely closed).
messaging.onBackgroundMessage(function(payload) {
  console.log('Received background message ', payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
  };

  self.registration.showNotification(notificationTitle,
    notificationOptions);
});
