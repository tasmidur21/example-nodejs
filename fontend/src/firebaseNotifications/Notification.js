import React, {useState, useEffect} from 'react'
import toast, { Toaster } from 'react-hot-toast';
import { requestForToken, onMessageListener, messaging } from './firebase';
import { getToken } from 'firebase/messaging';

const Notification = () => {
  const [notification, setNotification] = useState({title: '', body: ''});
  const [notifications, setNotifications] = useState([]);
  const notify = () =>  toast(<ToastDisplay/>); 
  function ToastDisplay() {
    return (
      <div>
        <p><b>{notification?.title}</b></p>
        <p>{notification?.body}</p>
      </div>
    );
  };

  useEffect(() => {
    if (notification?.title ){
     notify()
    }
  }, [notification])

  requestForToken();

  onMessageListener()
    .then((payload) => {
      setNotification({title: payload?.notification?.title, body: payload?.notification?.body});    
      setNotifications([...notifications, payload?.notification]);
    })
    .catch((err) => console.log('failed: ', err));



    const subscribeToTopic = async (e,topic) => {
      e.preventDefault();
      const token = await getToken(messaging);
      if (token) {
        try {
          const response = await fetch('http://localhost:3010/subscribe', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ token, topic }),
          });
  
          const data = await response.text();
          console.log(data);
        } catch (error) {
          console.error('Error subscribing to topic:', error);
        }
      } else {
        console.error('No registration token available.');
      }
    };
  
    return (
      <div>
        <h1>FCM Notifications</h1>
        <button key="test-fcm-topic-01" onClick={(e) => subscribeToTopic(e,'test-fcm-topic-03')}>Subscribe to Topic-1</button>
        <br />
        <br />
        <div>
          <h1>Notifications</h1>
          {notifications.map((notification, index) => (
            <div key={index}>
              <h2>{index+1}: {notification.title}</h2>
              </div>
          ))}
        </div>
        <Toaster/>
      </div>
    );
}

export default Notification
