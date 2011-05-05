<?php 

$xml = simplexml_load_file('../build.xml');

$files = $xml->xpath('/project/target[@name="assemble"]/concat/filelist/file');

foreach ($files as $file) {
	include('parts/'. $file['name']);
}

?>