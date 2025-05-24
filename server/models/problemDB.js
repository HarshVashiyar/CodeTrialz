const mongoose = require('mongoose');

const problemSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            minLength: [3, "Problem name should be at least 3 characters long."],
            maxLength: [20, "Problem name should be at most 20 characters long."],
            validate: {
                validator: function (v) {
                    return /^[a-zA-Z\s0-9]+$/.test(v);
                },
                message: "Only alphabets, spaces and numbers are allowed in the problem name.",
            }
        },
        difficulty: {
            type: Number,
            required: true,
        },
        tags: {
            type: [String],
            required: true, 
            default: []
        },
        statement: {
            type: String,
            required: true,
            trim: true,
            minlength: [10, "Statement should be at least 10 characters long."],
        },
        inputFormat: {
            type: String,
            required: true,
            trim: true,
        },
        outputFormat: {
            type: String,
            required: true,
            trim: true,
        },
        testCases: [{ type: mongoose.Schema.Types.ObjectId, ref: 'TestCase' }],
        solutions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Solution' }],
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            default: null,
        },
        verified: {
            type: Boolean,
            required: true,
            default: false,
        },
    }, { timestamps: true }
);

const Problem = mongoose.model('Problem', problemSchema);
module.exports = Problem;