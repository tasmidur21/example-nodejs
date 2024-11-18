// src/app.js

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Built-in middleware to parse JSON

// Connect to MongoDB
const mongoURI = 'mongodb://localhost:27017/example-nodejs-v1'; // Replace with your MongoDB URI
mongoose.connect(mongoURI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));


// Health Check Route
app.get('/', (req, res) => {
    res.json({ status: true, message: "Our Express app works!" });
});

// Start the server
const PORT = process.env.PORT || 3010;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});