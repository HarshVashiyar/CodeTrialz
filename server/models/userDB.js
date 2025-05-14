const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        fullName: {
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
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            validate: {
                validator: function(v) {
                    return /^[a-zA-z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(v);
                },
                message: (props) => `${props.value} is not a valid email! It should be in the format of aB7@gmail.com`,
            }
        },
        password: {
            type: String,
            required: true,
            trim: true,
            minLength: 8,
            maxLength: 20,
            validate: {
                validator: function(v) {
                    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/.test(v);
                },
                message: (props) => `${props.value} is not a valid password! Password must be 8-20 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character.`,
            }
        },
        role: {
            type: String,
            required: true,
            enum: ["User", "Admin"],
            default: "User",
        },
        salt: {
            type: String,
            required: false,
            trim: true,
            validate: {
                validator: function(v) {
                    return /^[a-f0-9]{32}$/.test(v);
                },
                message: (props) => `${props.value} is not a valid salt!`,
            }
        },
        dob: {
            type: DateTime,
            required: true,
            default: DateTime.now,
            validate: {
                validator: function(v) {
                    return v instanceof Date && !isNaN(v);
                },
                message: (props) => `${props.value} is not a valid date!`,
            }
        },
        pathToProfilePhoto: {
            type: String,
            required: false,
            trim: true,
            // validate: {
            //     validator: function(v) {
            //         return /^https?:\/\/.*\.(jpg|jpeg|png|gif)$/.test(v);
            //     },
            //     message: (props) => `${props.value} is not a valid URL! It should point to an image file.`,
            // }
            default: null
        },
        numberOfProblemsSolved: {
            type: Number,
            required: true,
            default: 0,
        },
        problemsCreated: {
            type: [mongoose.MongooseSchema.Types.ObjectId],
            required: true,
            default: [],
        },
        submissions: {
            type: [mongoose.MongooseSchema.Types.ObjectId],
            required: true,
            default: [],
        },
    }, { timestamps: true }
);

const User = mongoose.model('User', userSchema);
module.exports = User;