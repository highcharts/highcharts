<?php

/**
 * Set the callback variable to what jQuery sends over
 */
$callback = (string)$_GET['callback'];
if (!$callback) $callback = 'callback';

/**
 * The $filename variable determines what file to load
 */
$filename = $_GET['filename'];
if (!preg_match('/^[a-zA-Z\-\.]+\.json$/', $filename)) {
	die('Hacking attempt?');
}

echo $callback . '(' . file_get_contents($filename) .');';

?>