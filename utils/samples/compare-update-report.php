<?php
session_start();
require_once('functions.php');
$path = isset($_GET['path']) ? $_GET['path'] : $path;
$diff = isset($_GET['diff']) ? $_GET['diff'] : @$difference['dissimilarityIndex'];
$rightcommit = @$_GET['rightcommit'];
$commit = @$_GET['commit'];

$reportFile = compareJSON();
// Commit-specific reports go in a separate file
if ($rightcommit) {
	$reportFile = 'temp/compare-' . $rightcommit . '.json';
}

$compare = file_exists($reportFile) ? json_decode(file_get_contents($reportFile)) : new stdClass;


/*
if (isset($compare->$path->$key) && isset($difference)) {  
	$difference['reference'] = $compare->$path->$key;
	error_log('first case');
} else
*/
if (isset($diff)) {
	@$compare->$path->diff = $diff;
}
if (!is_dir('temp')) {
	mkdir('temp');
}
file_put_contents($reportFile, json_encode($compare, JSON_PRETTY_PRINT));
?>