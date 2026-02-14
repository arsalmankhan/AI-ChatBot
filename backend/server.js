require("dotenv").config();

const app = require("./src/app");

const { createServer } = require("http");
const { Server } = require("socket.io");

const generateResponse = require("./src/service/ai.service");

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "https://ai-chatbot-k6w9.onrender.com",
  },
});

const chatHistory = [];

io.on("connection", (socket) => {
  console.log("Connection establish successfull");

  socket.on("disconnect", () => {
    console.log("A user is disconnected");
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
      console.error(error);
      socket.emit("ai-message-response", "AI error");
    }
  });
});

httpServer.listen(3000, () => {
  console.log("Server is running on port 3000:");
});
