require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const studentRoutes = require("./route/studentRoutes");
const authRoutes = require("./route/authRoutes");
const connectDB = require("./config/db");
const verifyToken = require("./middleware/authMiddleware");

const app = express();

connectDB();

app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:4200",
    credentials: true
}));
app.use(cookieParser());
app.use(express.json());

app.use("/auth", authRoutes);

app.use("/students", verifyToken, studentRoutes);

app.get("/", (req, res) => {
    res.send("Hello Shivam! Backend is Running!");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});