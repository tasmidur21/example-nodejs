// app.js
import express from 'express';
import bodyParser from 'body-parser'; // Optional: for parsing JSON bodies
import cors from 'cors';
import admin from './firebase.config.js';


// Initialize Express
const app = express();
app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT || 3010;



// Example route to send a message to a topic
app.post('/send-notification', async (req, res) => {
    const { title, body, topic } = req.body;

    const message = {
        notification: {
            title: title,
            body: body,
        },
        topic: topic,
    };

    try {
        const response = await admin.messaging().send(message);
        console.log('Successfully sent message:', response);
        res.status(200).send('Notification sent successfully.');
    } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).send('Error sending notification.');
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

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});