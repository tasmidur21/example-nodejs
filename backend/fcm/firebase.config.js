// Import the Firebase Admin SDK
import admin from 'firebase-admin'; // ES6 syntax
import serviceAccount from './fcm-secret.json' assert { type: 'json' }; // Use assert for JSON imports

// Initialize the Firebase Admin SDK
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

// Export the admin instance for use in other modules
export default admin;