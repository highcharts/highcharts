<?php

// get the parameters

$callback = $_GET['callback'];
if (!preg_match('/^[a-zA-Z0-9]+$/', $callback)) {
	die('Invalid callback name');
}

$start = $_GET['start'];
if ($start && !preg_match('/^[0-9]+$/', $start)) {
	die("Invalid start parameter: $start");
}

$end = $_GET['end'];
if ($end && !preg_match('/^[0-9]+$/', $end)) {
	die("Invalid end parameter: $end");
}
if (!$end) $end = mktime() * 1000;



// connect to MySQL
require_once('../../configuration.php');
$conf = new JConfig();
mysql_connect($conf->host, $conf->user, $conf->password) or die(mysql_error());
mysql_select_db($conf->db) or die(mysql_error());


// set UTC time
mysql_query("SET time_zone = '+00:00'");

// set some utility variables
$range = $end - $start;
$startTime = date('Y-m-d H:i:s', $start / 1000); // JS to MySQL
$endTime = date('Y-m-d H:i:s', $end / 1000);


// two days range loads minute data
if ($range < 2 * 24 * 3600 * 1000) {
	$sql = "
		select 
			unix_timestamp(datetime) * 1000 as datetime,
			open,
			high,
			low,
			close
		from stockquotes 
		where datetime between '$startTime' and '$endTime'
		order by datetime
		limit 0, 5000
	";

	
// one month range loads hourly data
} elseif ($range < 31 * 24 * 3600 * 1000) {
	$sql = "
		select 
			unix_timestamp(date_format(datetime, '%Y-%m-%d %H:00')) * 1000 as datetime,
			min(datetime) as first,
			max(high) as high,
			min(low) as low,
			max(datetime) as last		
		from stockquotes 
		where datetime between '$startTime' and '$endTime'
		group by date_format(datetime, '%Y-%m-%d %H')
		order by datetime
		limit 0, 5000
	";
	
// one year range loads daily data
} elseif ($range < 12 * 31 * 24 * 3600 * 1000) {
	$sql = "
		select 
			unix_timestamp(date_format(datetime, '%Y-%m-%d')) * 1000 as datetime,
			min(datetime) as first,
			max(high) as high,
			min(low) as low,
			max(datetime) as last		
		from stockquotes 
		where datetime between '$startTime' and '$endTime'
		group by date_format(datetime, '%Y-%m-%d')
		order by datetime
		limit 0, 5000
	";		

// greater range loads monthly data
} else {
	$sql = "
		select 
			unix_timestamp(date_format(datetime, '%Y-%m-01')) * 1000 as datetime,
			min(datetime) as first,
			max(high) as high,
			min(low) as low,
			max(datetime) as last		
		from stockquotes 
		where datetime between '$startTime' and '$endTime'
		group by date_format(datetime, '%Y-%m')
		order by datetime
		limit 0, 5000
	";
} 
$result = mysql_query($sql) or die(mysql_error());


$rows = array();
while ($row = mysql_fetch_assoc($result)) {
	extract($row);
	
	// Get open and close in separate SQL statements. This is much faster than emulation
	// FIRST() and LAST() by running SUBSTRING_INDEX and GROUP_CONCAT, or by running
	// inner selects
	if (!isset($row['open'])) {
		$sql = "select open from stockquotes where datetime = '$first'";
		$openRow = mysql_fetch_assoc(mysql_query($sql));
		$open = $openRow['open'];
	}
	if (!isset($row['close'])) {
		$sql = "select close from stockquotes where datetime = '$last'";
		$closeRow = mysql_fetch_assoc(mysql_query($sql));
		$close = $closeRow['close'];
	}
	
	$rows[] = "[$datetime,$open,$high,$low,$close]";
}

// print it
header('Content-Type: text/javascript');

echo "/* start = $start, end = $end, \$_GET['start'] = $_GET[start], \$_GET['end'] = $_GET[end], startTime = $startTime, endTime = $endTime */";
echo $callback ."([\n" . join(",\n", $rows) ."\n]);";


?>