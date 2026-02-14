import React, { useState, useEffect, useRef } from "react";
import { FiSend } from "react-icons/fi";
import { FaUserCircle } from "react-icons/fa";
import { BsRobot } from "react-icons/bs";
import { io } from "socket.io-client";
import { motion } from "framer-motion";

export default function App() {
  const [messages, setMessages] = useState([
    {
      text: "🔥 Hello! I'm your AI assistant. Ready to chat?",
      sender: "bot",
      time: new Date().toLocaleTimeString(),
    },
  ]);

  const [socket, setSocket] = useState(null);
  const [input, setInput] = useState("");
  const chatEndRef = useRef(null);

  const handleSend = () => {
    if (input.trim() === "") return;

    const newMessage = {
      text: input,
      sender: "user",
      time: new Date().toLocaleTimeString(),
    };

    setMessages((prev) => [...prev, newMessage]);
    socket?.emit("ai-message", input);
    setInput("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSend();
    }
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const socketInstance = io("https://ai-chatbot-k6w9.onrender.com");
    setSocket(socketInstance);

    socketInstance.on("ai-message-response", (response) => {
      const botMessage = {
        text: response,
        sender: "bot",
        time: new Date().toLocaleTimeString(),
      };
      setMessages((prev) => [...prev, botMessage]);
    });

    return () => socketInstance.disconnect();
  }, []);

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-br from-orange-100 via-rose-100 to-amber-100">
      <div className="w-full max-w-md h-screen flex flex-col bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/40">
        <div className="sticky top-0 z-10 bg-gradient-to-r from-orange-600 via-pink-600 to-red-600 text-white text-center py-4 shadow-md">
          <h2 className="text-lg font-bold tracking-wide flex items-center justify-center gap-2">
            <BsRobot className="text-xl" /> Real-Time AI Chatbot
          </h2>
        </div>

        <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-gradient-to-b from-white/60 to-white/30">
          {messages.map((msg, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`flex items-end gap-2 ${
                msg.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {msg.sender === "bot" && (
                <div className="w-9 h-9 flex items-center justify-center text-rose-600 bg-white rounded-full shadow-md border">
                  <BsRobot size={20} />
                </div>
              )}

              <div
                className={`px-4 py-2 rounded-2xl max-w-[70%] text-sm shadow-md ${
                  msg.sender === "user"
                    ? "bg-gradient-to-r from-orange-500 to-pink-600 text-white"
                    : "bg-white/90 text-gray-800 border border-rose-200"
                }`}
              >
                <p>{msg.text}</p>
                <span className="block text-[10px] text-right opacity-70 mt-1">
                  {msg.time}
                </span>
              </div>

              {msg.sender === "user" && (
                <div className="w-9 h-9 flex items-center justify-center text-orange-600 bg-white rounded-full shadow-md border">
                  <FaUserCircle size={22} />
                </div>
              )}
            </motion.div>
          ))}
          <div ref={chatEndRef} />
        </div>

        <div className="sticky bottom-0 z-10 flex items-center border-t bg-white/80 p-3 backdrop-blur-md">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Type your message..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-rose-400 shadow-sm bg-white/90"
          />
          <button
            onClick={handleSend}
            className="ml-2 bg-gradient-to-r from-orange-500 via-pink-600 to-red-600 hover:opacity-90 text-white p-3 rounded-full shadow-lg transition-transform transform hover:scale-110"
          >
            <FiSend size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
