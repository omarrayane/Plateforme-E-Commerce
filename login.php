<?php
<<<<<<< HEAD
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
=======
header("Location: php/login.php");
exit();
?>
>>>>>>> f5512bca0df29e9b94d8d2b70f5d595cd7c87ec5
