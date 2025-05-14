const mongoose = require('mongoose');

const testCaseSchema = new mongoose.Schema(
    {
        input: {
            type: String,
            required: true,
            trim: true,
            validate: {
                validator: function (v) {
                    return typeof v === 'string' && v.length > 0;
                },
                message: (props) => `${props.value} is not a valid input! It should be a non-empty string.`,
            }
        },
        output: {
            type: String,
            required: true,
            trim: true,
            validate: {
                validator: function (v) {
                    return typeof v === 'string' && v.length > 0;
                },
                message: (props) => `${props.value} is not a valid output! It should be a non-empty string.`,
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
        createdAt: {
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
        updatedAt: {
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
    }, { timestamps: true }
);

const TestCase = mongoose.model('TestCase', testCaseSchema);
module.exports = TestCase;