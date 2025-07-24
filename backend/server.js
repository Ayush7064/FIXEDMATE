const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cors = require("cors");
const http = require('http'); // 1. Import the http module
const { Server } = require("socket.io");

const authRoutes = require("./routes/authRoutes");
const providerRoutes = require("./routes/providerRoutes");
const userRoutes = require("./routes/userRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const notificationRoutes = require("./routes/notificationRoutes");

const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const swaggerDocument = YAML.load("./docs/API.yaml");


const cloudinary = require('cloudinary').v2; // Make sure cloudinary is imported    0
// Load environment variables
dotenv.config();

// =======================================================
// ✅ ADD THIS CLOUDINARY CONFIGURATION
// =======================================================
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


dotenv.config();
connectDB();

const app = express();

app.use(express.json());


app.use(cors({
  origin: '*', // Allows all origins
  methods: ['GET', 'POST', 'PUT', 'DELETE' ,'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));



const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // In production, you should restrict this to your frontend URL
    methods: ["GET", "POST"]
  }
});

// --- 4. Logic for Managing Connected Users ---
let onlineUsers = new Map(); // Use a Map to store userId -> socketId
const addUser = (userId, socketId) => {
  !onlineUsers.has(userId) && onlineUsers.set(userId, socketId);
};

const removeUser = (socketId) => {
  for (let [key, value] of onlineUsers.entries()) {
    if (value === socketId) {
      onlineUsers.delete(key);
      break;
    }
  }
}

const getUserSocket = (userId) => {
  return onlineUsers.get(userId);
};

// --- 5. Socket.IO Connection Logic ---
io.on("connection", (socket) => {
  console.log(`🔌 A user connected: ${socket.id}`);

  // Listen for a user connecting with their userId
  socket.on("addUser", (userId) => {
    addUser(userId, socket.id);
    console.log("Online users:", Array.from(onlineUsers.keys()));
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    removeUser(socket.id);
    console.log(`🔌 A user disconnected: ${socket.id}`);
    console.log("Online users:", Array.from(onlineUsers.keys()));
  });
});

// --- 6. Make Socket.IO and user map accessible to your routes ---
// This middleware attaches `io` and `getUserSocket` to every request object
app.use((req, res, next) => {
  req.io = io;
  req.getUserSocket = getUserSocket;
  next();
});

app.use("/api/auth", authRoutes);

app.use("/api/provider", providerRoutes);

app.use("/api/user", userRoutes);


app.use("/api/bookings", bookingRoutes);

app.use("/api/reviews", reviewRoutes);


app.use("/api/dashboard", dashboardRoutes);

app.use("/api/notifications", notificationRoutes);



app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));


app.get("/", (req, res) => {
  res.send("FixMate API Running 🚀");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Swagger running on port ${PORT}/api-docs`);
});
