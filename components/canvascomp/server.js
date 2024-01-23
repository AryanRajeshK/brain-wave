const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

io.on('connection', (socket) => {
  console.log('A user connected');

  // Handle drawing events
  socket.on('draw', (data) => {
    socket.broadcast.emit('draw', data);
  });

  // Handle clear canvas event
  socket.on('clearCanvas', () => {
    socket.broadcast.emit('clearCanvas');
  });

  // Handle disconnect event
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
