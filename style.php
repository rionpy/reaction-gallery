<?php
$directory = "css";
require "./vendor/scssphp/scss.inc.php";
scss_server::serveFrom($directory);
?>