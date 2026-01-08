<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

require_once __DIR__ . '/db.php';

/**
 * Checks if a user is logged in via session or persistent cookie.
 */
function check_login($conn)
{
    // 1. Check if session already exists
    if (isset($_SESSION['user_id'])) {
        // Validation supplémentaire : Vérifier si cet ID existe toujours en BDD
        $stmt = $conn->prepare("SELECT id FROM users WHERE id = ?");
        $stmt->bind_param("i", $_SESSION['user_id']);
        $stmt->execute();
        $res = $stmt->get_result();
        if ($res->num_rows === 0) {
            // L'utilisateur n'existe plus (ex: BDD réinitialisée)
            session_unset();
            session_destroy();
            return false;
        }
        return true;
    }

    // 2. Check for persistent cookie ("Remember Me")
    if (isset($_COOKIE['remember_user'])) {
        $token = $_COOKIE['remember_user'];

        $stmt = $conn->prepare("SELECT id, username, role FROM users WHERE username = ?");
        $stmt->bind_param("s", $token);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($user = $result->fetch_assoc()) {
            // Re-establish session
            $_SESSION['user_id'] = $user['id'];
            $_SESSION['username'] = $user['username'];
            $_SESSION['user_role'] = $user['role'];
            return true;
        }
    }

    return false;
}

/**
 * Sets a persistent cookie for "Remember Me".
 */
function set_remember_cookie($username)
{
    // Set cookie for 30 days
    setcookie("remember_user", $username, time() + (86400 * 30), "/");
}

/**
 * Clears persistent cookies.
 */
function clear_cookies()
{
    if (isset($_COOKIE['remember_user'])) {
        setcookie("remember_user", "", time() - 3600, "/");
    }
}
