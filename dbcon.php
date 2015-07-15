<?
$host = "localhost";
$user = "user"; // username with privileges to the database
$db = "db"; // the database
$pass = "password"; // password for the username

// create a connection
$con = new mysqli($host, $user, $pass, $db);
$con->set_charset("utf8");

// check the connection
if($con->connect_error){
	die("Connection failed: " . $con->connect_error);
}


?>