const mongoose = require("mongoose");
const dotenv = require("dotenv");
const ServiceProvider = require("./models/ServiceProvider"); // Adjust the path if needed

dotenv.config();

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("Connection error:", err));

const dummyProviders = [
  {
    name: "Ram Electrician",
    email: "ram@fixmate.com",
    password: "12345678",
    phone: "9876543210",
    serviceType: "electrician",
    location: { type: "Point", coordinates: [75.8577, 22.7196] },
    servicePic: "https://images.pexels.com/photos/4254160/pexels-photo-4254160.jpeg?auto=compress&cs=tinysrgb&w=800"
  },
  {
    name: "Shyam Plumber",
    email: "shyam@fixmate.com",
    password: "12345678",
    phone: "8765432109",
    serviceType: "plumber",
    location: { type: "Point", coordinates: [75.8600, 22.7200] },
    servicePic: "https://images.pexels.com/photos/6169051/pexels-photo-6169051.jpeg?auto=compress&cs=tinysrgb&w=800"
  },
  {
    name: "Geeta Carpenter",
    email: "geeta@fixmate.com",
    password: "12345678",
    phone: "7654321098",
    serviceType: "carpenter",
    location: { type: "Point", coordinates: [75.8590, 22.7210] },
    servicePic: "https://images.pexels.com/photos/9898155/pexels-photo-9898155.jpeg?auto=compress&cs=tinysrgb&w=800"
  },
  {
    name: "Lakshmi AC Technician",
    email: "lakshmi@fixmate.com",
    password: "12345678",
    phone: "9123456780",
    serviceType: "ac technician",
    location: { type: "Point", coordinates: [75.8580, 22.7185] },
    servicePic: "https://images.pexels.com/photos/6474475/pexels-photo-6474475.jpeg?auto=compress&cs=tinysrgb&w=800"
  },
  {
    name: "Raju Painter",
    email: "raju@fixmate.com",
    password: "12345678",
    phone: "8123456789",
    serviceType: "painter",
    location: { type: "Point", coordinates: [75.8610, 22.7170] },
    servicePic: "https://images.pexels.com/photos/5691534/pexels-photo-5691534.jpeg?auto=compress&cs=tinysrgb&w=800"
  },
  {
    name: "Sita Cleaner",
    email: "sita@fixmate.com",
    password: "12345678",
    phone: "9988776655",
    serviceType: "cleaner",
    location: { type: "Point", coordinates: [75.8620, 22.7225] },
    servicePic: "https://images.pexels.com/photos/6195118/pexels-photo-6195118.jpeg?auto=compress&cs=tinysrgb&w=800"
  },
  {
    name: "Mohit Pest Control",
    email: "mohit@fixmate.com",
    password: "12345678",
    phone: "8899776655",
    serviceType: "pest control",
    location: { type: "Point", coordinates: [75.8560, 22.7230] },
    servicePic: "https://images.pexels.com/photos/7464255/pexels-photo-7464255.jpeg?auto=compress&cs=tinysrgb&w=800"
  },
  {
    name: "Karan Appliance Repair",
    email: "karan@fixmate.com",
    password: "12345678",
    phone: "7788990011",
    serviceType: "appliance repair",
    location: { type: "Point", coordinates: [75.8530, 22.7190] },
    servicePic: "https://images.pexels.com/photos/5409720/pexels-photo-5409720.jpeg?auto=compress&cs=tinysrgb&w=800"
  },
  {
    name: "Amit Driver",
    email: "amit@fixmate.com",
    password: "12345678",
    phone: "9012345678",
    serviceType: "driver",
    location: { type: "Point", coordinates: [75.8540, 22.7205] },
    servicePic: "https://images.pexels.com/photos/6182070/pexels-photo-6182070.jpeg?auto=compress&cs=tinysrgb&w=800"
  },
  {
    name: "Neha Mechanic",
    email: "neha@fixmate.com",
    password: "12345678",
    phone: "9111222333",
    serviceType: "mechanic",
    location: { type: "Point", coordinates: [75.8520, 22.7180] },
    servicePic: "https://images.pexels.com/photos/10074126/pexels-photo-10074126.jpeg?auto=compress&cs=tinysrgb&w=800"
  },
  {
    name: "Ritika Technician",
    email: "ritika@fixmate.com",
    password: "12345678",
    phone: "9876123450",
    serviceType: "technician",
    location: { type: "Point", coordinates: [75.8510, 22.7215] },
    servicePic: "https://images.pexels.com/photos/8486161/pexels-photo-8486161.jpeg?auto=compress&cs=tinysrgb&w=800"
  },
  {
    name: "Deepak Handyman",
    email: "deepak@fixmate.com",
    password: "12345678",
    phone: "9234567890",
    serviceType: "other",
    location: { type: "Point", coordinates: [75.8500, 22.7200] },
    servicePic: "https://images.pexels.com/photos/5591462/pexels-photo-5591462.jpeg?auto=compress&cs=tinysrgb&w=800"
  }
];


const seed = async () => {
  try {
    await ServiceProvider.deleteMany({});
    const res=await ServiceProvider.insertMany(dummyProviders);
    console.log(res);
    console.log("✅ Dummy providers inserted");
    process.exit();
  } catch (error) {
    console.error("❌ Error seeding providers:", error.message);
    process.exit(1);
  }
};

seed();
