require("dotenv").config();
const express = require("express");
const cors = require("cors");

const studentRoutes = require("./route/studentRoutes");
const authRoutes = require("./route/authRoutes");
const connectDB = require("./config/db");
const verifyToken = require("./middleware/authMiddleware");

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);

app.use("/students", verifyToken, studentRoutes);

app.get("/", (req, res) => {
    res.send("Hello Shivam! Backend is Running!");
});

app.listen(5000, () => {
    console.log("Server is running on port 5000");
});