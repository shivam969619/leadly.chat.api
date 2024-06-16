import mongoose, { Document, Schema, Types } from "mongoose";
import { IMentor } from "./mentor.model";

export interface IUser extends Document {
    username: string;
    useremail: string;
    mentor: Types.ObjectId | IMentor;  // Allow both ObjectId and IMentor types
    messages: Array<{ message: string; timestamp: Date }>;
}

// User Schema
const userSchema: Schema<IUser> = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Please enter your name"],
    },
    useremail: {
        type: String,
        required: [true, "Please enter your email"],
        unique: true,
    },
    mentor: {
        type: Schema.Types.ObjectId,
        ref: 'Mentor',
        required: true,
    },
    messages: [
        {
            message: {
                type: String,
                required: true,
            },
            timestamp: {
                type: Date,
                default: Date.now,
            },
        },
    ],
});

const User = mongoose.model<IUser>('User', userSchema);
export default User;
