<?php

/**
 * DISCLAIMER: Don't use www.highcharts.com/studies/csv-export/csv.php in 
 * production! This file may be removed at any time.
 */

$csv = $_POST['csv'];
$filename = $_POST['filename'] ? $_POST['filename'] : 'chart';

if ($csv) {
	header('Content-type: text/csv');
	header('Content-disposition: attachment;filename='.$filename.'.csv');
	echo $csv;
}

?>
