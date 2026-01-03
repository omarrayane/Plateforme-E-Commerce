<?php
require_once 'connection.php';

echo "Database: " . $database . "<br>";

$table_check = $conn->query("SHOW TABLES LIKE 'users'");
if ($table_check->num_rows == 0) {
    echo "Error: Table 'users' does not exist in database '" . $database . "'.<br>";
} else {
    echo "Success: Table 'users' exists.<br>";
    
    $user_check = $conn->query("SELECT id, username FROM users WHERE username = 'admin'");
    if ($user_check->num_rows == 0) {
        echo "Error: User 'admin' does not exist in the table.<br>";
    } else {
        echo "Success: User 'admin' exists.<br>";
    }
}
?>
