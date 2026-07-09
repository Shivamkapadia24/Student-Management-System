const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    course: {
        type: String,
        required: true
    },
    rollNumber: {
        type: Number,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
}, {
    timestamps: true
});

const Student = mongoose.model("Student", studentSchema);

module.exports = Student;
