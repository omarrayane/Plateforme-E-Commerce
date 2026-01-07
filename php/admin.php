<?php
require_once 'session.php';

if (!check_login($conn) || $_SESSION['user_role'] !== 'admin') {
    header("Location: login.php");
    exit();
}

include '../templates/admin.html';
?>
