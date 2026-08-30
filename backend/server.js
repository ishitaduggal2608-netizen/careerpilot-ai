require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();

const PORT = 5000;

// MongoDB connection
const client = new MongoClient(process.env.MONGO_URI);

// Middleware
app.use(cors());
app.use(express.json());


// ===============================
// TEST API
// ===============================

app.get("/api/test", (req, res) => {
  res.json({
    message: "CareerPilot backend is working!"
  });
});


// ===============================
// SIGNUP API
// ===============================

app.post("/api/signup", async (req, res) => {

  const { name, email, password } = req.body;

  try {

    const db = client.db("CareerPilot");
    const usersCollection = db.collection("users");

    // Check if email already exists
    const existingUser = await usersCollection.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "An account with this email already exists."
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = {
      name,
      email,
      password: hashedPassword
    };

    // Save user
    await usersCollection.insertOne(newUser);

    res.status(201).json({
      message: "Signup successful!",
      user: {
        name,
        email
      }
    });

  } catch (error) {

    console.error("Signup error:", error);

    res.status(500).json({
      message: "Something went wrong while creating the account."
    });

  }

});


// ===============================
// LOGIN API
// ===============================

app.post("/api/login", async (req, res) => {

  const { email, password } = req.body;

  try {

    const db = client.db("CareerPilot");
    const usersCollection = db.collection("users");

    // Find user
    const user = await usersCollection.findOne({ email });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password."
      });
    }

    // Compare password with encrypted password
    const passwordMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordMatch) {
      return res.status(401).json({
        message: "Invalid email or password."
      });
    }

    // Create JWT token
    const token = jwt.sign(
      {
        userId: user._id.toString(),
        email: user.email
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d"
      }
    );

    // Send response
    res.json({
      message: "Login successful!",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });

  } catch (error) {

    console.error("Login error:", error);

    res.status(500).json({
      message: "Something went wrong while logging in."
    });

  }

});


// ===============================
// CONNECT TO MONGODB
// ===============================

async function connectDB() {

  try {

    await client.connect();

    console.log("MongoDB connected successfully!");

  } catch (error) {

    console.error(
      "MongoDB connection failed:",
      error
    );

  }

}

connectDB();


// ===============================
// START SERVER
// ===============================

app.listen(PORT, () => {

  console.log(
    `CareerPilot backend running on port ${PORT}`
  );

});