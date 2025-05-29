const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema(
    {
        code: {
            type: String,
            required: true,
            trim: true,
        },
        language: {
            type: String,
            required: true,
            enum: ["cpp", "java", "python", "javascript"],
            default: "cpp",
        },
        verdict: {
            type: String,
            required: true,
            enum: ["Pending", "Accepted", "Wrong Answer", "Compilation Error", "Runtime Error", "Time Limit Exceeded", "Memory Limit Exceeded"],
            default: "Pending",
        },
        executionTime: {
            type: Number,
            default: 0
        },
        score: {
            type: Number,
            default: 0,
            max: 2500
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
        },
        notes: {
            type: String,
            trim: true,
            maxlength: 500
        },
        failedTestCase: {
            type: Number,
            default: 0
        }
    }, { timestamps: true }
);

submissionSchema.index({ user: 1, problem: 1 });

const Submission = mongoose.model('Submission', submissionSchema);
module.exports = Submission;