// server.js
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Serve the static files for the client
app.use(express.static('public'));

// io.on('connection', (socket) => {
//   console.log('A user connected:', socket.id);

//   // Relay signaling messages
//   socket.on('signal', (data) => {
//     console.log('Signal received:', data);
//     // Send signal to the other connected clients
//     socket.broadcast.emit('signal', data);
//   });

//   socket.on('disconnect', () => {
//     console.log('A user disconnected:', socket.id);
//   });
// });



io.on("connection", (socket) => {
  socket.on("sender-join",(data)=>{
    socket.join(data.uid);
  });
  socket.on("receiver-join", (data) => {
    socket.join(data.uid);
    socket.in(data.sender_uid).emit("init", data.uid);
  });
  socket.on("file-meta",(data)=>{
    socket.in(data.uid).emit("fs-meta", data.metadata);
  });
  socket.on("fs-start",(data)=>{
    socket.in(data.uid).emit("fs-share", {});
  });
  socket.on("file-raw",(data)=>{
    socket.in(data.uid).emit("fs-share", data.buffer);
  })
});

server.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
