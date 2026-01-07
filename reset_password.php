<?php
header("Location: php/reset_password.php" . (isset($_GET['token']) ? "?token=" . $_GET['token'] : ""));
exit();
?>
