// src/firebaseConfig.js

import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";

const vapidKey =
  "BCGl2N9mhMuOJR5YCpQjQdQCiSFsgxoiMQqHe_-Zk70f2dHdH62Rpf4bYq9o5tZjcaktFN6D5ztmdafsRwTMpVc";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

export { messaging };