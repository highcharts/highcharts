<?php

/**
 * This file caches content from any URL
 */

$file = $_GET['file'];

// Remove maps or stock folder from github requests
$file = preg_replace('/(github\.highcharts\.com\/[a-z0-9]+\/)(maps|stock)\//', '$1', $file);
$file = preg_replace('/^\/\//', 'http://', $file);
$file = str_replace('https:', 'http:', $file);

$cachePath = $file;
$cachePath = str_replace('/', '-', $cachePath);
$cachePath = str_replace(':', '-', $cachePath);
$cachePath = "cache/$cachePath";

if (!is_dir('cache')) {
	mkdir('cache');
}
if (!is_file($cachePath)) {
	$content = file_get_contents($file);
	if (!$content) {
		$content = 'console.log("Could not download ' . $file . '. Make sure PHP server is set up for SSL.");';
	}
	file_put_contents($cachePath, $content);
}

if (substr($file, strlen($file) - 2) == 'js') {
	header("Content-type: text/javascript");
} else if (substr($file, strlen($file) - 3) == 'css') {
	header("Content-type: text/css");
}

echo file_get_contents($cachePath);


?>