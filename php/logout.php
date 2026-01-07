<?php
require_once 'session.php';
session_destroy();
clear_cookies();
header("Location: login.php");
exit();
?>
