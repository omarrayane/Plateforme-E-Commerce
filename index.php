<?php
ob_start(); // Start output buffering to catch any stray text/warnings
require_once 'php/session.php';

// Prevent PHP warnings from breaking JSON in AJAX requests
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    error_reporting(0);
    ini_set('display_errors', 0);
    ob_clean(); // Discard any previous output (warnings, whitespace)
}

if (!check_login($conn)) {
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        header("Location: login.php");
        exit();
    } else {
        ob_clean(); // Ensure clean JSON output for auth error too
        header('Content-Type: application/json');
        echo json_encode(['success' => false, 'message' => 'Not logged in']);
        exit();
    }
}

// Handle AJAX requests
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Prevent PHP warnings from breaking JSON
    error_reporting(0);
    ini_set('display_errors', 0);

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
                'platform' => $row['platform'] ?? 'Multi',
                'rating' => 4.5,
                'photo' => $row['photo'] ?: 'https://via.placeholder.com/300x400',
                'tags' => [$row['category'], $row['type']],
                'is_special_offer' => (int) $row['is_special_offer'],
                'discount_percentage' => (int) $row['discount_percentage']
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

        if ($item_query && $item_query->num_rows > 0) {
            $item = $item_query->fetch_assoc();
            $name = $item['name'];
            $price = $item['price'];

            // Check if item exists in cart
            $stmt = $conn->prepare("SELECT id, quantity FROM cart WHERE user_id = ? AND item_id = ? AND status = 'in_cart'");
            if (!$stmt) {
                echo json_encode(['success' => false, 'message' => 'Prepare Fail (Select): ' . $conn->error]);
                exit();
            }
            $stmt->bind_param("ii", $user_id, $game_id);
            if (!$stmt->execute()) {
                echo json_encode(['success' => false, 'message' => 'DB Error (Select): ' . $stmt->error]);
                exit();
            }
            $result = $stmt->get_result();

            if ($result->num_rows > 0) {
                // Update quantity
                $row = $result->fetch_assoc();
                $new_qty = $row['quantity'] + 1;
                // Also update amount/name just in case
                $update = $conn->prepare("UPDATE cart SET quantity = ?, amount = ? WHERE id = ?");
                if (!$update) {
                    echo json_encode(['success' => false, 'message' => 'Prepare Fail (Update): ' . $conn->error]);
                    exit();
                }
                $update->bind_param("idi", $new_qty, $price, $row['id']);
                if ($update->execute()) {
                    echo json_encode(['success' => true]);
                } else {
                    echo json_encode(['success' => false, 'message' => 'DB Error (Update): ' . $update->error]);
                }
            } else {
                // Insert new with product_name and amount
                $insert = $conn->prepare("INSERT INTO cart (user_id, item_id, product_name, amount, quantity, status) VALUES (?, ?, ?, ?, 1, 'in_cart')");
                if (!$insert) {
                    echo json_encode(['success' => false, 'message' => 'Prepare Fail (Insert): ' . $conn->error . '. Hint: Check columns product_name/amount in DB']);
                    exit();
                }
                $insert->bind_param("iisd", $user_id, $game_id, $name, $price);
                if ($insert->execute()) {
                    echo json_encode(['success' => true]);
                } else {
                    error_log("Cart Insert Error: " . $insert->error);
                    echo json_encode(['success' => false, 'message' => 'DB Error (Insert): ' . $insert->error]);
                }
            }
        } else {
            echo json_encode(['success' => false, 'message' => 'Item not found in database']);
        }
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