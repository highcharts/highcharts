<?php
require_once('functions.php');
@unlink(compareJSON());

$files = glob('cache/*');
foreach ($files as $file) {
	if (is_file($file)) {
    	unlink($file); // delete file
	}
}
?>
window.parent.location.reload();