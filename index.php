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
                'id' => (int) $row['id'],
                'title' => $row['name'],
                'description' => $row['description'] ?: ($row['type'] === 'game' ? 'Un jeu incroyable .' : 'Une carte cadeau utile.'),
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

    // --- Cart Actions ---

    // Get Cart
    if ($action === 'get_cart') {
        $user_id = $_SESSION['user_id'];
        $stmt = $conn->prepare("
            SELECT c.id as cart_id, c.quantity, c.item_id, i.name as title, i.price, i.photo, i.category 
            FROM cart c 
            JOIN items i ON c.item_id = i.id 
            WHERE c.user_id = ? AND c.status = 'in_cart'
        ");
        $stmt->bind_param("i", $user_id);
        $stmt->execute();
        $result = $stmt->get_result();
        $cart = [];
        while ($row = $result->fetch_assoc()) {
            $cart[] = [
                'id' => (int) $row['item_id'], // Keep item_id as main id for frontend consistency
                'cart_id' => (int) $row['cart_id'],
                'title' => $row['title'],
                'price' => (float) $row['price'],
                'photo' => $row['photo'],
                'quantity' => (int) $row['quantity']
            ];
        }
        echo json_encode(['success' => true, 'cart' => $cart]);
        exit();
    }

    // Add to Cart
    if ($action === 'add_to_cart') {
        $user_id = $_SESSION['user_id'];
        $game_id = (int) $_POST['game_id'];
        
        // Fetch item details for the snapshot columns
        $item_query = $conn->query("SELECT name, price FROM items WHERE id = $game_id");
        $item = $item_query->fetch_assoc();
        $name = $item['name'];
        $price = $item['price'];

        // Check if item exists in cart
        $stmt = $conn->prepare("SELECT id, quantity FROM cart WHERE user_id = ? AND item_id = ? AND status = 'in_cart'");
        $stmt->bind_param("ii", $user_id, $game_id);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows > 0) {
            // Update quantity
            $row = $result->fetch_assoc();
            $new_qty = $row['quantity'] + 1;
            // Also update amount/name just in case
            $update = $conn->prepare("UPDATE cart SET quantity = ?, amount = ? WHERE id = ?");
            $update->bind_param("idi", $new_qty, $price, $row['id']);
            $update->execute();
        } else {
            // Insert new with product_name and amount
            $insert = $conn->prepare("INSERT INTO cart (user_id, item_id, product_name, amount, quantity, status) VALUES (?, ?, ?, ?, 1, 'in_cart')");
            $insert->bind_param("iisd", $user_id, $game_id, $name, $price);
            $insert->execute();
        }
        echo json_encode(['success' => true]);
        exit();
    }

    // Update Quantity
    if ($action === 'update_cart_quantity') {
        $user_id = $_SESSION['user_id'];
        $game_id = (int) $_POST['game_id'];
        $quantity = (int) $_POST['quantity'];

        if ($quantity <= 0) {
            // Remove
            $stmt = $conn->prepare("DELETE FROM cart WHERE user_id = ? AND item_id = ? AND status = 'in_cart'");
            $stmt->bind_param("ii", $user_id, $game_id);
        } else {
            // Update
            $stmt = $conn->prepare("UPDATE cart SET quantity = ? WHERE user_id = ? AND item_id = ? AND status = 'in_cart'");
            $stmt->bind_param("iii", $quantity, $user_id, $game_id);
        }
        $stmt->execute();
        echo json_encode(['success' => true]);
        exit();
    }

    // Remove Item
    if ($action === 'remove_from_cart') {
        $user_id = $_SESSION['user_id'];
        $game_id = (int) $_POST['game_id'];

        $stmt = $conn->prepare("DELETE FROM cart WHERE user_id = ? AND item_id = ? AND status = 'in_cart'");
        $stmt->bind_param("ii", $user_id, $game_id);
        $stmt->execute();
        echo json_encode(['success' => true]);
        exit();
    }

    if ($action === 'checkout') {
        $user_id = $_SESSION['user_id'];
        // Mark all in_cart items as pending (ordered)
        $stmt = $conn->prepare("UPDATE cart SET status = 'pending' WHERE user_id = ? AND status = 'in_cart'");
        $stmt->bind_param("i", $user_id);

        if ($stmt->execute()) {
            echo json_encode(['success' => true]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Erreur database']);
        }
        exit();
    }
}

include 'templates/dashboard.html';
?>