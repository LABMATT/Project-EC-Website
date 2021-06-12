var locations = [];

var ftree = {
    root: ""
}

function setRoot(newroot)
{
    ftree.root = newroot;
    document.getElementById("root").innerHTML = ftree.root;
}


// Idea is that the path is a path from the root egg /matt/styles/style.css
// Program would split at slashes, make a new folder called styles, then put a file named styles.css in it.
// If path was say /matt/styles/ then it would add an empty folder.
// IF path was say /matt/styles then it would asume its a file and add a new file. 
function newLocation(path) {

    updateTree();
}

function removeLocation(path) {

    updateTree();
}

// Is called when a change occures to the tree struture.
function updateTree()
{

    locations.forEach(loc => {
        if(loc.endsWith("/"))
        {
            
        }
    });
}