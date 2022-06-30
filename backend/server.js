const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server, {
  cors: {
    origins: ['http://localhost:4200']
  }
});

app.get('/', (req, res) => {
  res.send('<h1>Hey Socket.io</h1>');
});

io.on('connection', (socket) => {
  const idHandShake = socket.id;
  const { nameRoom } = socket.handshake.query;
  
  socket.join(nameRoom);

  console.log(`Device ${idHandShake} joined room ${nameRoom}`);

  socket.on('disconnect', () => {
    console.log(`Device ${idHandShake} disconnected from ${nameRoom}`);
  });
});

server.listen(5000, () => {
  console.log("Server running on port: 5000");
});