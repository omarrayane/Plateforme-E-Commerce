<?php
<<<<<<< HEAD
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
    // Clear any previous buffer/output
    ob_clean();
    header('Content-Type: application/json');

    $action = $_POST['action'] ?? '';
    $id = intval($_POST['id'] ?? 0);

    if (empty($action) || $id === 0) {
        echo json_encode(['success' => false, 'message' => 'Action ou ID manquant (Action: ' . $action . ', ID: ' . $id . ').']);
        exit();
    }

    if ($action === 'promote') {
        $stmt = $conn->prepare("UPDATE users SET role = 'admin' WHERE id = ?");
        if (!$stmt) {
            echo json_encode(['success' => false, 'message' => 'Erreur SQL Prepare: ' . $conn->error]);
            exit();
        }
        $stmt->bind_param("i", $id);
        $res = $stmt->execute();
        $stmt->close();
        if ($res) {
            echo json_encode(['success' => true]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Erreur SQL Execute.']);
        }
        exit();
    }

    if ($action === 'demote') {
        $stmt = $conn->prepare("UPDATE users SET role = 'user' WHERE id = ?");
        if (!$stmt) {
            echo json_encode(['success' => false, 'message' => 'Erreur SQL Prepare: ' . $conn->error]);
            exit();
        }
        $stmt->bind_param("i", $id);
        $res = $stmt->execute();
        $stmt->close();
        if ($res) {
            echo json_encode(['success' => true]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Erreur SQL Execute.']);
        }
        exit();
    }

    if ($action === 'delete') {
        if ($id == $_SESSION['user_id']) {
            echo json_encode(['success' => false, 'message' => 'Impossible de supprimer votre propre compte.']);
            exit();
        }
        $stmt = $conn->prepare("DELETE FROM users WHERE id = ?");
        if (!$stmt) {
            echo json_encode(['success' => false, 'message' => 'Erreur SQL Prepare: ' . $conn->error]);
            exit();
        }
        $stmt->bind_param("i", $id);
        $res = $stmt->execute();
        $stmt->close();
        if ($res) {
            echo json_encode(['success' => true]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Erreur SQL Execute.']);
        }
        exit();
    }

    echo json_encode(['success' => false, 'message' => 'Action non reconnue: ' . $action]);
    exit();
}

// Fetch users for initial load
$users = [];
$result = $conn->query("SELECT id, username, email, role FROM users ORDER BY created_at DESC");
if ($result) {
    while ($row = $result->fetch_assoc()) {
        $users[] = $row;
    }
}

include 'templates/users.html';
?>
=======
header("Location: php/users.php");
exit();
?>
>>>>>>> f5512bca0df29e9b94d8d2b70f5d595cd7c87ec5
