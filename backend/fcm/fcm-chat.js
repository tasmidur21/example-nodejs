import admin from 'firebase-admin';
import serviceAccount from './fcm-secret.json' assert { type: 'json' };

// Initialize Firebase
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://tasmidur-fcm-testing-default-rtdb.asia-southeast1.firebasedatabase.app",
});

const db = admin.database();
// Function to generate a unique chat room ID for single chat
const generateSingleChatRoomId = (user1, user2) => {
    // Sort the user IDs lexicographically to get a consistent ID
    const participants = [user1, user2].sort();
    return participants.join('_'); // Join user IDs with an underscore
  };
  
  // Function to check if the single chatroom exists
  const checkSingleChatRoomExists = async (chatRoomId) => {
    const snapshot = await db.ref(`chatrooms/${chatRoomId}`).once('value');
    return snapshot.exists();
  };
  
  // Function to create a single chat room
  const createSingleChatRoom = async (user1, user2) => {
    const chatRoomId = generateSingleChatRoomId(user1, user2);
    const exists = await checkSingleChatRoomExists(chatRoomId);
  
    if (!exists) {
      // Create a new chat room for the two users
      const chatRoomData = {
        type: 'single',
        participants: [user1, user2],
        createdAt: admin.database.ServerValue.TIMESTAMP,
      };
      await db.ref(`chatrooms/${chatRoomId}`).set(chatRoomData);
      console.log(`Single chat room created: ${chatRoomId}`);
    } else {
      console.log(`Single chat room already exists: ${chatRoomId}`);
    }
  
    return chatRoomId;
  };
  
  // Function to create a group chat room
  const createGroupChatRoom = async (groupName, participants) => {
    const groupId = `group_${Date.now()}`; // Use timestamp or UUID for a unique group ID
    const groupData = {
      name: groupName,
      participants: participants,
      createdAt: admin.database.ServerValue.TIMESTAMP,
      admin: participants[0], // Assume the first participant is the admin
    };
  
    await db.ref(`chatrooms/${groupId}`).set(groupData);
    console.log(`Group chat room created: ${groupId}`);
    return groupId;
  };
  
  // Function to send a message to a chat room
  const sendChatMessage = async (chatRoomId, sender, message) => {
    const messageId = db.ref(`chatrooms/${chatRoomId}/messages`).push().key;
    const messageData = {
      sender: sender,
      content: message,
      timestamp: admin.database.ServerValue.TIMESTAMP,
    };
  
    await db.ref(`chatrooms/${chatRoomId}/messages/${messageId}`).set(messageData);
    console.log(`Message sent: ${messageData.content}`);
  };
  
  // Function to listen for new messages in a chat room
  const listenToMessages = (chatRoomId) => {
    db.ref(`chatrooms/${chatRoomId}/messages`).on('child_added', (snapshot) => {
      console.log('New message received:', snapshot.val());
    });
  };

  // Function to query messages for a specific user and chat room based on seen status
const queryMessagesBySeenStatus = async (chatRoomId, userId, seenStatus = true) => {
    const messagesRef = db.ref(`chatrooms/${chatRoomId}/messages`);
    const snapshot = await messagesRef.once('value');
    
    const messages = snapshot.val();
    if (!messages) {
      console.log('No messages found in this chat room.');
      return;
    }
  
    const filteredMessages = [];
    for (const messageId in messages) {
      const message = messages[messageId];
  
      // Check if the message has the 'seen' status for the specified user
      const userSeenStatus = message.seen ? message.seen[userId] : null;
      
      // Filter messages based on the 'seen' status
      if (userSeenStatus === seenStatus) {
        filteredMessages.push(message);
      }
    }
  
    console.log(`Messages for ${userId} in chat room ${chatRoomId} with seen status ${seenStatus}:`);
    console.log(filteredMessages);
  };
  
  // Function to listen for new messages in a chat room
const listenForNewMessages = (chatRoomId, userId) => {
    const messagesRef = db.ref(`chatrooms/${chatRoomId}/messages`);
    
    messagesRef.on('child_added', (snapshot) => {
      const message = snapshot.val();
      const senderId = message.sender;
  
      // If the message is not from the current user, notify the user
      if (senderId !== userId) {
        console.log(`New message from ${senderId}: ${message.content}`);
        // Optionally, trigger a push notification to the other user
        sendPushNotification(userId, `New message from ${senderId}: ${message.content}`);
      }
    });
  };
  
  // Function to send a push notification to the recipient
  const sendPushNotification = (userId, message) => {
    const fcmToken = getUserFCMToken(userId); // Fetch the FCM token for the user
  
    const messagePayload = {
      notification: {
        title: 'New Message',
        body: message,
      },
      token: fcmToken, // The user's FCM token
    };
  
    // Send the push notification using Firebase Cloud Messaging
    admin.messaging().send(messagePayload)
      .then((response) => {
        console.log('Successfully sent message:', response);
      })
      .catch((error) => {
        console.error('Error sending message:', error);
      });
  };
  
  // Example function to get FCM token for the user (this would normally be stored in your database)
  const getUserFCMToken = (userId) => {
    // In practice, you would query the database for the user's FCM token
    return 'USER_FCM_TOKEN'; // Replace with actual token from the database
  };
  
  // Function to send a message to a chat room
 export const sendMessage = async (payload) => {
  const { roomId, content, userId } = payload;
    const messagesRef = db.ref(roomId);
    const newMessageRef = messagesRef.push();
    // Push the new message to the database
    await newMessageRef.set({
      text: content,
      sender: {
        id: userId,
        name: "John Doe", // Update with dynamic user name
        avatar: "https://png.pngtree.com/png-vector/20230903/ourmid/pngtree-man-avatar-isolated-png-image_9935819.png", // Update with dynamic user avatar
        },
      timestamp: admin.database.ServerValue.TIMESTAMP,
    });
    // Trigger a notification to the other user in the chat room
    return newMessageRef.key;
  };
  
  // Function to update the "seen" status of a message for a user
  const markMessageAsSeen = async (chatRoomId, messageId, userId) => {
    const messageRef = db.ref(`chatrooms/${chatRoomId}/messages/${messageId}/seen`);
  
    // Mark the message as seen by the specified user
    await messageRef.update({ [userId]: true });
    console.log(`Message ${messageId} marked as seen by ${userId}`);
  };
  
