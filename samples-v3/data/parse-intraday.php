<pre><?php

$lines = file(dirname(__FILE__) . '/AAPL.txt');

$i = sizeof ($lines) - 1000;
$data = array();


for ($i = sizeof ($lines) - 5000; $i < sizeof($lines); $i++) {
	
	$line = $lines[$i];
	
	$cells = explode(',', $line);
	$date = explode('/', $cells[0]);
	
	$date = $date[2] .'-'. $date[0] .'-'. $date[1] .' '. $cells[1];
	$timestamp = strtotime($date);
	
	if ($timestamp > strtotime('2011-10-06')) {
		if (date('G', $timestamp) > 7 && date('G', $timestamp) < 16) {
			$data[] = '['. $timestamp .'000,'. $cells[2] .','. $cells[3] .','. $cells[4] .','. $cells[5] ."]";
		}	
	}
	
	
}
$data = "[\n". join(",\n", $data)."\n]";
echo $data;

file_put_contents(dirname(__FILE__) . '/new-intraday.json', $data);

?></pre>