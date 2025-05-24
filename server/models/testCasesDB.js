const mongoose = require('mongoose');

const testCaseSchema = new mongoose.Schema(
    {
        input: {
            type: String,
            required: true,
            default: '',
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
            default: '',
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
            index: true,
        },
        verified: {
            type: Boolean,
            required: true,
            default: false,
        }
    }, { timestamps: true }
);

const TestCase = mongoose.model('TestCase', testCaseSchema);
module.exports = TestCase;