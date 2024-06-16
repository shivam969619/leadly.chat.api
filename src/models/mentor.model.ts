import mongoose, { Document, Schema, Types } from "mongoose";

// Mentor Interface
export interface IMentor extends Document {
    mentorname: string;
    mentoremail: string;
    users: Types.ObjectId[];
    messages: Array<{ username: string; message: string; timestamp: Date }>;
}

// Mentor Schema
const mentorSchema: Schema<IMentor> = new mongoose.Schema({
    mentorname: {
        type: String,
        required: [true, "Please enter the mentor name"],
    },
    mentoremail: {
        type: String,
        required: [true, "Please enter the mentor email"],
        unique: true,
    },
    users: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
    ],
    messages: [
        {
            username: {
                type: String,
                required: true,
            },
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

const Mentor = mongoose.model<IMentor>('Mentor', mentorSchema);
export default Mentor;
