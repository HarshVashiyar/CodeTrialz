const mongoose = require('mongoose');

const solutioonSchema = new mongoose.Schema(
    {
        code: {
            type: String,
            required: true,
            trim: true,
            validate: {
                validator: function (v) {
                    return typeof v === 'string' && v.length > 0;
                },
                message: (props) => `${props.value} is not a valid code! It should be a non-empty string.`,
            }
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
        submissionTime: {
            type: Date,
            required: true,
            default: Date.now,
            validate: {
                validator: function (v) {
                    return v instanceof Date && !isNaN(v);
                },
                message: (props) => `${props.value} is not a valid date!`,
            }
        },
        verdict: {
            type: String,
            required: true,
            enum: ["Accepted", "Wrong Answer", "Time Limit Exceeded", "Runtime Error", "Compilation Error"],
            default: "Accepted",
            validate: {
                validator: function (v) {
                    return ["Accepted", "Wrong Answer", "Time Limit Exceeded", "Runtime Error", "Compilation Error"].includes(v);
                },
                message: (props) => `${props.value} is not a valid verdict!`,
            }
        },
        problem: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Problem',
            validate: {
                validator: function (v) {
                    return mongoose.Types.ObjectId.isValid(v);
                },
                message: (props) => `${props.value} is not a valid ObjectId!`,
            }
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
            validate: {
                validator: function (v) {
                    return mongoose.Types.ObjectId.isValid(v);
                },
                message: (props) => `${props.value} is not a valid ObjectId!`,
            }
        }
    }, { timestamps: true }
);

const Solution = mongoose.model('Solution', solutioonSchema);
module.exports = Solution;