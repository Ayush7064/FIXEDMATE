const User = require("../models/User");
const ServiceProvider = require("../models/ServiceProvider");
const jwt = require("jsonwebtoken");

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

// Register (just basic info, add service later)
exports.register = async (req, res) => {
  const { name, email, password, role, phone } = req.body;

  try {
    if (!["user", "provider"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    let existing = await (role === "user"
      ? User.findOne({ email })
      : ServiceProvider.findOne({ email }));

    if (existing) {
      return res.status(400).json({ message: "Email already registered" });
    }

    let newUser;
    if (role === "user") {
      newUser = await User.create({ name, email, password, phone });
    } else if (role === "provider") {
      newUser = await ServiceProvider.create({ name, email, password, phone });
    }

    const token = generateToken(newUser._id, role);

    res.status(201).json({
      message: "Registered successfully",
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};



// Login
exports.login = async (req, res) => {
  const { email, password, role } = req.body;
  console.log(req.body);

  try {
    let existing;
    if (role === "user") {
      existing = await User.findOne({ email });
    } 
    if(role==="provider") {
      existing = await ServiceProvider.findOne({ email });
    }

    if (!existing) return res.status(404).json({ message: "No user found" });

    const isMatch = await existing.matchPassword(password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    const token = generateToken(existing._id, role);

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: existing._id,
        name: existing.name,
        email: existing.email,
        role,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
