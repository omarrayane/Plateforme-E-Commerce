<?php
/**
 * Authentication Logic Handler
 */

function handle_login($conn) {
    $error = '';
    if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_POST['login'])) {
        $username = trim($_POST['username']);
        $password = $_POST['password'];
        $remember = isset($_POST['remember']);

        if (empty($username) || empty($password)) {
            $error = "Please enter both username and password.";
        } else {
            $stmt = $conn->prepare("SELECT id, username, email, password, role FROM users WHERE username = ?");
            $stmt->bind_param("s", $username);
            $stmt->execute();
            $result = $stmt->get_result();

            if ($user = $result->fetch_assoc()) {
                if (password_verify($password, $user['password'])) {
                    $_SESSION['user_id'] = $user['id'];
                    $_SESSION['username'] = $user['username'];
                    $_SESSION['email'] = $user['email'];
                    $_SESSION['user_role'] = $user['role'];

                    if ($remember) {
                        set_remember_cookie($username);
                    }

                    // All users (including admins) land on the home page
                    header("Location: index.php");
                    exit();
                } else {
                    $error = "Invalid username or password.";
                }
            } else {
                $error = "Invalid username or password.";
            }
            $stmt->close();
        }
    }
    return $error;
}

function handle_signup($conn) {
    $error = '';
    $success = '';
    
    if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_POST['signup'])) {
        $username = trim($_POST['username']);
        $email = trim($_POST['email']);
        $password = $_POST['password'];
        $confirm_password = $_POST['confirm_password'];

        if (empty($username) || empty($email) || empty($password)) {
            $error = "All fields are required.";
        } elseif ($password !== $confirm_password) {
            $error = "Passwords do not match.";
        } elseif (strlen($password) < 6) {
            $error = "Password must be at least 6 characters long.";
        } else {
            // Check if username or email exists
            $stmt = $conn->prepare("SELECT id FROM users WHERE username = ? OR email = ?");
            $stmt->bind_param("ss", $username, $email);
            $stmt->execute();
            $result = $stmt->get_result();

            if ($result->num_rows > 0) {
                $error = "Username or Email already exists.";
            } else {
                $hashed_password = password_hash($password, PASSWORD_DEFAULT);
                $role = 'user'; // Default role
                
                $insert_stmt = $conn->prepare("INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)");
                $insert_stmt->bind_param("ssss", $username, $email, $hashed_password, $role);

                if ($insert_stmt->execute()) {
                    $success = "Account created successfully! Redirecting to login...";
                } else {
                    $error = "Something went wrong. Please try again.";
                }
                $insert_stmt->close();
            }
            $stmt->close();
        }
    }
    return ['error' => $error, 'success' => $success, 'username' => $username ?? '', 'email' => $email ?? ''];
}

function handle_forgot_password($conn) {
    $error = '';
    $success = '';
    
    if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_POST['reset'])) {
        $email = trim($_POST['email']);

        if (empty($email)) {
            $error = "Please enter your email.";
        } else {
            $stmt = $conn->prepare("SELECT id FROM users WHERE email = ?");
            $stmt->bind_param("s", $email);
            $stmt->execute();
            $result = $stmt->get_result();
            
            if ($user = $result->fetch_assoc()) {
                $token = bin2hex(random_bytes(32));
                $expires = date("Y-m-d H:i:s", strtotime("+1 hour"));
                
                $update_stmt = $conn->prepare("UPDATE users SET reset_token = ?, reset_expires = ? WHERE email = ?");
                $update_stmt->bind_param("sss", $token, $expires, $email);
                $update_stmt->execute();

                $reset_link = "reset_password.php?token=" . $token;
                $success = "Success! (Demo Mode) <br> <a href='$reset_link' style='color:#00ff00; font-weight:bold;'>Click here to reset your password</a>";
            } else {
                $error = "Email not found in our system.";
            }
            $stmt->close();
        }
    }
    return ['error' => $error, 'success' => $success];
}

function handle_reset_password($conn, $token) {
    $error = '';
    $success = '';
    
    if (empty($token)) {
        return ['error' => 'Invalid token.', 'success' => ''];
    }

    $stmt = $conn->prepare("SELECT id FROM users WHERE reset_token = ? AND reset_expires > NOW()");
    $stmt->bind_param("s", $token);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows == 0) {
        return ['error' => 'Invalid or expired token.', 'critical' => true];
    }

    if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_POST['update_password'])) {
        $password = $_POST['password'];
        $confirm_password = $_POST['confirm_password'];

        if (strlen($password) < 6) {
            $error = "Password must be at least 6 characters.";
        } elseif ($password !== $confirm_password) {
            $error = "Passwords do not match.";
        } else {
            $hashed_password = password_hash($password, PASSWORD_DEFAULT);
            $update_stmt = $conn->prepare("UPDATE users SET password = ?, reset_token = NULL, reset_expires = NULL WHERE reset_token = ?");
            $update_stmt->bind_param("ss", $hashed_password, $token);
            
            if ($update_stmt->execute()) {
                $success = "Password reset successful! Redirecting to login...";
            } else {
                $error = "Update failed. Please try again.";
            }
            $update_stmt->close();
        }
    }
    return ['error' => $error, 'success' => $success];
}
?>
