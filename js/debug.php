<?php
header("HTTP/1.1 200 OK");
header('Content-Type: text/javascript');

/**
 * This file concatenates the part files and returns the result based on the setup in /build.xml
 */
$target = $_GET['target'];
$partsDir = 'parts/';

if ($target == 'highchartsmore') {
	$partsDir = 'parts-more/';

} else if ($target == 'highmaps') {
	$partsDir = '';
}

if ($target == 'highcharts3d') {
	$partsDir = 'parts-3d/';
}

if ($target) {
	$xml = simplexml_load_file('../build.xml');

	$files = $xml->xpath("/project/target[@name=\"set.properties\"]/filelist[@id=\"$target.files\"]/file");

	echo "window.console && console.log('Running $target.js from parts');\n";
	foreach ($files as $file) {
		include($partsDir . $file['name']);
	}

} else { // mapdata for instance
	echo file_get_contents('http://code.highcharts.com' . $_SERVER['REQUEST_URI']);
}

?>