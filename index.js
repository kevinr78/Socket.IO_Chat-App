/* Initializations / Importing modules */
const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const path = require("path");
const {
  formatMessage,
  addUser,
  removeUser,
  getRoomUsers,
} = require("./utils/users");

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "index.html");
});

/* Initialize Socket.io Connection */
io.on("connection", (socket) => {
  socketID = socket.id;

  /* Emit Event When user joins  */
  socket.on("join", (user) => {
    socket.join(user.room);
    socket
      .to(user.room)
      .emit("join", addUser(user.username, user.room, socketID));

    /* Emit update Event to update online users  */
    io.to(user.room).emit("roomUser", getRoomUsers(user.room));
  });

  /* Emit message Event When user sends a message  */
  socket.on("message", (msg) => {
    io.to(msg.room).emit(
      "message",
      formatMessage(msg.message, msg.username, msg.room, socketID)
    );
  });
  /* Emit  diconnect Event When user leaves  */
  socket.on("disconnect", () => {
    const user = removeUser(socket.id);
    if (user) {
      io.to(user.room).emit("leave-chat", user);

      /* Emit update Event to update online users  */
      io.to(user.room).emit("roomUser", getRoomUsers(user.room));
    }
  });
});

let port = process.env.port;
if (port == null || port == "") {
  port = 3000;
}

http.listen(port, () => {
  console.log("Server has Started");
});
