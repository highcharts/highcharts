<?php

	// Sets directory variable.
	$dir = 'tests-js/'.$_GET['group'];

	// Declares names array, will contain names of files.
	$files = array();

	// Filenames to ignore
	$del_vals = array(	0 => '.', 
						1 => '..'
						);

	$tmpFiles = scandir($dir);

	// Removing ignored filenames.
	foreach ($del_vals as $del_val) {
		if (($key = array_search($del_val, $tmpFiles)) !== false) {
			unset($tmpFiles[$key]);
		} 
	}

	// Sort tmp array. 
	// Only add names if group specified or folder !empty.
	foreach($tmpFiles as $tmpFile) {
		$files[] = $tmpFile;
	}

	echo json_encode($files);

?>