
const express = require("express");
const app = express();
const http = require("http").Server(app);
// const path = require("path");
const { listenerCount } = require("process");
// const socketIO = require("socket.io");
const getPlayers = require("./player").getPlayers;
const PORT = process.env.PORT || 5500;

// const server = http.Server(app);
const io = require('socket.io')(http);

app.set("port", PORT);
// app.use("/static", express.static(path.dirname(__dirname) + "/static"));
app.use(express.static('public'));
app.get("/", (request, response) => {
    request.sendFile(__dirname, "index.html")
});

// server.listen(5000, () => {
//     console.log("Starting server on port 5000");
// });
http.listen(PORT, function () {
    console.log(`listening ON ${PORT}`);
})
let players = null;
io.on("connection", (socket) => {
    players = getPlayers(socket);
});

const gameLoop = (players, io) => {
    io.sockets.emit("state", players);
};

setInterval(() => {
    if (players && io) {
        gameLoop(players, io);
    }
}, 1000 / 60)