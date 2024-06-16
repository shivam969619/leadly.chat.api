import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import connectDB from './db';
import User from './models/user.model';
import Mentor from './models/mentor.model';
import cors from "cors"
import bodyParser from 'body-parser';
const app = express();
app.use(bodyParser.json());
const server = http.createServer(app);
const io = new Server(server);
import chatRouter from './routes/chat.route';
app.use(cors());

const createHardcodedUserAndMentor = async () => {
  try {
      // Create a hardcoded mentor
      const hardcodedMentor = new Mentor({
          mentorname: "John Doe",
          mentoremail: "johndoe@example.com",
          users: [],
          messages: [],
      });

      // Save the hardcoded mentor to the database
      const savedMentor = await hardcodedMentor.save();

      // Create a hardcoded user with the saved mentor
      const hardcodedUser = new User({
          username: "Jane Smith",
          useremail: "janesmith@example.com",
          mentor: savedMentor._id,
          messages: [],
      });

      // Save the hardcoded user to the database
      const savedUser = await hardcodedUser.save();

      // Add the user reference to the mentor's users array

      await savedMentor.save();

      console.log('Hardcoded user and mentor saved successfully');
  } catch (error) {
      console.error('Error saving hardcoded user and mentor:', error);
  }
};

// Call the function to create hardcoded user and mentor when the server starts
// createHardcodedUserAndMentor();

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.use('/api/v1',chatRouter);
app.use('/api/v1',chatRouter);
io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('join room', (phoneNumber: string) => {
    socket.join(phoneNumber);
    console.log(`User with ID: ${socket.id} joined room: ${phoneNumber}`);
  });

  socket.on('chat message', ({ room, message }: { room: string; message: string }) => {
    io.to(room).emit('chat message', message);
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

const PORT = 3000;
connectDB();
server.listen(PORT, () => {
  console.log(`listening on *:${PORT}`);
});
