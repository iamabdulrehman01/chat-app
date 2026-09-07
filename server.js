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

  io.on("connection", (socket) => {
    socketsConnected.add(socket.id);
    console.log(
      `[Socket] Connected: ${socket.id} (Total: ${socketsConnected.size})`,
    );

    io.emit("clients-total", socketsConnected.size);

    socket.on("disconnect", () => {
      socketsConnected.delete(socket.id);
      console.log(
        `[Socket] Disconnected: ${socket.id} (Total: ${socketsConnected.size})`,
      );
      io.emit("clients-total", socketsConnected.size);
    });

    socket.on("message", (data) => {
      if (!data || !data.message || !data.message.trim()) return;
      socket.broadcast.emit("chat-message", data);
      console.log(
        `[Socket] Message from ${data.name || "anonymous"}: ${data.message}`,
      );
    });

    socket.on("feedback", (data) => {
      socket.broadcast.emit("feedback", data);
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
