<?php
require_once 'c:/xampp/htdocs/web/php/db.php';
$sql = "ALTER TABLE items ADD COLUMN description TEXT AFTER photo";
if ($conn->query($sql) === TRUE) {
    echo "Column 'description' added successfully\n";
} else {
    echo "Error: " . $conn->error . "\n";
}
$conn->close();
?>