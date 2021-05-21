
// Gets socket io running.
const { Socket } = require('socket.io');

// Inport path and file sytem for use in creating, rw user webpages
const fs = require('fs');

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

// The main path where all user projects are stored. MUST END WITH SLASH
const projectsPath = "/home/matthew/Downloads/testprojects/"; // Will be nginx location

// List of active users form spots.
var activeUsers = [];

//Connects to and sql server for data.
var con = mysql.createConnection({
  host: "10.0.0.176",   // localhost
  user: "merc",         //ech
  password: "Astrix10", //esports
  database: "hgc-ech"   //hgc-ech
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


// On init connection print this and there id.
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

var fsdata = function() {
  this.name = null;
  this.last = null;
  this.type = null;
}

// When a connection labled login is recived then attempt the login with the server.
io.on('connection', (socket) => {
  socket.on('login', (msg) => {

    var username = msg[0];
    var password = msg[1];

    var sql = "SELECT password FROM users WHERE username='" + username + "';";
    //INSERT INTO `hgc-ech`.`users` (`username`, `password`, `projectdir`, `admin`) VALUES ('penis', 'cock', '', '0');
    //var sql = "SELECT * FROM users;";

    con.query(sql, function (err, result) {
      if (err)
      {
        console.log(err);
        socket.emit("login", [false, false]);
      } 

      if(result != undefined && result[0] != undefined)
      {
      if(result[0].password == password)
      {

        con.query("SELECT admin FROM users WHERE username='" + username + "';", function (err, result)
        {
          if(err) console.log(err);

          // If a user indeed has matched username and password then check if there admin and update the actives users table acordinling as well as send that info back to the client.
          if(result[0].admin == 1)
          {

            var echid = (new Date()).getTime();
        
            var ob = new userobj(echid);
            ob.sioid = socket.id;
            ob.username = username;
            ob.password = password;
            ob.admin = true;
            activeUsers.push(ob);

            console.log("the echid is: " + echid);

            //INSERT INTO `hgc-ech`.`active` (`echid`, `socketid`, `username`, `checkin`, `admin`) VALUES ('9', '3', 'test', '99', '0');
            con.query("INSERT INTO active (`echid`, `socketid`, `username`, `checkin`, `admin`) VALUES ('" + echid + "', '" + socket.id + "', '" + username + "', '" + echid + "', '1');", function (err, result)
            {
              if(err) console.log(err);

              console.log(result);
            });

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

            //INSERT INTO `hgc-ech`.`active` (`echid`, `socketid`, `username`, `checkin`, `admin`) VALUES ('9', '3', 'test', '99', '0');
            con.query("INSERT INTO active (`echid`, `socketid`, `username`, `checkin`, `admin`) VALUES ('" + echid + "', '" + socket.id + "', '" + username + "', '" + echid + "', '0');", function (err, result)
            {
              if(err) console.log(err);
            });

            socket.emit("id", activeUsers[activeUsers.length - 1].id)
            socket.emit("login", [true, false]);
          }
        });

       
      }
      else {

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



// updates new socket io id with the custom id we set. If no curret active session with that name is here then send a dissconnect message to the id.
io.on('connection', (socket) => {
  socket.on('rego', (msg) => {

    var valid = false;

      activeUsers.forEach(element => {
        if(element.id == msg)
        {
          element.sioid = socket.id;
          valid = true;
        }
      });

      if(valid == false)
      {
        socket.emit("login", "timeout");
      }

      // UPDATE `hgc-ech`.`active` SET `socketid` = '4' WHERE (`echid` = '9');
      con.query("UPDATE active SET `socketid` = '" + socket.id + "' WHERE (`echid` = '"+ msg +"'); ", function (err, result)
      {
       if (err) console.log(err);
      });
  })});



// This function is desinged to dected sterlize an input before it goes into sql, object or other things.
function sterlizeINput(input)
{
const ill = "/[0-9][a-z]^s/gi";
var countroband = input.exec()
}

// Checks for info requests labled name, if found the match the updated socketio id to the username and send the username back.
io.on('connection', (socket) => {
  socket.on('info', (msg) => {

    console.log("recived username request:" + msg);

    // If a username is requested then look for the id that asked in the stored data table then send back the username acoiated with it.
    if(msg[0] == "name")
    {
      console.log("was name");
      activeUsers.forEach(element => {
        console.log("element " + element);
        if(element.id == msg[1])
        {
          console.log("username found and submitted");
          socket.emit("username", element.username);
        }
      });
    }
  })});

  

   // Grab the admin table for an admin to view all users.
io.on('connection', (socket) => {
  socket.on('admin', (msg) => {

    if(msg == "update")
    {

      activeUsers.forEach(element => {
      if(element.sioid == socket.id)
      {
        if(element.admin == true)
        {
          console.log("is admind and sending info");
        con.query("SELECT * FROM users;", function (err, result)
        {
          if(err) console.log(err);
 
          socket.emit("update", result);
        });
      }else{
        socket.emit("login", "timeout");
      }
    } 
    });
    }
  })});

  // Del user, delete there director on the server then also them for them the database.
  io.on('connection', (socket) => {
    socket.on('del', (msg) => {

      var valid = false;

      activeUsers.forEach(element => {
        if(element.sioid == socket.id)
        {

          if(element.admin == 1)
          {

            console.log("about to sql finding dir for user " + msg);

            con.query("SELECT projectdir FROM users WHERE username='" + msg + "';", function (err, result)
            {
              if(err) 
              {
                console.log(err);
              }

              console.log("Result number is:" + result[0].projectdir);

              try {
                fs.rmdirSync(result[0].projectdir, { recursive: true });
            
                console.log(`${result[0].projectdir} is deleted!`);
  
                con.query("DELETE FROM users WHERE username = '" + msg + "';", function (err, result)
                {
                  if(err) console.log(err);
                });
            } catch (err) {
                console.error(`Error while deleting ${result[0].projectdir}.`);
            }  
              
            });
          }else{
            socket.emit("login", "timeout");
          }

        }
      });
    })});


  // INSERT INTO `hgc-ech`.`users` (`username`, `password`, `projectdir`, `admin`) VALUES ('jeff', 'corning', '0', '0');
  // add user to database
  io.on('connection', (socket) => {
    socket.on('add', (msg) => {

      activeUsers.forEach(element => {
        if(element.sioid == socket.id)
        {
          if(element.admin == 1)
          {
            var adminvalue = 0;

            if(msg[2] == "true")
            {
              adminvalue = 1;
            } else 
            {
              adminvalue = 0;
            }

            msg[0] = msg[0].replace(/\s+/g, ''); // REMOVES WHITE SPACES FORM USERNAME
            msg[1] = msg[1].replace(/\s+/g, ''); // REMOVES WHITE SPACES FORM PASSWORD


            var newDir = projectsPath + msg[0] + "/";
            console.log("the dir is: " + newDir);

            fs.mkdir(newDir, function(err) {
              if (err) {
                console.log(err)
              } else {
                console.log("New directory successfully created.")
              }
            })
  
            con.query("INSERT INTO users (`username`, `password`, `projectdir`, `admin`) VALUES ('" + msg[0] + "', '" + msg[1] + "', '" + newDir + "', '" + adminvalue + "');", function (err, result)
            {
              if(err) console.log(err);
            });


          } else{
            socket.emit("login", "timeout");
          }
        }
      });
    })});



//passsing directoryPath and callback function
fs.readdir(projectsPath, function (err, files) {
    //handling error
    if (err) {
        return console.log('Unable to scan directory: ' + err);
    } 
    //listing all files using forEach
    files.forEach(function (file) {
        // Do whatever you want to do with the file
        console.log(file); 
    });
});

   // Serve users qures and send results back to them.
   io.on('connection', (socket) => {
    socket.on('manager', (msg) => {

      var valid = false;
  
        activeUsers.forEach(element => {
        if(element.sioid == socket.id)
        {
          valid = true;

        } if(msg[0] == "mydir") // If they ask for my dir then they want a list of the files in there dir.
        {
          con.query("SELECT projectdir FROM users WHERE username='" + element.username + "';", function (err, result)
          {
            if(err) 
            {
              console.log(err);
            }
            
            var dirInfo = [];

            fs.readdir(result[0].projectdir, function (err, files) {
              //handling error
              if (err) {
                  return console.log('Unable to scan directory: ' + err);
              } 
              //listing all files using forEach
              files.forEach(element=> {
                 
                var ob = new fsdata();
                ob.name = element;
                
                dirInfo.push(ob);
              });

              socket.emit("files", dirInfo);
          });

          });
        }
        });

      if(valid == false)
      {
        socket.emit("login", "timeout");
      }
      
    })});

       // pon logout request then delete from active users table.
   io.on('logout', (socket) => {
    socket.on('logout', (msg) => {
      
      activeUsers.forEach(element => {
        if(element.sioid == socket.id)
        {

        }
      });
    });
  });