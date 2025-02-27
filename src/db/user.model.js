import mongoose, { Schema } from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username is required'],
        trim: true,
        lowercase: true,
        index: true,
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        trim: true,
        lowercase: true,
    },
    fullname: {
        type: String,
        required: true,
        trim: true,
        index: true
    },
    avatar: {
        type: String,
        required: true,
    },
    coverimage:
    {
        type: String,
    },
    watchhistory: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Video'
        }
    ]
    , refreshtoken: {
        type: String
    }
}, {
    timestamps: true
});
userSchema.pre('save', async function (next) {
    if (this.ismodified('password')) {

        this.password = await bcrypt.hash(this.password, 10);
        next(); 
    } else {
        return next();

    }
})
userSchema.methods.isPasswordCorrect = async function (password) {
    return await becrypt.compare(password, this.password);
}
userSchema.methods.generateAccessToken = function () {
    jwt.sign({
        username: this.username,
        email: this.email,
        fullname: this.fullname,
    }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRY });

}
userSchema.methods.generateRefreshToken = function () {
    jwt.sign({
        username: this.username,
    }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: process.env.REFRESH_TOKEN_EXPIRY });


}

const User = mongoose.model('User', userSchema);