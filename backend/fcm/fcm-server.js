// app.js
import express from 'express';
import bodyParser from 'body-parser'; // Optional: for parsing JSON bodies
import cors from 'cors';
import admin from './firebase.config.js';
import mongoose from 'mongoose';
import { publishMessage } from './socketClient.js';


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
  token: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: '30d' }, // Token expires after 30 days
});

const Token = mongoose.model('Token', tokenSchema);

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
  
      const message = {
        notification: {
          title: title,
          body: body,
        },
        token: tokenDoc.token,
        data:{
          title:title,
          icon: "https://www.svgrepo.com/show/31480/notification-bell.svg", // Custom icon URL for web
          url: "http://localhost:3006"
        }
      };

      publishMessage('receive_message',message);
  
      const response = await admin.messaging().send(message);
      console.log('Notification sent successfully:', response);
      res.status(200).send('Notification sent successfully');
    } catch (error) {
      console.error('Error sending notification:', error);
      res.status(500).send('Error sending notification');
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
      // Upsert token (update if exists, insert if not)
      await Token.findOneAndUpdate({ userId }, { token }, { upsert: true, new: true });
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

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});