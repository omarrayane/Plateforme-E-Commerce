<?php
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

    if ($action === 'add') {
        $name = $_POST['name'] ?? '';
        $category = $_POST['category'] ?? '';
        $type = $_POST['type'] ?? '';
        $price = $_POST['price'] ?? 0;
        $photo = $_POST['photo'] ?? '';

        $stmt = $conn->prepare("INSERT INTO items (name, category, type, price, photo) VALUES (?, ?, ?, ?, ?)");
        $stmt->bind_param("sssds", $name, $category, $type, $price, $photo);
        
        if ($stmt->execute()) {
            echo json_encode(['success' => true, 'id' => $stmt->insert_id]);
        } else {
            echo json_encode(['success' => false, 'message' => $stmt->error]);
        }
        $stmt->close();
        exit();
    }

    if ($action === 'edit') {
        $id = $_POST['id'] ?? 0;
        $name = $_POST['name'] ?? '';
        $category = $_POST['category'] ?? '';
        $type = $_POST['type'] ?? '';
        $price = $_POST['price'] ?? 0;
        $photo = $_POST['photo'] ?? '';

        $stmt = $conn->prepare("UPDATE items SET name = ?, category = ?, type = ?, price = ?, photo = ? WHERE id = ?");
        $stmt->bind_param("sssdsi", $name, $category, $type, $price, $photo, $id);
        
        if ($stmt->execute()) {
            echo json_encode(['success' => true]);
        } else {
            echo json_encode(['success' => false, 'message' => $stmt->error]);
        }
        $stmt->close();
        exit();
    }

    if ($action === 'delete') {
        $id = $_POST['id'] ?? 0;
        $stmt = $conn->prepare("DELETE FROM items WHERE id = ?");
        $stmt->bind_param("i", $id);
        
        if ($stmt->execute()) {
            echo json_encode(['success' => true]);
        } else {
            echo json_encode(['success' => false, 'message' => $stmt->error]);
        }
        $stmt->close();
        exit();
    }
}

// Fetch items for initial load
$items = [];
$result = $conn->query("SELECT * FROM items ORDER BY created_at DESC");
if ($result) {
    while ($row = $result->fetch_assoc()) {
        $items[] = $row;
    }
}

include '../templates/Games.html';
?>
