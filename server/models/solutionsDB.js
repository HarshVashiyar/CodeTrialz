const mongoose = require('mongoose');

const solutionSchema = new mongoose.Schema(
    {
        code: {
            type: String,
            required: true,
            trim: true,
        },
        language: {
            type: String,
            required: true,
            enum: ["C", "C++", "Java", "Python", "JavaScript", "Go", "Ruby", "PHP"],
            default: "C",
            validate: {
                validator: function (v) {
                    return ["C", "C++", "Java", "Python", "JavaScript", "Go", "Ruby", "PHP"].includes(v);
                },
                message: (props) => `${props.value} is not a valid language!`,
            }
        },
        verdict: {
            type: String,
            required: true,
            enum: ["Checking", "Accepted", "Wrong Answer", "Time Limit Exceeded", "Runtime Error", "Compilation Error", "Memory Limit Exceeded"],
            default: "Checking",
            validate: {
                validator: function (v) {
                    return ["Checking", "Accepted", "Wrong Answer", "Time Limit Exceeded", "Runtime Error", "Compilation Error", "Memory Limit Exceeded"].includes(v);
                },
                message: (props) => `${props.value} is not a valid verdict!`,
            }
        },
        problem: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Problem',
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        }
    }, { timestamps: true }
);

const Solution = mongoose.model('Solution', solutionSchema);
module.exports = Solution;