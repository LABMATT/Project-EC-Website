document.addEventListener('keydown', checkKey);

function checkKey(e)
{

  console.log("key down is:" + e.code);
  var keycode = e.code;

  if(keycode == "Enter")
  {
    var focus = document.activeElement.id;
    if(focus == "uname")
    {

      document.getElementById("psw").focus();
    } else if(focus == "psw")
    {
      
      login();
    }
  }
}

// Commits to longin and loads correct page.
socket.on('login', function(msg){
if(msg[0] == true)
{
  document.getElementById("er").style.color = "BLACK";
  document.getElementById("er").innerHTML = "Loging you in!";
  if(msg[1] == true)
  {
    window.location.href = "admin.html";
  }
  else{
    window.location.href = "user.html";
  }
  
} else {
  document.getElementById("er").style.color = "RED";
  document.getElementById("er").innerHTML = "Error loging you in. Maybe check your user name or password.";
}
});

// Saves ID cookie.
socket.on('id', function(msg){
document.cookie = "echid=" + msg + ";";
});

// once login is clicked, get the data from the boxes and sed it to the server.
function login()
{
var name = document.getElementById("uname").value;
var pw = document.getElementById("psw").value;

console.log("login clicked wiht " + name + " " + pw);

socket.emit("login", [name, pw]);
}

// If socket fails to connect then alert the user the sever appears to be offline.
socket.on('connect_error', function(err) {

document.getElementById("stat").innerHTML = "Server Status:🔴Offline.";
});

socket.on("connect", function(){
document.getElementById("stat").innerHTML = "Server Status:🟢Online.";
});


// Sets the login cookie to the browers cookies.
function loginID(msg)
{
  console.log("Saving cookie");
  document.cookie = "echid=" + msg + ";";
}

// Redirects to the correct page after login.
function redir(rdv)
{
  if(rdv == 1)
  {
    window.location.href = "admin.html";
  } else 
  {
    window.location.href = "user.html";
  }
}