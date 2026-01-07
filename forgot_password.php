<?php
require_once 'php/session.php';
require_once 'php/auth_logic.php';

$res = handle_forgot_password($conn);
$error = $res['error'];
$success = $res['success'];

include 'templates/forgot_password_view.html';
?>