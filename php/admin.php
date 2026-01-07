<?php
<<<<<<< HEAD
header("Location: ../admin.php" . ($_SERVER['QUERY_STRING'] ? "?" . $_SERVER['QUERY_STRING'] : ""));
exit();
?>
=======
require_once 'session.php';

if (!check_login($conn) || $_SESSION['user_role'] !== 'admin') {
    header("Location: login.php");
    exit();
}

include '../templates/admin.html';
?>
>>>>>>> f5512bca0df29e9b94d8d2b70f5d595cd7c87ec5
