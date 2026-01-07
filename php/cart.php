<?php
<<<<<<< HEAD
header("Location: ../cart.php" . ($_SERVER['QUERY_STRING'] ? "?" . $_SERVER['QUERY_STRING'] : ""));
exit();
?>
=======
require_once 'session.php';
require_once 'db.php';

// Auth check
if (!check_login($conn) || $_SESSION['user_role'] !== 'admin') {
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        header("Location: login.php");
        exit();
    } else {
        header('Content-Type: application/json');
        echo json_encode(['success' => false, 'message' => 'Unauthorized']);
        exit();
    }
}

// Handle AJAX requests
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    header('Content-Type: application/json');
    $action = $_POST['action'] ?? '';

    if ($action === 'get_order') {
        $id = $_POST['id'] ?? 0;
        $stmt = $conn->prepare("SELECT c.*, u.username FROM cart c JOIN users u ON c.user_id = u.id WHERE c.id = ?");
        $stmt->bind_param("i", $id);
        $stmt->execute();
        $result = $stmt->get_result();
        $order = $result->fetch_assoc();
        echo json_encode(['success' => true, 'order' => $order]);
        $stmt->close();
        exit();
    }
}

// Fetch cart items (orders) for initial load
$cart_items = [];
$result = $conn->query("SELECT c.*, u.username FROM cart c JOIN users u ON c.user_id = u.id ORDER BY c.created_at DESC");
if ($result) {
    while ($row = $result->fetch_assoc()) {
        $cart_items[] = $row;
    }
}

include '../templates/Orders.html';
?>
>>>>>>> f5512bca0df29e9b94d8d2b70f5d595cd7c87ec5
