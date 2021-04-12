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
  console.log("Connected");
  socket.on("join", ({ name, room }, callback) => {
    const { error, user } = addUser({ id: socket.id, name, room });
    if (error) {
      return callback(error);
    }

    socket.join(user.room);

    socket.emit("message", {
      user: "admin",
      text: `Hey ${user.name}. Welcome to The ${user.room} Room!`,
    });

    socket.broadcast.to(user.room).emit("message", {
      user: "admin",
      text: `${user.name}, has joined!`,
    });

    callback();
  });

  socket.on("sendMessage", (message, callback) => {
    const user = getUser({ id: socket.id });
    // console.log(user);
    io.to(user.room).emit("message", { user: user.name, text: message });
    callback();
  });

  socket.on("disconnect", () => {
    console.log("Disconnected");
  });
});

server.listen(PORT, () => {
  console.log(`Server has started on port ${PORT}`);
});
