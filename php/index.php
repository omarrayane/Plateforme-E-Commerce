<?php
require_once 'session.php';

if (!check_login($conn)) {
    header("Location: login.php");
    exit();
}

include '../templates/dashboard_view.html';
?>
