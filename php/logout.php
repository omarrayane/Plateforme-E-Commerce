<?php
<<<<<<< HEAD
header("Location: ../logout.php" . ($_SERVER['QUERY_STRING'] ? "?" . $_SERVER['QUERY_STRING'] : ""));
=======
require_once 'session.php';
session_destroy();
clear_cookies();
header("Location: login.php");
>>>>>>> f5512bca0df29e9b94d8d2b70f5d595cd7c87ec5
exit();
?>