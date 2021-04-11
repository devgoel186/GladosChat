const express = require("express");
const socketio = require("socket.io");
const http = require("http");
const router = require("./router");
const cors = require("cors");

const app = express();

app.use(cors());

const server = http.createServer(app);
const io = socketio(server, {
  cors: {
    origin: "*",
  },
});

const PORT = process.env.PORT || 5000;

app.use(router);

server.listen(PORT, () => {
  console.log(`Server has started on port ${PORT}`);
});

io.on("connection", (socket) => {
  console.log("New user connected");
  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});
