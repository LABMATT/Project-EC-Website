<!DOCTYPE html>
<html>
<head>

<!-- Inportnet info -->
  <title>Login to ECH</title>
  <meta charset="UTF-8">

  <!-- Style sheet for index -->
  <link rel="stylesheet" type="text/css" href="styles/indexStyles.css">

  <!-- Setup For Sockets -->
  <script src="socket.io/dist/socket.io.js"></script> 
  <script>const socket = io("localhost:3000"); // hgc.labmatt.space:3000</script>

  <!-- Setup of scripts -->
  <script type="text/javascript" src="bscripts/indexScript.js"></script>

</head>

<!-- Main Html Body -->
<body>
<div id="center">

  <h1 style="text-align: center;">Edit-Collaborate-Host Login</h1>

  <form method="post" action="<?php echo htmlspecialchars($_SERVER["PHP_SELF"]);?>">
  <label for="uname"><b>Group Name</b></label> 
  <br>
  <input type="text" name="uname" placeholder="" id="uname" maxlength="40" required>
  <br>
  <br>
  <label for="psw"><b>Password</b></label>
  <br>
  <input type="password" name="psw" placeholder="" id="psw" maxlength="40" required>
  <br>
  <button type="submit">Login</button>
</form>


  <ul>
    <li>You are required to acknowledge that this server is low security and purely for the service of viewing development websites.</li>
    <br>
    <li>Chrome may prompt you to change your password because of a data breach. This is due to the password field being managed on the client side, please ignore this message.</li>
    <br>
    <li>This server is not for permanent hosting, and is for project development only.</li>
  </ul>  

  <p>For help OR Server issues contact: <b>labmattcontact@gmail.com<b></p>
  <p>All source code for this service can be dowloaded at:</p>
  <ul>
    <li>Server Code: <a style="color: white;" href="http://github.com/LABMATT/Project-EC-Server">https://github.com/LABMATT/Project-EC-Server</a></li>
    <li>Website Code: <a style="color: white;" href="http://github.com/LABMATT/Project-EC-Website">https://github.com/LABMATT/Project-EC-Website</a></li>
  </ul>

  <h1 id="stat">Server Status: </h1>

  <h1 id="er" style="color: white;"></h1>
</div>

</body>
</html>


<?php 

