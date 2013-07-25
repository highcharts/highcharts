<?php

$leftPath = 'http://code.highcharts.com';
$rightPath = 'http://code.highcharts.local';
//$rightPath = 'http://github.highcharts.com/ce80cd29';

$leftHighcharts = "$leftPath/highcharts.js";
$rightHighcharts = "$rightPath/highcharts.js";

$leftHighchartsMore = "$leftPath/highcharts-more.js";
$rightHighchartsMore = "$rightPath/highcharts-more.js";

$leftHighstock = "$leftPath/stock/highstock.js";
$rightHighstock = "$rightPath/highstock.js";

$leftExporting = "$leftPath/modules/exporting.src.js";
$rightExporting = "$rightPath/modules/exporting.src.js";


$path = $_GET['path'];
if (!preg_match('/^[a-z\-0-9]+\/[a-z]+\/[a-z0-9\-,]+$/', $path)) {
	die ('Invalid sample path input: ' . $path);
}

$path = "../../samples/$path";


function getResources() {
	global $path;
	
	// No idea why file_get_contents doesn't work here...
	ob_start();
	include("$path/demo.details");
	$s = ob_get_clean();
	
	$html = '';
	if ($s) {
		$lines = explode("\n", $s);
		
		$run = false;
		foreach ($lines as $line) {
			if ($run && substr(trim($line), 0, 1) != '-') {
				$run = false;
			}
			
			if ($run) {
				$url = trim($line, " -\r");
				
				if (preg_match('/\.js$/', $url)) {
					$html .= "<script src='$url'></script>\n";
				} elseif (preg_match('/\.css$/', $url)) {
					$html .= "<link rel='stylesheet' href='$url'></script>\n";
				}
			}
			
			
			if (trim($line) === 'resources:') {
				$run = true;
			}
		}
	}
	return $html;
}

function getJS() {
	global $path;
	
	
	ob_start();
	include("$path/demo.js");
	$s = ob_get_clean();
	
	return $s;
}

function getHTML($which) {
	global $path, $leftHighcharts, $rightHighcharts, $leftHighstock, $rightHighstock, $leftHighchartsMore, 
		$rightHighchartsMore, $rightExporting, $leftExporting;
	
	
	// No idea why file_get_contents doesn't work here...
	ob_start();
	include("$path/demo.html");
	$s = ob_get_clean();
	
	if ($which == 'right') {
		$s = str_replace('http://code.highcharts.com/highcharts.js', $rightHighcharts, $s);
		$s = str_replace('http://code.highcharts.com/highcharts-more.js', $rightHighchartsMore, $s);
		$s = str_replace('http://code.highcharts.com/stock/highcharts-more.js', $rightHighchartsMore, $s);
		$s = str_replace('http://code.highcharts.com/stock/highstock.js', $rightHighstock, $s);
		$s = str_replace('http://code.highcharts.com/modules/exporting.js', $rightExporting, $s);
		$s = str_replace('http://code.highcharts.com/stock/modules/exporting.js', $rightExporting, $s);

		$exporting = $rightExporting;
	} else {
		$s = str_replace('http://code.highcharts.com/highcharts.js', $leftHighcharts, $s);
		$s = str_replace('http://code.highcharts.com/highcharts-more.js', $leftHighchartsMore, $s);
		$s = str_replace('http://code.highcharts.com/stock/highcharts-more.js', $leftHighchartsMore, $s);
		$s = str_replace('http://code.highcharts.com/stock/highstock.js', $leftHighstock, $s);
		$s = str_replace('http://code.highcharts.com/modules/exporting.js', $leftExporting, $s);
		$s = str_replace('http://code.highcharts.com/stock/modules/exporting.js', $leftExporting, $s);
		
		$exporting = $leftExporting;
	}
	
	if (strlen($s) > 0 && strpos($s, 'exporting.js') === false) {
		$s .= '<script src="' . $exporting . '"></script>';
	}
	
	return $s;
}


?><!DOCTYPE HTML>
<html>
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
		<title>Highcharts demo</title>
		
		<script type="text/javascript" src="http://code.jquery.com/jquery-1.7.js"></script>
		<?php echo getResources(); ?>
		
		<style type="text/css">
			<?php @include("$path/demo.css"); ?>
		</style>
		
		<script type="text/javascript">
			var chart;
			function compareHTML() {
					var start = + new Date(),
						interval;
				
					window.parent.<?php echo $_GET['which']; ?>Version = Highcharts.version;
					
					// To give Ajax some time to load, look for the chart every 50 ms for two seconds
					interval = setInterval(function() {
						chart = window.Highcharts && window.Highcharts.charts[0];
						if (chart) {
							window.parent.onLoadTest('<?php echo $_GET['which']; ?>', $(chart.container).html());
							clearInterval(interval);
							
						} else if (new Date() - start > 2000) {
							clearInterval(interval);
							window.parent.proceed();
							
						}
						
					}, 50);
				
			}

			function compareSVG() {
				window.parent.onLoadTest('<?php echo $_GET['which']; ?>', chart.getSVG());
			}

			$(function() {
				if (!window.Highcharts) {
					console.warn('Highcharts is undefined');
					window.parent.proceed();
					
				} else if (window.parent) {
					compareHTML();			
				}
			});
			
			// Disable animation
			$(function () {
				if (window.Highcharts) {
					Highcharts.setOptions({
						chart: {
							animation: false
						},
						plotOptions: {
							series: {
								animation: false,
								marker: {
									lineWidth: 1
								},
								borderWidth: 1
							}
						}
							
					});
				}
			});
			
			window.alert = function () {}
		</script>
		
		
		<script type="text/javascript">
		<?php echo getJS(); ?>
		</script>
		
	</head>
	<body style="margin: 0"><?php echo getHTML($_GET['which']); ?></body>
</html>
