<?php
<<<<<<< HEAD
require_once 'php/session.php';

if (!check_login($conn) || $_SESSION['user_role'] !== 'admin') {
    header("Location: login.php");
    exit();
}

// Fetch totals
$total_users = 0;
$res = $conn->query("SELECT COUNT(*) as count FROM users");
if ($res) {
    $row = $res->fetch_assoc();
    $total_users = $row['count'];
}

$total_games = 0;
$res = $conn->query("SELECT COUNT(*) as count FROM items WHERE type = 'game'");
if ($res) {
    $row = $res->fetch_assoc();
    $total_games = $row['count'];
}

$total_giftcards = 0;
$res = $conn->query("SELECT COUNT(*) as count FROM items WHERE type = 'giftcard'");
if ($res) {
    $row = $res->fetch_assoc();
    $total_giftcards = $row['count'];
}

// Fetch recent orders
$recent_orders = [];
$res = $conn->query("SELECT c.*, u.username FROM cart c JOIN users u ON c.user_id = u.id ORDER BY c.created_at DESC LIMIT 5");
if ($res) {
    while ($row = $res->fetch_assoc()) {
        $recent_orders[] = $row;
    }
}

include 'templates/admin.html';
?>
=======
header("Location: php/admin.php");
exit();
?>
>>>>>>> f5512bca0df29e9b94d8d2b70f5d595cd7c87ec5
