import {Server} from "socket.io";


const io = new Server(3018, {
    cors: {
        origin: "*",
    }
});

export const publishMessage = (channel,message) => {
    io.emit(channel, JSON.stringify(message));
}