<pre><?php

$lines = file(dirname(__FILE__) . '/AAPL.txt');

$i = 0;
$data = '';

foreach ($lines as $line) {
	
	$cells = explode(',', $line);
	$date = explode('/', $cells[0]);
	
	$date = $date[2] .'-'. $date[0] .'-'. $date[1] .' '. $cells[1];
	
	$data .= $date .';'. $cells[2] .';'. $cells[3] .';'. $cells[4] .';'. $cells[5] .';'. $cells[6];
	
	$i++;
	if ($i % 10000 == 0) echo "$i lines parsed...\n";
	//if ($i > 100) break;
}

echo "\n$i lines parsed in total";

file_put_contents(dirname(__FILE__) . '/AAPL.csv', $data);

?></pre>