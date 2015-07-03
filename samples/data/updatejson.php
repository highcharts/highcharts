<title>Update JSON</title>
<pre><?php

/**
 * This file is called once an hour from Pingdom.
 * It updates the example data with fresh data from the Google Finance API.
 */

$startdate = date('M+j,+Y', mktime() - 7 * 365 * 24 * 3600);
$enddate = date('M+j,+Y');

function makeJSON ($q, $startdate, $enddate, $props) {
	// load the data
	$csv = file("http://finance.google.com/finance/historical?q=$q&startdate=$startdate&enddate=$enddate&output=csv");
	$csv = array_reverse($csv);
	
	// the new files
	$arr = array();
	
	foreach ($csv as $line) {
		list ($date, $open, $high, $low, $close, $volume) = explode(',', $line);
		$date = strtotime("$date UTC");
		$thisMonth = date('M Y', $date);
		
		if (is_numeric($date)) {
			
			// add a little debug info
			$comment = '';
			if ($thisMonth != $lastMonth) { 
				$comment = "/* $thisMonth */\n";
			}
			
			// JS-ify the date 
			$date = $date * 1000;
			//$date = date("Y-m-d", $date);
			
			// clean data
			$volume = trim($volume);
			if ($open < $low || $open == '') {
				$open = $low;
			}
			if ($open < 0.01) {
				$open = 'null';
			}
			if ($high < 0.01) {
				$high = 'null';
			}
			if ($low < 0.01) {
				$low = 'null';
			}
			if ($close < 0.01) {
				$close = 'null';
			}
			
			// push it
			if ($props == 'c') {
				$arr[] = "{$comment}[$date,$close]";
			} else if ($props == 'ohlc') {
				$arr[] = "{$comment}[$date,$open,$high,$low,$close]";
				//$arr[] = "{$comment}insert into stockquotes (datetime, open, high, low, close) values('$date',$open,$high,$low,$close)";
			} else if ($props == 'ohlcv') {
				$arr[] = "{$comment}[$date,$open,$high,$low,$close,$volume]";
			} else if ($props == 'v') {
				$arr[] = "{$comment}[$date,$volume]";
			}
			
		}
		$lastMonth = $thisMonth;
	}
	
	$s = "/* $q historical OHLC data from the Google Finance API */\n[\n". join(",\n", $arr) . "\n]";
	// $s = "/* AAPL historical OHLC data from the Google Finance API */\n[\n". join(";\n", $arr) . "\n]";
	
	
	
	// write the files
	$q = strtolower($q);
	file_put_contents("$q-$props.json", $s);
	//echo $s;
}
//makeJSON('AAPL', $startdate, $enddate, 'ohlc');

makeJSON('AAPL', $startdate, $enddate, 'c');
makeJSON('AAPL', $startdate, $enddate, 'ohlc');
makeJSON('AAPL', $startdate, $enddate, 'ohlcv');
makeJSON('AAPL', $startdate, $enddate, 'v');

makeJSON('MSFT', $startdate, $enddate, 'c');
makeJSON('GOOG', $startdate, $enddate, 'c');


?></pre>