const mongoose = require('mongoose');

const problemSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            minLength: 3,
            maxLength: 50,
            validate: {
                validator: function (v) {
                    return /^[a-zA-Z\s]+$/.test(v);
                },
                message: (props) => `${props.value} is not a valid name! Only alphabets and spaces are allowed.`,
            }
        },
        difficulty: {
            type: Number,
            required: true,
            min: 800,
            max: 2500,
            validate: {
                validator: function (v) {
                    return Number.isInteger(v) && v >= 800 && v <= 2500;
                },
                message: (props) => `${props.value} is not a valid difficulty! It should be an integer between 800 and 2500.`,
            }
        },
        tags: {
            type: [String],
            required: true, 
            default: [],
            validate: {
                validator: function (v) {
                    return Array.isArray(v) && v.every(tag => typeof tag === 'string');
                },
                message: (props) => `${props.value} is not a valid tags array! Each tag should be a string.`,
            }
        },
        statement: {
            type: String,
            required: true,
            trim: true,
            minLength: 10,
            validate: {
                validator: function (v) {
                    return v.length >= 10;
                },
                message: (props) => `${props.value} is not a valid statement! It should be at least 10 characters long.`,
            }
        },
        testCases: {
            type: mongoose.MongooseSchema.Types.ObjectId,
            required: true,
            default: null,
        },
        solutions: {
            type: [mongoose.MongooseSchema.Types.ObjectId],
            required: true,
            default: [],
            validate: {
                validator: function (v) {
                    return Array.isArray(v) && v.every(solution => mongoose.Types.ObjectId.isValid(solution));
                },
                message: (props) => `${props.value} is not a valid solutions array! Each solution should be a valid ObjectId.`,
            }
        },
        createdBy: {
            type: mongoose.MongooseSchema.Types.ObjectId,
            required: true,
            default: null,
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
        verified: {
            type: Boolean,
            required: true,
            default: false,
            validate: {
                validator: function (v) {
                    return typeof v === 'boolean';
                },
                message: (props) => `${props.value} is not a valid boolean!`,
            }
        },
    }, { timestamps: true }
);

const Problem = mongoose.model('Problem', problemSchema);
module.exports = Problem;