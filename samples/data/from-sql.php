<?php

// get the parameters

$callback = $_GET['callback'];
if (!preg_match('/^[a-zA-Z0-9_]+$/', $callback)) {
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

// find the right table
// two days range loads minute data
if ($range < 2 * 24 * 3600 * 1000) {
	$table = 'stockquotes';
	
// one month range loads hourly data
} elseif ($range < 31 * 24 * 3600 * 1000) {
	$table = 'stockquotes_hour';
	
// one year range loads daily data
} elseif ($range < 12 * 31 * 24 * 3600 * 1000) {
	$table = 'stockquotes_day';

// greater range loads monthly data
} else {
	$table = 'stockquotes_month';
} 


$sql = "
	select 
		unix_timestamp(datetime) * 1000 as datetime,
		open,
		high,
		low,
		close
	from $table 
	where datetime between '$startTime' and '$endTime'
	order by datetime
	limit 0, 5000
";

$result = mysql_query($sql) or die(mysql_error());


$rows = array();
while ($row = mysql_fetch_assoc($result)) {
	extract($row);
	
	$rows[] = "[$datetime,$open,$high,$low,$close]";
}

// print it
header('Content-Type: text/javascript');

echo "/* start = $start, end = $end, \$_GET['start'] = $_GET[start], \$_GET['end'] = $_GET[end], startTime = $startTime, endTime = $endTime */";
echo $callback ."([\n" . join(",\n", $rows) ."\n]);";


?>