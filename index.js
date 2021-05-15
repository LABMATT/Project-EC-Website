
// Gets socket io running.
const { Socket } = require('socket.io');

// inports sql libray.
var mysql = require('mysql');

// Sets up an express server for for socket io to communicate on.
const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http, {
  cors: {
    origin: '*',
  }
});

// List of active users form spots.
var activeUsers = [];

//Connects to and sql server for data.
var con = mysql.createConnection({
  host: "10.0.0.176",
  user: "merc",
  password: "Astrix10",
  database: "hgc-ech"
});

// Listen on that prot for the users.
http.listen(3000, () => {
  console.log('listening on *:3000');
});

// Connects to an sql database. Throws error otherwise.
con.connect(function(err) {
  if (err) throw err;
  console.log("Connected to sql server!");
});

// On init connection then add the socket id to the array.
io.on('connection', (socket) => {
  console.log('A new user with id of: ' + socket.id);

  activeUsers.push(new userobj(socket.id));

  console.log(activeUsers[0].id);
});

// An object that stores a users info.
var userobj = function(userid) {
  this.id = userid;
  this.username = null;
  this.password = null;
  this.projectdir = null;
}

// When a connection labled login is recived then attempt the login with the server.
io.on('connection', (socket) => {
  socket.on('login', (msg) => {

    console.log("User " + msg[0] + " is attempting connection.");

    var username = msg[0];
    var password = msg[1];

    var sql = "SELECT password FROM users WHERE username='" + username + "';";
    //INSERT INTO `hgc-ech`.`users` (`username`, `password`, `projectdir`, `admin`) VALUES ('penis', 'cock', '', '0');
    //var sql = "SELECT * FROM users;";

    con.query(sql, function (err, result) {
      if (err) throw err;
      console.log("result is");
      console.log(result);

      if(result[0].password == password)
      {
        console.log("true");
      }
      else {
        console.log("false");
      }
    });
  })
});

// This function is desinged to dected sterlize an input before it goes into sql, object or other things.
function sterlizeINput(input)
{
const ill = "/[0-9][a-z]^s/gi";
var countroband = input.exec()
}