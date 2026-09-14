// import dotenv from "dotenv";
// dotenv.config({ path: [".env.local", ".env"] });

import { createServer } from "node:http";
import net from "node:net";
import next from "next";
import { Server as SocketIOServer } from "socket.io";

function isPortAvailable(port) {
  return new Promise((resolve) => {
    const tester = net
      .createServer()
      .once("error", () => resolve(false))
      .once("listening", () => {
        tester.once("close", () => resolve(true)).close();
      })
      .listen(port, "0.0.0.0");
  });
}

async function getPort(preferred) {
  if (process.env.PORT) {
    return parseInt(process.env.PORT, 10);
  }
  for (let p = preferred; p < preferred + 20; p++) {
    if (await isPortAvailable(p)) {
      return p;
    }
  }
  return preferred;
}

async function start() {
  const preferredPort = 4000;
  const port = await getPort(preferredPort);
  const dev = process.env.NODE_ENV !== "production";
  const hostname = process.env.HOSTNAME || "localhost";

  const app = next({ dev, hostname, port });
  const handle = app.getRequestHandler();

  await app.prepare();

  const httpServer = createServer((req, res) => {
    try {
      handle(req, res);
    } catch (err) {
      console.error("Error handling request:", err);
      res.statusCode = 500;
      res.end("Internal Server Error");
    }
  });

  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  const socketsConnected = new Set();
  const registeredUsers = new Map(); // userId -> { userId, userName, userEmail, userPicture, socketIds: Set, lastSeen }
  const socketToUser = new Map(); // socketId -> userId

  function getOnlineUsersList() {
    return Array.from(registeredUsers.values())
      .filter((u) => u.socketIds && u.socketIds.size > 0)
      .map((u) => ({
        userId: u.userId,
        userName: u.userName,
        userEmail: u.userEmail,
        userPicture: u.userPicture,
        lastSeen: u.lastSeen,
      }));
  }

  io.on("connection", (socket) => {
    socketsConnected.add(socket.id);
    console.log(
      `[Socket] Connected: ${socket.id} (Total: ${socketsConnected.size})`,
    );

    io.emit("clients-total", socketsConnected.size);

    // Register user identity for Solo Chat
    socket.on("register-user", (userData) => {
      if (!userData || !userData.userId) return;

      const { userId, userName, userEmail, userPicture } = userData;
      socket.join(`user:${userId}`);
      socketToUser.set(socket.id, userId);

      let user = registeredUsers.get(userId);
      if (!user) {
        user = {
          userId,
          userName: userName || "anonymous",
          userEmail: userEmail || "",
          userPicture: userPicture || "",
          socketIds: new Set(),
          lastSeen: Date.now(),
        };
        registeredUsers.set(userId, user);
      } else {
        if (userName) user.userName = userName;
        if (userEmail) user.userEmail = userEmail;
        if (userPicture) user.userPicture = userPicture;
        user.lastSeen = Date.now();
      }

      user.socketIds.add(socket.id);

      console.log(
        `[Solo] User registered: ${user.userName} (${userId}) on socket ${socket.id}`,
      );

      // Send online users to all clients
      io.emit("online-users", getOnlineUsersList());
    });

    // Request online users list on demand
    socket.on("get-online-users", () => {
      socket.emit("online-users", getOnlineUsersList());
    });

    socket.on("disconnect", () => {
      socketsConnected.delete(socket.id);
      console.log(
        `[Socket] Disconnected: ${socket.id} (Total: ${socketsConnected.size})`,
      );
      io.emit("clients-total", socketsConnected.size);

      // Clean up registered user socket
      if (socketToUser.has(socket.id)) {
        const userId = socketToUser.get(socket.id);
        socketToUser.delete(socket.id);

        const user = registeredUsers.get(userId);
        if (user) {
          user.socketIds.delete(socket.id);
          user.lastSeen = Date.now();
          if (user.socketIds.size === 0) {
            console.log(`[Solo] User went offline: ${user.userName} (${userId})`);
          }
        }
        io.emit("online-users", getOnlineUsersList());
      }
    });

    // Group chat message
    socket.on("message", (data) => {
      if (!data || !data.message || !data.message.trim()) return;
      socket.broadcast.emit("chat-message", data);
      console.log(
        `[Group Message] From ${data.name || "anonymous"}: ${data.message}`,
      );
    });

    // Group chat feedback (typing)
    socket.on("feedback", (data) => {
      socket.broadcast.emit("feedback", data);
    });

    // Solo 1-on-1 message routing
    socket.on("solo-message", (data) => {
      if (
        !data ||
        !data.fromUserId ||
        !data.toUserId ||
        !data.message ||
        !data.message.trim()
      ) {
        return;
      }

      // Deliver to recipient's private room
      io.to(`user:${data.toUserId}`).emit("solo-message", data);

      // Also deliver to sender's other connected devices/sockets
      socket.to(`user:${data.fromUserId}`).emit("solo-message-sent", data);

      console.log(
        `[Solo Message] ${data.fromName || data.fromUserId} -> ${data.toName || data.toUserId}: ${data.message}`,
      );
    });

    // Solo 1-on-1 typing indicator routing
    socket.on("solo-feedback", (data) => {
      if (!data || !data.toUserId) return;
      io.to(`user:${data.toUserId}`).emit("solo-feedback", data);
    });
  });

  httpServer.listen(port, () => {
    console.log(`\n========================================`);
    console.log(`🚀 Chat App ready on http://${hostname}:${port}`);
    console.log(`   Mode: ${dev ? "development" : "production"}`);
    if (port !== preferredPort) {
      console.log(`   (Port ${preferredPort} was in use, switched to ${port})`);
    }
    console.log(`========================================\n`);
  });
}

start().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
