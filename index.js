
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

io.on('connection', (socket) => {
socket.on('disconnect', function () {

  console.log("user has dissconnected");

  con.query("SELECT echid FROM active WHERE socketid='" + socket.id + "';", function (err, result)
        {
          if(err) 
          {
            console.log(err);
          } else {

            console.log("the users echid was :" + result);

            if(result[0] != undefined)
            {
              console.log("Setting timeout");
              setTimeout(timeout, 5000, [result[0].echid, socket.id]);
            }
          }
        });
});
});

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

            console.log("the echid is: " + echid);

            //INSERT INTO `hgc-ech`.`active` (`echid`, `socketid`, `username`, `checkin`, `admin`) VALUES ('9', '3', 'test', '99', '0');
            con.query("INSERT INTO active (`echid`, `socketid`, `username`, `checkin`, `admin`) VALUES ('" + echid + "', '" + socket.id + "', '" + username + "', '" + echid + "', '1');", function (err, result)
            {
              if(err) console.log(err);

              console.log(result);
            });

            socket.emit("id", echid)
            socket.emit("login", [true, true]);
          }
          else {
            
            var echid = (new Date()).getTime();

            //INSERT INTO `hgc-ech`.`active` (`echid`, `socketid`, `username`, `checkin`, `admin`) VALUES ('9', '3', 'test', '99', '0');
            con.query("INSERT INTO active (`echid`, `socketid`, `username`, `checkin`, `admin`) VALUES ('" + echid + "', '" + socket.id + "', '" + username + "', '" + echid + "', '0');", function (err, result)
            {
              if(err) console.log(err);
            });

            socket.emit("id", echid)
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

      // UPDATE `hgc-ech`.`active` SET `socketid` = '4' WHERE (`echid` = '9');
      con.query("UPDATE active SET socketid='" + socket.id + "' WHERE echid= '"+ msg +"';", function (err, result)
      {

       if (err) 
       {

         console.log(err);
         socket.emit("login", "timeout");
       } else {

       console.log("updating rego");
       console.log(result);
       }

       
      });
  });
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

    console.log("recived username request:" + msg);

    // If a username is requested then look for the id that asked in the stored data table then send back the username acoiated with it.
    if(msg[0] == "name")
    {

    // get username from active database;
    con.query("SELECT username FROM active WHERE socketid='" + socket.id + "';", function (err, result)
    {
     if (err) 
     {

       console.log(err);
       socket.emit("login", "timeout");
     } else{
      console.log("the username should be ");
      console.log(result);
      socket.emit("username", result[0].username);
     }
    });
    }

    
 });
 });

  

   // Grab the admin table for an admin to view all users.
  io.on('connection', (socket) => {
  socket.on('admin', (msg) => {

    if(msg == "update")
    {

    // get username from active database;
    con.query("SELECT admin FROM active WHERE socketid= '" + socket.id + "';", function (err, result)
    {
     if (err) 
     {

       console.log(err);
       socket.emit("login", "timeout");
     } else{
      
      if(result[0].admin == 1)
      {

        con.query("SELECT * FROM users;", function (err, result)
        {

          if(err)
          {
            
            console.log(err);
            socket.emit("login", "timeout");
          } else {

            socket.emit("update", result);
          }
        });
      }
    }
  });
}
});
});


       // Delete user from useres database from admin.
io.on('connection', (socket) => {
  socket.on('del', (msg) => {

    // get username from active database;
    con.query("SELECT admin FROM active WHERE socketid='" + socket.id + "';", function (err, result)
    {
     if (err) 
     {

       console.log(err);
       socket.emit("login", "timeout");
     } else{
      
      if(result[0].admin == 1)
      {

        console.log("about to sql finding dir for user " + msg);

        con.query("SELECT projectdir FROM users WHERE username='" + msg + "';", function (err, result)
        {

          if(err) 
          {
            console.log(err);
            socket.emit("login", "timeout");
          } 
          else {

          console.log("Result number is:" + result[0].projectdir);

          try {
            fs.rmdirSync(result[0].projectdir, { recursive: true });
        
            console.log(`${result[0].projectdir} is deleted!`);

        } catch (err) {
            console.error(`Error while deleting ${result[0].projectdir}.`);
        }  

        con.query("DELETE FROM users WHERE username='" + msg + "';", function (err, result)
        {
          if(err) console.log(err);
        });
      }
        });
      }
    }
  });

});
});


   // Add user to the users database.
   io.on('connection', (socket) => {
    socket.on('add', (msg) => {
  
      // get username from active database;
      con.query("SELECT admin FROM active WHERE socketid= '" + socket.id + "';", function (err, result)
      {
       if(err) 
       {
  
         console.log(err);
         socket.emit("login", "timeout");
       } else{
        
        if(result[0].admin == 1)
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

                con.query("INSERT INTO users (`username`, `password`, `projectdir`, `admin`) VALUES ('" + msg[0] + "', '" + msg[1] + "', '" + newDir + "', '" + adminvalue + "');", function (err, result)
              {
              if(err) console.log(err);
              });
              }
            })
        }
      }
    });
  
  });
  });



     // Serve users qures and send results back to them.
     io.on('connection', (socket) => {
      socket.on('manager', (msg) => {

        if(msg[0] == "mydir") // If they ask for my dir then they want a list of the files in there dir.
        {
          con.query("SELECT username FROM active WHERE socketid= '" + socket.id + "';", function (err, usrnm)
      {
       if(err) 
       {
  
         console.log(err);
         socket.emit("login", "timeout");
       } else{

        con.query("SELECT projectdir FROM users WHERE username='" + usrnm[0].username + "';", function (err, result)
          {
            if(err) 
            {
              console.log(err);
            } else{

              var dirInfo = [];

            fs.readdir(result[0].projectdir, function (err, files) {
              //handling error
              if (err) {
                  return console.log('Unable to scan directory: ' + err);
              } 

              socket.emit("files", files);
            });
            }
          });
       }
      }); 
        }
    });
    });
    

    io.on('connection', (socket) => {
      socket.on('logout', (msg) => {

        console.log("loging user out");

        con.query("DELETE FROM active WHERE socketid='" + socket.id + "';", function (err, result)
        {
          if(err) console.log(err);
        });
      });
    });


    function timeout(input)
    {
      id = input[0];
      socketid = input[1];

      console.log("Checking info using: " + id + " " + socketid);

      con.query("SELECT socketid FROM active WHERE echid='" + id + "';", function (err, result)
      {
        if(err) 
        {
          console.log(err); 
        } else {

          console.log("The current socket id after time is: ");
          console.log(result);

          if(result[0] != undefined) {
          if(result[0].socketid == socketid)
          {
            console.log("Is not equal so remving from table");
            con.query("DELETE FROM active WHERE echid='" + id + "';", function (err, result)
            {
              if(err) 
              {
                console.log(err);
              } else {
    
                console.log("User with echid <" + id + "> was removed from the active users table.")
              }
            });
          }
        }
        }
      });
    }