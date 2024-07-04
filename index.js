const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.set("view engine", "ejs");
app.use('/scripts', express.static(path.join(__dirname, 'public/scripts')));
app.use('/styles', express.static(path.join(__dirname, 'public/styles')));
app.use(express.static(path.join(__dirname, "public")));

io.on("connection", (socket) => {
  console.log(`A user connected: ${socket.id}`);

  socket.on("send-loc", (data) => {
    const { latitude, longitude } = data;
    console.log(`Location from ${socket.id}: ${latitude}, ${longitude}`);

    io.emit("receive-loc", { id: socket.id, latitude, longitude });
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

app.get("/", (req, res) => {
  res.render("index");
});

server.listen(3000, () => {
  console.log("Server is listening on port 3000");
});