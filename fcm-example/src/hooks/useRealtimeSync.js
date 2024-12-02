import { useEffect, useState } from "react";
import { useNotification } from "./useNotification";

export default function useRealtimeSync({topics}) {
    const { notification, subscribeToTopic,token } = useNotification();
    const [realTimeSyncData, setRealTimeSyncData]=useState(null);

    useEffect(() => {
        if(token && topics.length>0){
           subscribeToTopic(topics[0],token).then(() => {
               console.log("subscribed to topics");
           })
        }
    }, [token,topics]);

    useEffect(() => {
        console.log("notification",notification?.data?.topic);
        if(topics.includes(notification?.data?.topic)){
          setRealTimeSyncData(notification);
        }
    },[notification]);

    return {realTimeSyncData};

}