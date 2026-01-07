<?php
header("Location: ../items.php" . ($_SERVER['QUERY_STRING'] ? "?" . $_SERVER['QUERY_STRING'] : ""));
exit();
?>