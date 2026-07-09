const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const register = async (req, res) => {
    try {
        const { username, password } = req.body;
        const userExists = await User.findOne({ username });
        if (userExists) {
            return res.status(400).json({ message: "Username already exists" });
        }
        
        await User.create({ username, password });
        res.status(201).json({ message: "User registered successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
        res.status(200).json({ token, username });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = { register, login };
