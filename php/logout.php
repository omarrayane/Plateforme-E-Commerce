<?php
require_once 'session.php';
clear_cookies();
session_destroy();
header("Location: login.php");
exit();
?>
