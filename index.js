const express = require('express');
var mysql = require('mysql');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

// List of active users form spots.
var activeUsers = [];

//Connects to and sql server for data.
var con = mysql.createConnection({
  host: "10.0.0.176",
  user: "merc",
  password: "Astrix10"
});

// Connects to an sql database. Throws error otherwise.
con.connect(function(err) {
  if (err) throw err;
  console.log("Connected to sql server!");
});

// Host the website using express
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// On init connection then add the socket id to the array.
io.on('connection', (socket) => {
  console.log('A new user with id of: ' + socket.id);

  activeUsers.push(new userobj(socket.id));

  console.log(activeUsers[0].id);
});

// Listen on that prot for the users.
server.listen(3000, () => {
  console.log('listening on *:3000');
});

// An object that stores a users info.
var userobj = function(userid) {
  this.id = userid;
  this.username = null;
  this.password = null;
  this.projectdir = null;
}


// This function is desinged to dected sterlize an input before it goes into sql, object or other things.
function sterlizeINput(input)
{
const ill = "/[0-9][a-z]^s/gi";
var countroband = input.exec()


}