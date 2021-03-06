const express = require("express");
const socketio = require("socket.io");
const http = require("http");
const cors = require("cors");

const router = require("./router");
const { addUser, getUser, removeUser, getUsersInRoom } = require("./users");

const app = express();
const server = http.createServer(app);
const io = socketio(server, {
  cors: {
    origin: "*",
  },
});

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(router);

io.on("connection", (socket) => {
  console.log("Connected", socket.id);
  socket.on("join", ({ name, room }, callback) => {
    const { error, user } = addUser({ id: socket.id, name, room });
    if (error) {
      return callback(error);
    }

    socket.join(user.room);

    socket.emit("loaded");

    socket.emit("message", {
      user: "admin",
      text: `Hey ${user.name}. Welcome to The ${user.room} Room!`,
    });

    socket.broadcast.to(user.room).emit("message", {
      user: "admin",
      text: `${user.name}, has joined!`,
    });

    io.to(user.room).emit("roomData", {
      room: user.room,
      users: getUsersInRoom(user.room),
    });

    callback();
  });

  socket.on("sendMessage", (message, callback) => {
    const user = getUser({ id: socket.id });
    io.to(user.room).emit("message", { user: user.name, text: message });
    io.to(user.room).emit("roomData", {
      user: user.name,
      users: getUsersInRoom(user.room),
    });
    callback();
  });

  socket.on("typing", () => {
    const user = getUser({ id: socket.id });
    socket.broadcast.to(user.room).emit("typing", user);
  });

  socket.on("disconnect", () => {
    const user = removeUser({ id: socket.id });

    if (user) {
      io.to(user.room).emit("message", {
        user: "admin",
        text: `${user.name} has left :(`,
      });
    }

    console.log("Disconnected", socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`Server has started on port ${PORT}`);
});
