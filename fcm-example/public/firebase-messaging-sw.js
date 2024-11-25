// Scripts for firebase and firebase messaging
importScripts('https://www.gstatic.com/firebasejs/8.2.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.2.0/firebase-messaging.js');

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

firebase.initializeApp(firebaseConfig);

// Retrieve firebase messaging
const messaging = firebase.messaging();
const channel = new BroadcastChannel('foreground_notification_channel');

// Handle incoming messages while the app is not in focus (i.e in the background, hidden behind other tabs, or completely closed).
messaging.onBackgroundMessage(function(payload) {
  console.log('Received background message ', payload);
  channel.postMessage(payload);
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close(); // Close the notification when clicked
  console.log('Notification clicked: ', event.notification.data.url);
  const urlToOpen = event.data.url || 'https://default-url.com'; // Default URL if not specified

  event.waitUntil(
    clients.matchAll({ type: 'window' }).then(windowClients => {
      // Check if there is already a window/tab open with the target URL
      for (const client of windowClients) {
        if (client.url === urlToOpen && 'focus' in client) {
          return client.focus();
        }
      }
      // If not, open a new window/tab with the target URL
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});

self.addEventListener('push', function(event) {
  const data = event.data.json();
  console.log('Received push message:', data);
  const notificationTitle = data.notification.title;
  const notificationOptions = {
    body: data.notification.body,
    icon: data.data?.icon // Use the icon URL from the data object
  };

  event.waitUntil(
    self.registration.showNotification(notificationTitle, notificationOptions)
  );
});

