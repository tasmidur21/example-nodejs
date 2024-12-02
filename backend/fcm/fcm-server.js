// app.js
import express from 'express';
import bodyParser from 'body-parser'; // Optional: for parsing JSON bodies
import cors from 'cors';
import admin, { db } from './firebase.config.js';
import mongoose from 'mongoose';


// Initialize Express
const app = express();
app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT || 3010;

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/fcm-tokens').then(() => {
    console.log('MongoDB connected');
  }).catch(err => {
    console.error('MongoDB connection error:', err);
  });

const tokenSchema = mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  platformType:{
    type: String,
    default: 'web'
  },
  token: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: '30d' }, // Token expires after 30 days
});

const Token = mongoose.model('Token', tokenSchema);


// Define Chat Room and Message schemas
const chatRoomSchema = new mongoose.Schema({
  name: String,
  description: String,
  isGroup: { type: Boolean, default: false }, // Indicates if it's a group chat
  allowedParticipants: [String], // User IDs of allowed participants
  purpose: {
    type: String,
    default: 'General Chat',
  },
  purposeReference: String,
  createdAt: { type: Date, default: Date.now },
});

const messageSchema = new mongoose.Schema({
  roomId: String,
  userId: String,
  text: String,
  createdAt: { type: Date, default: Date.now },
});

const ChatRoom = mongoose.model('ChatRoom', chatRoomSchema);
const Message = mongoose.model('Message', messageSchema);


// Example route to send a message to a topic
// app.post('/send-notification', async (req, res) => {
//     const { title, body, topic } = req.body;

//     const message = {
//         notification: {
//             title: title,
//             body: body,
//         },
//         topic: topic,
//         data:{
//             title:title,
//             body:topic
//         }
//     };

//     try {
//         const response = await admin.messaging().send(message);
//         console.log('Successfully sent message:', response);
//         res.status(200).send('Notification sent successfully.');
//     } catch (error) {
//         console.error('Error sending message:', error);
//         res.status(500).send('Error sending notification.');
//     }
// });


// Endpoint to send notifications
app.post('/send-notification', async (req, res) => {
  const { userId, title, body } = req.body;

  try {
      const tokenDoc = await Token.findOne({ userId });
      if (!tokenDoc) {
          return res.status(404).send('No token found for user');
      }
      console.log(`Sending notification to token: ${tokenDoc.token}`);
      
      // Prepare the message
      const message = {
          topic: tokenDoc.token,
          notification: {
              title: title,
              body: body,
          },
          data: {
              title: title,
              icon: "https://www.svgrepo.com/show/31480/notification-bell.svg", // Custom icon URL for web
              url: "http://localhost:3006"
          }
      };

      // Send the notification using Firebase Cloud Messaging
      await admin.messaging().send(message);
      // Wait for all notifications to be sent
      res.status(200).send('Notifications sent successfully');
  } catch (error) {
      console.error('Error sending notifications:', error);
      res.status(500).send('Error sending notifications');
  }
});

app.post('/send-notification-to-topic', async (req, res) => {
  const { userId, title, body,topic } = req.body;
  console.log(req.body);
  
  try {
      // Prepare the message
      const message = {
          notification: {
              title: title,
              body: body,
          },
          data: {
              title: title,
              icon: "https://www.svgrepo.com/show/31480/notification-bell.svg", // Custom icon URL for web
              url: "http://localhost:3006",
              topic: topic
          },
          topic:topic
      };

      // Send the notification using Firebase Cloud Messaging
      await admin.messaging().send(message);
      // Wait for all notifications to be sent
      res.status(200).send('Notifications sent successfully');
  } catch (error) {
      console.error('Error sending notifications:', error);
      res.status(500).send('Error sending notifications');
  }
});

app.get('/', (req, res) => {
    res.send('Hello, World!');
});

// Endpoint to subscribe to a topic
app.post('/subscribe', async (req, res) => {
    const { token, topic } = req.body;
    try {
      await admin.messaging().subscribeToTopic(token, topic);
      res.status(200).send(`Successfully subscribed to topic: ${topic}`);
    } catch (error) {
      console.error('Error subscribing to topic:', error);
      res.status(500).send('Error subscribing to topic');
    }
  });

  // Endpoint to register tokens
app.post('/register-token', async (req, res) => {
    const { userId, token } = req.body; // Assuming you send a userId with the token
  
    if (!token || !userId) {
      return res.status(400).send('Invalid token or user ID');
    }
  
    try {
      const topic = `notification-topic-${userId}`;
      await admin.messaging().subscribeToTopic(token, topic);
      // Upsert token (update if exists, insert if not)
      await Token.updateOne(
        { userId },
        { token: topic }, // Use $addToSet to avoid duplicates
        { upsert: true }
      );
      console.log('Token registered for user:', userId);
      res.status(200).send('Token registered successfully');
    } catch (error) {
      console.error('Error registering token:', error);
      res.status(500).send('Error registering token');
    }
  });

  // Endpoint to delete a token (for example, when a user logs out)
app.post('/delete-token', async (req, res) => {
    const { userId } = req.body;
  
    try {
      await Token.deleteOne({ userId });
      console.log('Token deleted for user:', userId);
      res.status(200).send('Token deleted successfully');
    } catch (error) {
      console.error('Error deleting token:', error);
      res.status(500).send('Error deleting token');
    }
  });


// Endpoint to send a message
app.post('/send-message', async (req, res) => {
  try {
    const { roomId, content, userId,replyTo } = req.body;
    const messagesRef = db.ref(roomId);
    const newMessageRef = messagesRef.push();
    // Push the new message to the database
    const avatars = [
      "https://png.pngtree.com/png-vector/20230903/ourmid/pngtree-man-avatar-isolated-png-image_9935819.png",
      "https://img.freepik.com/free-vector/smiling-redhaired-cartoon-boy_1308-174709.jpg",
      "https://images.vexels.com/media/users/3/145922/raw/eb6591b54b2b6462b4c22ec1fc4c36ea-female-avatar-maker.jpg"
  ];
  const randomAvatar = avatars[Math.floor(Math.random() * avatars.length)];

    await newMessageRef.set({
      text: content,
      replyTo,
      sender: {
        id: userId,
        name: `Mr. ${userId}`, // Update with dynamic user name
        avatar: randomAvatar // Update with dynamic user avatar
        },
      timestamp: admin.database.ServerValue.TIMESTAMP,
    });
    // Trigger a notification to the other user in the chat room
    return newMessageRef.key;
  } catch (error) {
    res.status(500).send('Error sending message: ' + error.message);
  }
});


// Start the server
app.listen(PORT,'192.168.1.18', () => {
    console.log(`Server is running on http://192.168.1.18:${PORT}`);
});