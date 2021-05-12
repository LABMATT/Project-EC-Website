const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

var activeUsers = [];

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
  console.log('A new user with id of: ' + socket.id);

  activeUsers.push(new userobj(socket.id));

  console.log(activeUsers[0].id);
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});

var userobj = function(userid) {
  this.id = userid;
  this.username = null;
  this.password = null;
  this.projectdir = null;
}