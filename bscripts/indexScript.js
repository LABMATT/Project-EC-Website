

// If socket fails to connect then alert the user the sever appears to be offline.
socket.on('connect_error', function(err) {

document.getElementById("stat").innerHTML = "Server Status:🔴Offline.";
});

socket.on("connect", function(){
document.getElementById("stat").innerHTML = "Server Status:🟢Online.";
});