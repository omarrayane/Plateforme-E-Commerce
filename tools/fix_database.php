<?php
$host = "localhost";
$user = "root";
$password = "01092005f5";

$temp_conn = new mysqli($host, $user, $password);

if ($temp_conn->connect_error) {
    die("<h2 style='color:red'>Connection to MySQL failed: " . $temp_conn->connect_error . "</h2>");
}

echo "<h3>1. Connected to MySQL successfully!</h3>";

$temp_conn->query("CREATE DATABASE IF NOT EXISTS gaming_store");
$temp_conn->select_db("gaming_store");
echo "<h3>2. Database 'gaming_store' is ready!</h3>";

$sql_table = "CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    role ENUM('user', 'admin') DEFAULT 'user',
    reset_token VARCHAR(64) DEFAULT NULL,
    reset_expires DATETIME DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)";

if ($temp_conn->query($sql_table)) {
    echo "<h3>3. Table 'users' verified!</h3>";

    $check_reset = $temp_conn->query("SHOW COLUMNS FROM users LIKE 'reset_token'");
    if ($check_reset->num_rows == 0) {
        $temp_conn->query("ALTER TABLE users ADD reset_token VARCHAR(64) DEFAULT NULL");
        $temp_conn->query("ALTER TABLE users ADD reset_expires DATETIME DEFAULT NULL");
        echo "<h3>3.1. Reset columns added.</h3>";
    }

    $check_role = $temp_conn->query("SHOW COLUMNS FROM users LIKE 'role'");
    if ($check_role->num_rows == 0) {
        $temp_conn->query("ALTER TABLE users ADD role ENUM('user', 'admin') DEFAULT 'user' AFTER email");
        echo "<h3>3.2. Role column added.</h3>";
    }
}

$test_pass_hash = password_hash("password123", PASSWORD_DEFAULT);
$temp_conn->query("DELETE FROM users WHERE username = 'admin'");
$temp_conn->query("INSERT INTO users (username, password, email, role) VALUES ('admin', '$test_pass_hash', 'admin@gamestore.com', 'admin')");
echo "<h3>4. Admin account updated with 'admin' role!</h3>";

echo "<hr><h2 style='color:green'>SUCCESS! Everything is set up.</h2>";
echo "<p>Go back to <a href='login.php'>Login Page</a> and use:</p>";
echo "<b>Username:</b> admin<br>";
echo "<b>Password:</b> password123";

$temp_conn->close();
?>
