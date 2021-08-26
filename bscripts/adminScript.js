
var connection = new WebSocket("ws://localhost:8080");

// When connection to websocket is astablisehd then send though data.
connection.onopen = function (event) {
    console.log("sent");

    var cid = document.cookie.substr((document.cookie.indexOf("echid=") + 6), document.cookie.length).split(';')[0];
        console.log(cid);

    connection.send("rego:" + cid);
    connection.send("name:");
  };

  // Logout the user.
  function logout()
  {
      document.cookie = "echid=;"; 
      connection.send("logout:bye");
      location.href="index.php";
  }

// When you click on a group it does the fold out with more infomation.
function gconFold(container) {
    console.log("Clicked!");

    var bottom = container.parentElement.querySelector("#gbottom");

    console.log(container.style.display);

     if(bottom.style.display == "flex")
    {
        bottom.style.display = "none";
        container.style.borderBottomLeftRadius = "20px";
        container.style.borderBottomRightRadius = "20px";
    } else
    {
        bottom.style.display = "flex";
        container.style.borderBottomLeftRadius = "0px";
        container.style.borderBottomRightRadius = "0px";
    }
}


// Fill gPannel
function gPannel(data) {

    // [gname, datecreated, password, filelocation, sitelink, ]

    data = ["TestGroup", "2 minutes ago", "slick", "na", "https://www.labmatt.space/"];

    var kinggcon = document.getElementById("kinggcon").querySelector("#gcon");
    var clone = kinggcon.cloneNode(true);
    clone.querySelector("#gtop").querySelector("#gname").innerHTML = data[0] + ": ";
    clone.querySelector("#gbottom").querySelector("#ginfo1").querySelector("#gname").innerHTML = "Name: " + data[0];
    clone.querySelector("#gbottom").querySelector("#ginfo1").querySelector("#gdate").innerHTML = "DateCreated: " + data[1];
    clone.querySelector("#gbottom").querySelector("#ginfo1").querySelector("#gpassword").innerHTML = "Password: " + data[2];
    clone.querySelector("#gbottom").querySelector("#ginfo2").querySelector("#gfiles").innerHTML = "View Files: " + data[3];
    clone.querySelector("#gbottom").querySelector("#ginfo2").querySelector("#gsite").innerHTML = "View Site: <a style='color: white; font-weight: lighter; text-decoration: none;' target='_blank' href='" + data[4] + "'>" + data[4] + "</a>";
    clone.querySelector("#gbottom").querySelector("#ginfo2").querySelector("#glink").innerHTML = "Get Link: " + data[4];

    document.getElementById("groups").appendChild(clone);
    
}
    
    var totalNewGroups = 0;

    // Setup our socket io connection
    function init()
    {
        var cid = document.cookie.substr((document.cookie.indexOf("echid=") + 6), document.cookie.length).split(';')[0];
        console.log(cid);
        socket.emit("rego", cid); // registers the new socketio id to the id we saved in the cookie.
        socket.emit("info", ["name", cid]); // Ask for our name.
        grabTable();
    }

    function grabTable()
    {
        socket.emit("admin", "update");
    }

    function addgroup()
    {
        var table = document.getElementById("table");

    var row = table.insertRow(1);
    var un = row.insertCell(0);
    var pw = row.insertCell(1);
    var dir = row.insertCell(2);
    var pv = row.insertCell(3);
    var ad = row.insertCell(4);
    var del = row.insertCell(5);
    var sel = row.insertCell(6);

    un.innerHTML = "<input type='text' id='" + totalNewGroups + "-nun'>";
    pw.innerHTML = "<input type='text' id='" + totalNewGroups + "-npw'>";
    dir.innerHTML = "Na";
    pv.innerHTML = "Na";
    ad.innerHTML = "<select id='" + totalNewGroups + "-isadmin'><option value='false'>false</option><option value='true'>true</option></select>";
    del.innerHTML = "<button type='button' onclick=''>Delete</button>";
    sel.innerHTML = "";

    totalNewGroups++;
    }

    
    // Check the recived user name
    socket.on('username', function(msg){
    document.getElementById("greet").innerHTML = "Welcome back admin " + msg;
    });


    // get the recived rows and build new table. If table is already built then remove the rows and reubild it.
    socket.on('update', function(msg){
        console.log("updating table");
        console.log(msg);

    var table = document.getElementById("table");
    var ri = table.rows.length; 

    console.log("rob amout is " + ri);

    if(ri > 1)
    {
        for(var i = table.rows.length - 1; i > 0; i--)
        {
        table.deleteRow(i);
        }
    }

    msg.forEach(element => {
    var row = table.insertRow(1);
    var un = row.insertCell(0);
    var pw = row.insertCell(1);
    var dir = row.insertCell(2);
    var pv = row.insertCell(3);
    var ad = row.insertCell(4);
    var del = row.insertCell(5);
    var sel = row.insertCell(6);

    un.innerHTML = element.username;
    pw.innerHTML = element.password;
    dir.innerHTML = element.projectdir;
    pv.innerHTML = "Na";

    if(element.admin == 1)
    {
        ad.innerHTML = "true";
    }else{
        ad.innerHTML = "false";
    }

    del.innerHTML = "<button id='_" + element.username + "' type='button' onclick='delUser(this)'>Delete</button>";
    sel.innerHTML = "<input type='checkbox' id='vehicle1' >";
    
    });
    });

    // Removes a user from the database by passing the username.
    function delUser(usr)
    {
        var delusr = usr.id;
        socket.emit("del", delusr.substr(1, delusr.length));

        var i = usr.parentNode.parentNode.rowIndex;
        document.getElementById("table").deleteRow(i);
    }

    // Adds a user to the database by sending the array of data.
    function addUser()
    {
       // var delusr = usr.id;
       var table = document.getElementById("table");
       
       // Get the rows
       for(var i = 0; i != totalNewGroups; i++)
       {
           var newUsername = document.getElementById(i + "-nun").value;
           var newPassword = document.getElementById(i + "-npw").value;
           var newAdmin = document.getElementById(i + "-isadmin").value;
           console.log("admin is " + newAdmin);

           socket.emit("add", [newUsername, newPassword, newAdmin]); // Username password admin
       }

        
        grabTable();
        totalNewGroups = 0;
    }

    // IF login is invalid then send back to login page.
    socket.on('login', function(msg){
        if(msg == "timeout")
        {
            window.location.href = "index.html";
        }
    });
    

        
