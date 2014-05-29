<?php
	if (!isset($_SESSION)){
		session_start();
	}

	if (isset($_GET['id']) && $_GET['result']) {
		$_SESSION[$_GET['id']] = $_GET['result'];

	} else if (isset($_GET['allclicked'])) {
		$_SESSION['allclicked'] = $_GET['allclicked'];
	}
?>