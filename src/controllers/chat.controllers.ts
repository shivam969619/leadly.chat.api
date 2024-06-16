// controllers/joinroom.ts

import { Request, Response } from 'express';
import { Server as SocketIOServer } from 'socket.io';
import User from '../models/user.model';
import Mentor, { IMentor } from '../models/mentor.model';

export const joinroom = async (req: Request, res: Response, io: SocketIOServer) => {
    try {
        const { useremail } = req.body;

        // Find the user by their email and populate the mentor field
        const user = await User.findOne({ useremail }).populate('mentor');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if the user has a mentor assigned
        if (!user.mentor) {
            return res.status(404).json({ message: 'Mentor not assigned to this user' });
        }

        // Extract mentor details
        const mentor = user.mentor as IMentor; // Cast user.mentor to IMentor interface
        const { mentorname, mentoremail } = mentor; // Destructure mentor details

        // Emit 'join room' event to the specific user's room
        io.emit('join room', { useremail, mentorname, mentoremail });

        // Respond with mentor details
        res.status(200).json({ message: `A user with ${useremail} joined with mentor ${mentoremail}` });
        
    } catch (error) {
        console.error('Error in joinroom:', error);
        res.status(500).json({ message: 'Server error', error });
    }
};

export const sendmessages = async (req: Request, res: Response, io: SocketIOServer) => {
    try {
        const { message, useremail } = req.body;

        // Find the user by their email and populate the mentor field
        let user = await User.findOne({ useremail }).populate('mentor');

        // If user does not exist, create a new user
        if (!user) {
            // Create new user
            user = await User.create({ useremail });

            // Log the creation if needed
            console.log(`New user created with email: ${useremail}`);
        }

        // Check if the user has a mentor assigned
        if (!user.mentor) {
            return res.status(404).json({ message: 'Mentor not assigned to this user' });
        }

        // Retrieve mentor ID from user object
        const mentorId = user.mentor;

        // Find the mentor by ID
        const mentor = await Mentor.findById(mentorId);

        if (!mentor) {
            return res.status(404).json({ message: 'Mentor not found' });
        }

        // Emit message event to the mentor's room
        io.to(useremail).emit('chat message', message); // Adjust the room identifier as per your application logic

        // Save message to mentor's messages array
        // mentor.messages.push({ useremail, message });
        await mentor.save();

        res.status(200).json({ message: 'Message sent successfully' });
    } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).json({ message: 'Server error', error });
    }
};
