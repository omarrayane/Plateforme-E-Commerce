<?php
<<<<<<< HEAD
require_once 'php/session.php';
require_once 'php/auth_logic.php';

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

include 'templates/reset_password_view.html';
?>
=======
header("Location: php/reset_password.php" . (isset($_GET['token']) ? "?token=" . $_GET['token'] : ""));
exit();
?>
>>>>>>> f5512bca0df29e9b94d8d2b70f5d595cd7c87ec5
