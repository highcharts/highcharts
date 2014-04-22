<?php

/**
 * Set the callback variable to what jQuery sends over
 */
$callback = (string)$_GET['callback'];
if (!$callback) $callback = 'callback';

/**
 * The $filename parameter determines what file to load from local source
 */
$filename = $_GET['filename'];
if (preg_match('/^[a-zA-Z\-\.]+\.json$/', $filename)) {
	$json = file_get_contents($filename);
}
if (preg_match('/^[a-zA-Z\-\.]+\.csv$/', $filename)) {
	$csv = str_replace('"', '\"', file_get_contents($filename));
	$csv = preg_replace( "/[\r\n]+/", "\\n", $csv);
	$json = '"' . $csv . '"';
}

/**
 * The $url parameter loads data from external sources
 */
@$url = $_GET['url'];
if ($url) {
	if (preg_match('/^(http|https):\/\/[\w\W]*\.xml$/', $url)) {
		$xml = simplexml_load_file($url);
		$json = json_encode($xml);
	} else if (preg_match('/^(http|https):\/\/[\/\w \.-]*\.csv$/', $url)) {
		$csv = str_getcsv(file_get_contents($url));
		$json = json_encode($xml);
	
	// Assume JSON
	} else if (preg_match('/^(http|https):\/\/[\/\w \.-]*$/', $url)) {
		$json = file_get_contents($url);
	}
}

// Send the output
header('Content-Type: text/javascript');
echo "$callback($json);";

?>