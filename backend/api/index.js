const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const { configureCloudinary } = require("./config/cloudinary");

// Connect to MongoDB
connectDB();

// Configure Cloudinary
configureCloudinary();

const app = express();

const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(",").map((o) => o.trim())
  : ["http://localhost:3000"];

app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", require("./routes/auth"));
app.use("/api/posts", require("./routes/posts"));

app.get("/", (req, res) => {
  res.json({ message: "Mini Social API is running" });
});

module.exports = app;