if ($_SERVER["REQUEST_METHOD"] == "POST") {
 $inUsername = $_POST["uname"]; 
 $inPassword = $_POST["psw"];

 try {

    sanitize($inUsername, 20);
    echo "<br>";
    sanitize($inPassword, 20);

 } catch(Exception $e)
 {
     echo "ERROR: ", $e->getMessage();
 }
}

 // Sanitize checks the the input does not exceed max charter limit and fits within regex limits.
 function sanitize($inputTXT, $mx)
 { 
   
  $illigle = array("ACTION ","ADD ","ALL ","ALLOCATE ","ALTER ","ANY ","APPLICATION ","ARE ","AREA ","ASC ","ASSERTION ","ATOMIC ","AUTHORIZATION ","AVG ","BEGIN ","BY ","CALL ","CASCADE ","CASCADED ","CATALOG ","CHECK ","CLOSE ","COLUMN ","COMMIT ","COMPRESS ","CONNECT ","CONNECTION ","CONSTRAINT ","CONSTRAINTS ","CONTINUE ","CONVERT ","CORRESPONDING ","CREATE ","CROSS ","CURRENT ","CURRENT_PATH ","CURRENT_SCHEMA ","CURRENT_SCHEMAID ","CURRENT_USER ","CURRENT_USERID ","CURSOR ","DATA ","DEALLOCATE ","DECLARE ","DEFAULT ","DEFERRABLE ","DEFERRED ","DELETE ","DESC ","DESCRIBE ","DESCRIPTOR ","DETERMINISTIC ","DIAGNOSTICS ","DIRECTORY ","DISCONNECT ","DISTINCT ","DO ","DOMAIN ","DOUBLEATTRIBUTE ","DROP ","EACH ","EXCEPT ","EXCEPTION ","EXEC ","EXECUTE ","EXTERNAL ","FETCH ","FLOAT ","FOREIGN ","FOUND ","FULL ","FUNCTION ","GET ","GLOBAL ","GO ","GOTO ","GRANT ","GROUP ","HANDLER ","HAVING ","IDENTITY ","IMMEDIATE ","INDEX ","INDEXED ","INDICATOR ","INITIALLY ","INNER ","INOUT ","INPUT ","INSENSITIVE ","INSERT ","INTERSECT ","INTO ","ISOLATION ","JOIN ","KEY ","LANGUAGE ","LAST ","LEAVE ","LEVEL ","LOCAL ","LONGATTRIBUTE ","LOOP ","MODIFIES ","MODULE ","NAMES ","NATIONAL ","NATURAL ","NEXT ","NULLIF ","ON ","ONLY ","OPEN ","OPTION ","ORDER ","OUT ","OUTER ","OUTPUT ","OVERLAPS ","OWNER ","PARTIAL ","PATH ","PRECISION ","PREPARE ","PRESERVE ","PRIMARY ","PRIOR ","PRIVILEGES ","PROCEDURE ","PUBLIC ","READ ","READS ","REFERENCES ","RELATIVE ","REPEAT ","RESIGNAL ","RESTRICT ","RETURN ","RETURNS ","REVOKE ","ROLLBACK ","ROUTINE ","ROW ","ROWS ","SCHEMA ","SCROLL ","SECTION ","SELECT ","SEQ ","SEQUENCE ","SESSION ","SESSION_USER ","SESSION_USERID ","SET ","SIGNAL ","SOME ","SPACE ","SPECIFIC ","SQL ","SQLCODE ","SQLERROR ","SQLEXCEPTION ","SQLSTATE ","SQLWARNING ","STATEMENT ","STRINGATTRIBUTE ","SUM ","SYSACC ","SYSHGH ","SYSLNK ","SYSNIX ","SYSTBLDEF ","SYSTBLDSC ","SYSTBT ","SYSTBTATT ","SYSTBTDEF ","SYSUSR ","SYSTEM_USER ","SYSVIW ","SYSVIWCOL ","TABLE ","TABLETYPE ","TEMPORARY ","TRANSACTION ","TRANSLATE ","TRANSLATION ","TRIGGER ","UNDO ","UNION ","UNIQUE ","UNTIL ","UPDATE ","USAGE ","USER ","USING ","VALUE ","VALUES ","VIEW ","WHERE ","WHILE ","WITH ","WORK ","WRITE ","ALLSCHEMAS ","ALLTABLES ","ALLVIEWS ","ALLVIEWTEXTS ","ALLCOLUMNS ","ALLINDEXES ","ALLINDEXCOLS ","ALLUSERS ","ALLTBTS ","TABLEPRIVILEGES ","TBTPRIVILEGES ","MYSCHEMAS ","MYTABLES ","MYTBTS ","MYVIEWS ","SCHEMAVIEWS ","DUAL ","SCHEMAPRIVILEGES ","SCHEMATABLES ","STATISTICS ","USRTBL ","STRINGTABLE ","LONGTABLE ","DOUBLETABLE ");


    // Check if the input is shorter then the intended maxmum input.
     if(strlen($inputTXT) < $mx ) // && strlen($inputTXT) != 0;
     {

        // Looks for patten in the string. If patten not followed fex an illigle charter then return 1. 
         $charTest = preg_match("/[^a-zA-Z0-9\s\[\]_]+/", $inputTXT);

         echo "<br> testwas: ", $charTest;

         // IF false then the patten found no illigle charters
         if($charTest == false)
         {
             echo("all good");

             foreach($illigle as $value)
             {
                 if(str_contains($inputTXT, $value))
                 {
                    throw new Exception("SQL INJECTION ERROR.");
                 }
             }

         }
         else {
             echo "error";
         }

     } else {
         throw new Exception("Input Exceeds maximum Character Limit.");
     }
 }
?>