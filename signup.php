<?php
require_once 'php/session.php';
require_once 'php/auth_logic.php';

// If already logged in, redirect to dashboard
if (check_login($conn)) {
    header("Location: index.php");
    exit();
}

$res = handle_signup($conn);
$error = $res['error'];
$success = $res['success'];
$username = $res['username'];
$email = $res['email'];

if ($success) {
    header("refresh:2;url=login.php");
}

include 'templates/signup_view.html';
?>