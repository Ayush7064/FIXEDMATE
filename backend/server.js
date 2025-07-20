const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cors = require("cors");
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
