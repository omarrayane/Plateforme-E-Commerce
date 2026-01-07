<?php
require_once 'php/session.php';
require_once 'php/auth_logic.php';

// If already logged in, redirect to dashboard
if (check_login($conn)) {
    header("Location: index.php");
    exit();
}

$error = handle_login($conn);

include 'templates/login_view.html';
?>