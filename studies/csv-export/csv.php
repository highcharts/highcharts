<?php

/**
 * DISCLAIMER: Don't use www.highcharts.com/studies/csv-export/csv.php in 
 * production! This file may be removed at any time.
 */

$csv = $_POST['csv'];

if ($csv) {
	header('Content-type: text/csv');
	header('Content-disposition: attachment;filename=chart.csv');
	echo $csv;
}

?>