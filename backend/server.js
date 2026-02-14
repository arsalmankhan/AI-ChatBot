require("dotenv").config();

const app = require("./src/app");

const { createServer } = require("http");
const { Server } = require("socket.io");

const generateResponse = require("./src/service/ai.service");

const httpServer = createServer(app);

const allowedOrigins = [
  "http://localhost:5173",
  "https://ai-chatbot-ud41.onrender.com",
];

const io = new Server(httpServer, {
  cors: {
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST"],
  },
});

const chatHistory = [];

io.on("connection", (socket) => {
  console.log("✅ Client connected");

  socket.on("disconnect", () => {
    console.log("❌ Client disconnected");
  });

  socket.on("ai-message", async (data) => {
    try {
      chatHistory.push({
        role: "user",
        content: data,
      });

      const response = await generateResponse(chatHistory);
      chatHistory.push({
        role: "assistant",
        content: response,
      });
      socket.emit("ai-message-response", response);
    } catch (error) {
      console.error("🔥 AI Error:", error.message);
      socket.emit("ai-message-response", "Server error occurred");
    }
  });
});

const PORT = process.env.PORT || 3000;

httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
