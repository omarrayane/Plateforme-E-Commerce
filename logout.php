<?php
require_once 'php/session.php';
clear_cookies();
session_destroy();
header("Location: login.php");
exit();
?>