import { io } from "socket.io-client";

const socket = io("http://localhost:3150", {
    transports: ["websocket"], // optional but faster
});

socket.on("connect", () => {
    console.log("Connected to server:", socket.id);
});

export default socket;

