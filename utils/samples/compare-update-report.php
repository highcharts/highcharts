<?php
require_once('functions.php');
$path = isset($_GET['path']) ? $_GET['path'] : $path;
$diff = isset($_GET['diff']) ? $_GET['diff'] : @$difference['dissimilarityIndex'];

$tempFile = 'temp/compare.json';
$compare = file_exists($tempFile) ? json_decode(file_get_contents($tempFile)) : new stdClass;
$browser = getBrowser();
$key = isset($browser['parent']) ? $browser['parent'] : 'Unknown';


/*
if (isset($compare->$path->$key) && isset($difference)) {  
	$difference['reference'] = $compare->$path->$key;
	error_log('first case');
} else
*/
if (isset($diff)) {
	@$compare->$path->$key = $diff;
}
file_put_contents($tempFile, json_encode($compare));
?>