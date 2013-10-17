<?php

$leftPath = 'http://code.highcharts.com';
$rightPath = 'http://code.highcharts.local';
//$rightPath = 'http://github.highcharts.com/ce80cd29';

$leftExporting = "$leftPath/modules/exporting.src.js";
$rightExporting = "$rightPath/modules/exporting.src.js";

$leftFramework = 'jQuery';
$rightFramework = 'jQuery';


$path = $_GET['path'];
if (!preg_match('/^[a-z\-0-9]+\/[a-z\-]+\/[a-z0-9\-,]+$/', $path)) {
	die ('Invalid sample path input: ' . $path);
}

$path = "../../samples/$path";

require_once('functions.php');

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
	global $path, $leftPath, $rightPath, $rightExporting, $leftExporting;
	
	
	// No idea why file_get_contents doesn't work here...
	ob_start();
	include("$path/demo.html");
	$s = ob_get_clean();
	
	if ($which == 'left') {
		$s = str_replace('http://code.highcharts.com', $leftPath, $s);
		$exporting = $rightExporting;
		
	} else {
		
		$s = str_replace('http://code.highcharts.com', $rightPath, $s);
		$exporting = $leftExporting;
	}
	
	if (strlen($s) > 0 && strpos($s, 'exporting.js') === false) {
		$s .= '<script src="' . $exporting . '"></script>';
	}
	
	return $s;
}

function getCompareTooltips() {
	global $path;
	// No idea why file_get_contents doesn't work here...
	ob_start();
	include("$path/demo.details");
	$yaml = ob_get_clean();

	return strstr($yaml, 'compareTooltips: true');
}


?><!DOCTYPE HTML>
<html>
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
		<title>Highcharts demo</title>
		
		<?php echo getFramework($_GET['which'] === 'left' ? $leftFramework : $rightFramework); ?>
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

							// Automatically click buttons with classname "autocompare"
							$('.autocompare').click();

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

				<?php if (getCompareTooltips()) : ?>
				// Start with tooltip open 
				Highcharts.Chart.prototype.callbacks.push(function (chart) {
					if (chart.series[0] && chart.series[0].points[2]) {
						chart.tooltip.refresh(
							chart.tooltip.options.shared ? 
								[chart.series[0].points[2]] :
								chart.series[0].points[2]
						);
					}
				});
				<?php endif ?>

			});
			
			window.alert = function () {}
		</script>
		
		
		<script type="text/javascript">
		<?php echo getJS(); ?>
		</script>
		
	</head>
	<body style="margin: 0">

<?php echo getHTML($_GET['which']); ?>


	</body>
</html>
