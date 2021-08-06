<?php
// Opens a connection to a MySQL server.
$connection=mysqli_connect ("localhost", 'root', '2222','map');
if (!$connection) {
    die('Not connected : ' . mysqli_connect_error());
}
