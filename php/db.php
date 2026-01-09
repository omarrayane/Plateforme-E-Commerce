<?php
$host = "localhost";
$user = "root";
$password = "01092005f5";
$database = "gaming_store";

$conn = new mysqli($host, $user, $password, $database);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
?>