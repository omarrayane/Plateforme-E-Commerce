<?php
require_once 'php/session.php';

if (!check_login($conn)) {
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        header("Location: login.php");
        exit();
    } else {
        header('Content-Type: application/json');
        echo json_encode(['success' => false, 'message' => 'Not logged in']);
        exit();
    }
}

// Handle AJAX requests
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    header('Content-Type: application/json');
    $action = $_POST['action'] ?? '';

    if ($action === 'get_items') {
        $items = [];
        $result = $conn->query("SELECT * FROM items ORDER BY created_at DESC");
        while ($row = $result->fetch_assoc()) {
            $items[] = [
                'id' => $row['id'],
                'title' => $row['name'],
                'description' => $row['type'] === 'game' ? 'Un jeu incroyable .' : 'Une carte cadeau utile.',
                'price' => (float) $row['price'],
                'category' => $row['category'],
                'platform' => $row['type'] === 'game' ? 'Multi' : 'Digital',
                'rating' => 4.5,
                'photo' => $row['photo'] ?: 'https://via.placeholder.com/300x400',
                'tags' => [$row['category'], $row['type']]
            ];
        }
        echo json_encode(['success' => true, 'items' => $items]);
        exit();
    }

    if ($action === 'checkout') {
        $cart_data = json_decode($_POST['cart'], true);
        if (!$cart_data) {
            echo json_encode(['success' => false, 'message' => 'Panier vide']);
            exit();
        }

        $user_id = $_SESSION['user_id'];
        $stmt = $conn->prepare("INSERT INTO cart (user_id, product_name, amount, status) VALUES (?, ?, ?, 'pending')");

        foreach ($cart_data as $item) {
            $stmt->bind_param("isd", $user_id, $item['title'], $item['price']);
            $stmt->execute();
        }

        $stmt->close();
        echo json_encode(['success' => true]);
        exit();
    }
}

include 'templates/dashboard.html';
?>