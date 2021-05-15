
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
  if (err) {
    console.log("could not connect to sql server");
    throw err;
  } 
  console.log("Connected to sql server!");
});

// On init connection then add the socket id to the array.
io.on('connection', (socket) => {
  console.log('A new user with id of: ' + socket.id);
});

// An object that stores a users info.
var userobj = function(userid) {
  this.id = userid; // the id we create when the user logs on.
  this.sioid = null; // The last known socketio id
  this.username = null;
  this.password = null;
  this.admin = null;
  this.projectdir = null;
}

// When a connection labled login is recived then attempt the login with the server.
io.on('connection', (socket) => {
  socket.on('login', (msg) => {

    var username = msg[0];
    var password = msg[1];

    console.log("User " + username + " is attempting connection with password " + password) + ".";

    var sql = "SELECT password FROM users WHERE username='" + username + "';";
    //INSERT INTO `hgc-ech`.`users` (`username`, `password`, `projectdir`, `admin`) VALUES ('penis', 'cock', '', '0');
    //var sql = "SELECT * FROM users;";

    con.query(sql, function (err, result) {
      if (err)
      {
        console.log(err);
        socket.emit("login", [false, false]);
      } 
      
      console.log("result is");
      console.log(result);

      if(result != undefined && result[0] != undefined)
      {
      if(result[0].password == password)
      {
        console.log("true");

        con.query("SELECT admin FROM users WHERE username='" + username + "';", function (err, result)
        {
          if(err) console.log(err);

          // If a user indeed has matched username and password then check if there admin and update the actives users table acordinling as well as send that info back to the client.
          if(result[0].admin == 1)
          {
        
            var ob = new userobj((new Date()).getTime());
            ob.sioid = socket.id;
            ob.username = username;
            ob.password = password;
            ob.admin = true;
            activeUsers.push(ob);

            socket.emit("id", activeUsers[activeUsers.length - 1].id)
            socket.emit("login", [true, true]);
          }
          else {
            
            var ob = new userobj((new Date()).getTime());
            ob.sioid = socket.id;
            ob.username = username;
            ob.password = password;
            ob.admin = false;
            activeUsers.push(ob);

            socket.emit("id", activeUsers[activeUsers.length - 1].id)
            socket.emit("login", [true, false]);
          }
        });

       
      }
      else {
        console.log("false");
        socket.emit("login", [false, false]);
      }
    }
    else 
    {
      socket.emit("login", [false, false]);
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

// Checks for info requests labled name, if found the match the updated socketio id to the username and send the username back.
io.on('connection', (socket) => {
  socket.on('info', (msg) => {

    // If a username is requested then look for the id that asked in the stored data table then send back the username acoiated with it.
    if(msg[0] == "name")
    {
      activeUsers.forEach(element => {
        if(element.id == msg[1])
        {
          socket.emit("username", element.username);
        }
      });
    }
  })});

  // updates new socket io id with the custom id we set
io.on('connection', (socket) => {
  socket.on('rego', (msg) => {

      activeUsers.forEach(element => {
        if(element.id == msg)
        {
          element.sioid = socket.id;
        }
      });
  })});

   // Grab the admin table for an admin to view all users.
io.on('connection', (socket) => {
  socket.on('admin', (msg) => {

    if(msg == "update")
    {
      con.query("SELECT * FROM users;", function (err, result)
      {
        if(err) console.log(err);
        console.log(result);
        socket.emit("update", result);
      }
      );
    }
  })});