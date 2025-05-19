const mongoose = require('mongoose');
const bcrypt = require("bcrypt");
const { createTokenForUser } = require('../utilities/userUtil');

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
                    return /^[a-zA-Z_]{3,}$/.test(v);
                },
                message: (props) => `"${props.value}" is not a valid name! At least 3 alphabets and underscores are allowed. (Spaces are not permitted.)`,
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
                message: (props) => `\"${props.value}\" is not a valid email! Email should be in the format of aB7@gmail.com`,
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
                message: `Password must be 8-20 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character.`,
            }
        },
        role: {
            type: String,
            required: true,
            enum: ["User", "Admin"],
            default: "User",
        },
        dob: {
            type: Date,
            //required: true,
            //default: DateTime.now,
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
            default: ''
        },
        numberOfProblemsSolved: {
            type: Number,
            required: true,
            default: 0,
        },
        problemsCreated: {
            type: [mongoose.Schema.Types.ObjectId],
            required: true,
            default: [],
        },
        submissions: {
            type: [mongoose.Schema.Types.ObjectId],
            required: true,
            default: [],
        },
    }, { timestamps: true }
);

userSchema.pre('save', async function (next){
    const user = this;
    if (!user.isModified("password")) {
        return next();
    }
    try {
        const saltRounds = 12;
        this.password = await bcrypt.hash(this.password, saltRounds);
        next();
    } catch (err) {
        next(err);
    }
});

userSchema.static(
    'matchPasswordAndGenerateToken',
    async function (email, password) {
        const user = await this.findOne({ email });

        if (!user) {
            const error = new Error("User Not Found");
            error.statusCode = 404;
            throw error;
        }

        const isPasswordMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!isPasswordMatch) {
            const error = new Error("Incorrect Password");
            error.statusCode = 401;
            throw error;
        }

        const token = createTokenForUser(user);
        return token;
    }
);

const User = mongoose.model('User', userSchema);
module.exports = User;