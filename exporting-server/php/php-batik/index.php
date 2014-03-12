<?php
/**
 * This file is part of the exporting module for Highcharts JS.
 * www.highcharts.com/license
 * 
 *  
 * Available POST variables:
 *
 * $filename  string   The desired filename without extension
 * $type      string   The MIME type for export. 
 * $width     int      The pixel width of the exported raster image. The height is calculated.
 * $svg       string   The SVG source code to convert.
 */


// Options
define ('BATIK_PATH', 'batik-rasterizer.jar');

///////////////////////////////////////////////////////////////////////////////
ini_set('magic_quotes_gpc', 'off');

$type = $_POST['type'];
$svg = (string) $_POST['svg'];
$filename = (string) $_POST['filename'];

// prepare variables
if (!$filename or !preg_match('/^[A-Za-z0-9\-_ ]+$/', $filename)) {
	$filename = 'chart';
}
if (get_magic_quotes_gpc()) {
	$svg = stripslashes($svg);	
}

// check for malicious attack in SVG
if(strpos($svg,"<!ENTITY") !== false || strpos($svg,"<!DOCTYPE") !== false){
	exit("Execution is topped, the posted SVG could contain code for a malicious attack");
}

$tempName = md5(rand());

// allow no other than predefined types
if ($type == 'image/png') {
	$typeString = '-m image/png';
	$ext = 'png';
	
} elseif ($type == 'image/jpeg') {
	$typeString = '-m image/jpeg';
	$ext = 'jpg';

} elseif ($type == 'application/pdf') {
	$typeString = '-m application/pdf';
	$ext = 'pdf';

} elseif ($type == 'image/svg+xml') {
	$ext = 'svg';

} else { // prevent fallthrough from global variables
	$ext = 'txt';
}

$outfile = "temp/$tempName.$ext";

if (isset($typeString)) {
	
	// size
	$width = '';
	if ($_POST['width']) {
		$width = (int)$_POST['width'];
		if ($width) $width = "-w $width";
	}

	// generate the temporary file
	if (!file_put_contents("temp/$tempName.svg", $svg)) { 
		die("Couldn't create temporary file. Check that the directory permissions for
			the /temp directory are set to 777.");
	}
	
	// do the conversion
	$output = shell_exec("java -jar ". BATIK_PATH ." $typeString -d $outfile $width temp/$tempName.svg");
	
	// catch error
	if (!is_file($outfile) || filesize($outfile) < 10) {
		echo "<pre>$output</pre>";
		echo "Error while converting SVG. ";
		
		if (strpos($output, 'SVGConverter.error.while.rasterizing.file') !== false) {
			echo "
			<h4>Debug steps</h4>
			<ol>
			<li>Copy the SVG:<br/><textarea rows=5>" . htmlentities(str_replace('>', ">\n", $svg)) . "</textarea></li>
			<li>Go to <a href='http://validator.w3.org/#validate_by_input' target='_blank'>validator.w3.org/#validate_by_input</a></li>
			<li>Paste the SVG</li>
			<li>Click More Options and select SVG 1.1 for Use Doctype</li>
			<li>Click the Check button</li>
			</ol>";
		}
	} 
	
	// stream it
	else {
		header("Content-Disposition: attachment; filename=\"$filename.$ext\"");
		header("Content-Type: $type");
		echo file_get_contents($outfile);
	}
	
	// delete it
	unlink("temp/$tempName.svg");
	unlink($outfile);

// SVG can be streamed directly back
} else if ($ext == 'svg') {
	header("Content-Disposition: attachment; filename=\"$filename.$ext\"");
	header("Content-Type: $type");
	echo $svg;
	
} else {
	echo "Invalid type";
}
?>
