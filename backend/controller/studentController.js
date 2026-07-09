const Student = require("../models/Student");

const getStudents = async (req, res) => {
    try {
        const students = await Student.find({ userId: req.user.id });
        res.status(200).json(students);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const addStudent = async (req, res) => {
    try {
        const student = await Student.create({
            ...req.body,
            userId: req.user.id
        });

        res.status(201).json({
            message: "Student Added Successfully",
            student
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const updateStudent = async (req, res) => {
    try {
        const student = await Student.findOneAndUpdate(
            { _id: req.params.id, userId: req.user.id },
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!student) {
            return res.status(404).json({
                message: "Student not found"
            });
        }

        res.status(200).json({
            message: "Student Updated Successfully",
            student
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const deleteStudent = async (req, res) => {
    try {
        const student = await Student.findOneAndDelete({
            _id: req.params.id,
            userId: req.user.id
        });

        if (!student) {
            return res.status(404).json({
                message: "Student not found"
            });
        }

        res.status(200).json({
            message: "Student Deleted Successfully"
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

module.exports = {
    getStudents,
    addStudent,
    updateStudent,
    deleteStudent
};
