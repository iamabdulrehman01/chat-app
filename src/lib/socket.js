import { io } from "socket.io-client";

let socket = null;

export const getSocket = () => {
  if (typeof window === "undefined") {
    return null;
  }

  if (!socket) {
    const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || undefined;
    socket = io(socketUrl, {
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      transports: ["websocket", "polling"],
    });
  }

  return socket;
};
