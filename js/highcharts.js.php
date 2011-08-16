<?php

/**
 * This file concatenates the part files and returns the result based on the setup in /build.xml
 */

$xml = simplexml_load_file('../build.xml');

$files = $xml->xpath('/project/target[@name="assemble"]/concat/filelist/file');

foreach ($files as $file) {
	include('parts/'. $file['name']);
}

?>