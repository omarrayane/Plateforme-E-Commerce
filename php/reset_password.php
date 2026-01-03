<?php
require_once 'session.php';
require_once 'auth_logic.php';

$token = $_GET['token'] ?? '';
$res = handle_reset_password($conn, $token);

if (isset($res['critical'])) {
    die($res['error'] . " <a href='forgot_password.php'>Try again</a>");
}

$error = $res['error'];
$success = $res['success'];

if ($success) {
    header("refresh:2;url=login.php");
}

include '../templates/reset_password_view.html';
?>
