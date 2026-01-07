<?php
require_once 'php/session.php';
require_once 'php/db.php';

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
        $name = trim($_POST['name'] ?? '');
        $category = trim($_POST['category'] ?? '');
        $type = trim($_POST['type'] ?? '');
        $price = $_POST['price'] ?? 0;
        $is_special_offer = (int) ($_POST['is_special_offer'] ?? 0);
        $discount_percentage = (int) ($_POST['discount_percentage'] ?? 0);
        $photo = trim($_POST['photo'] ?? '');

        // Handle File Upload
        if (isset($_FILES['photo_file']) && $_FILES['photo_file']['error'] === UPLOAD_ERR_OK) {
            $upload_dir = 'uploads/';
            if (!is_dir($upload_dir)) {
                mkdir($upload_dir, 0777, true);
            }
            $file_extension = pathinfo($_FILES['photo_file']['name'], PATHINFO_EXTENSION);
            $file_name = uniqid('item_', true) . '.' . $file_extension;
            $target_file = $upload_dir . $file_name;

            if (move_uploaded_file($_FILES['photo_file']['tmp_name'], $target_file)) {
                $photo = $target_file;
            }
        }

        $stmt = $conn->prepare("INSERT INTO items (name, category, type, price, photo, is_special_offer, discount_percentage) VALUES (?, ?, ?, ?, ?, ?, ?)");
        $stmt->bind_param("sssdsii", $name, $category, $type, $price, $photo, $is_special_offer, $discount_percentage);

        if ($stmt->execute()) {
            echo json_encode(['success' => true, 'id' => $stmt->insert_id]);
        } else {
            echo json_encode(['success' => false, 'message' => $stmt->error]);
        }
        $stmt->close();
        exit();
    }

    if ($action === 'edit') {
        $id = (int) ($_POST['id'] ?? 0);
        $name = trim($_POST['name'] ?? '');
        $category = trim($_POST['category'] ?? '');
        $type = trim($_POST['type'] ?? '');
        $price = $_POST['price'] ?? 0;
        $is_special_offer = (int) ($_POST['is_special_offer'] ?? 0);
        $discount_percentage = (int) ($_POST['discount_percentage'] ?? 0);
        $photo = trim($_POST['photo'] ?? '');

        // Handle File Upload
        if (isset($_FILES['photo_file']) && $_FILES['photo_file']['error'] === UPLOAD_ERR_OK) {
            $upload_dir = 'uploads/';
            if (!is_dir($upload_dir)) {
                mkdir($upload_dir, 0777, true);
            }
            $file_extension = pathinfo($_FILES['photo_file']['name'], PATHINFO_EXTENSION);
            $file_name = uniqid('item_', true) . '.' . $file_extension;
            $target_file = $upload_dir . $file_name;

            if (move_uploaded_file($_FILES['photo_file']['tmp_name'], $target_file)) {
                $photo = $target_file;
            }
        }

        $stmt = $conn->prepare("UPDATE items SET name = ?, category = ?, type = ?, price = ?, photo = ?, is_special_offer = ?, discount_percentage = ? WHERE id = ?");
        $stmt->bind_param("sssdsiii", $name, $category, $type, $price, $photo, $is_special_offer, $discount_percentage, $id);

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

include 'templates/Games.html';
?>