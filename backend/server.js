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

let points = {};
let users = {};

class User {
  constructor(id, username) {
    this.id = id;
    this.username = username;
  }
}

io.on('connection', (socket) => {
  const socketId = socket.id;
  const { roomName } = socket.handshake.query;

  if (!points[roomName])
    points[roomName] = {};

  console.log(`Device ${socketId} joined room ${roomName}`);

  socket.join(roomName);
  users[socketId] = new User(socketId, "Anonymous" + socketId);

  socket.emit('room-data', {
    id: socketId,
    points: points[roomName],
    users: users
  });

  socket.on('disconnect', () => {
    console.log(`Device ${socketId} disconnected from ${roomName}`);

    const user = users[socketId];
    delete users[socketId];

    socket.broadcast.to(roomName).emit('user-disconnected', user);
  });

  socket.on('new-point', (point) => {
    // if (!points[roomName])
    //   points[roomName] = {};

    if (!points[roomName][socketId])
      points[roomName][socketId] = [];

    points[roomName][socketId].push(point);

    socket.broadcast.to(roomName).emit('new-point', {
      senderId: socketId,
      point: point
    });
  });

  socket.on('clear-canvas', () => {
    points[roomName] = {};

    socket.broadcast.to(roomName).emit('clear-canvas', {});
  });
});

server.listen(5000, () => {
  console.log("Server running on port: 5000");
});