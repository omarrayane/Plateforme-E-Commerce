<?php
<<<<<<< HEAD
require_once 'php/session.php';
require_once 'php/auth_logic.php';

$res = handle_forgot_password($conn);
$error = $res['error'];
$success = $res['success'];

include 'templates/forgot_password_view.html';
?>
=======
header("Location: php/forgot_password.php");
exit();
?>
>>>>>>> f5512bca0df29e9b94d8d2b70f5d595cd7c87ec5
