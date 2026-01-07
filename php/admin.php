<?php
header("Location: ../admin.php" . ($_SERVER['QUERY_STRING'] ? "?" . $_SERVER['QUERY_STRING'] : ""));
exit();
?>