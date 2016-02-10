<?php
ini_set('display_errors', 'on');
session_start();
require_once('../settings.php');

// Server variables
$httpHost = $_SERVER['HTTP_HOST'];
$httpHost = explode('.', $httpHost);
$topDomain = $httpHost[sizeof($httpHost) - 1];

if (isset($_GET['commit'])) {
	$leftPath = $_GET['commit']; // used by PhantomJS command line
} elseif (isset($_SESSION['leftPath'])) {
	$leftPath = $_SESSION['leftPath'];
} else {
	$leftPath = Settings::$leftPath;
}

if (isset($_GET['rightcommit'])) {
	$rightPath = $_GET['rightcommit']; // used by issue-by-commit link
} else {
	$rightPath = vsprintf(isset($_SESSION['rightPath']) ? $_SESSION['rightPath'] : Settings::$rightPath, $topDomain);
}

// A commit is given, insert the full path
if (preg_match('/^[a-z0-9]+$/', $leftPath)) {
	$leftPath = "cache.php?file=http://github.highcharts.com/$leftPath";
}
if (preg_match('/^[a-z0-9]+$/', $rightPath)) {
	$rightPath = "cache.php?file=http://github.highcharts.com/$rightPath";
}


$leftExporting = "$leftPath/modules/exporting.src.js";
$rightExporting = "$rightPath/modules/exporting.src.js";

$leftFramework = 'jQuery';
$rightFramework = 'jQuery';

$path = $_GET['path'];
if (!preg_match('/^[a-z\-0-9]+\/[a-z0-9\-\.]+\/[a-z0-9\-,]+$/', $path)) {
	die ('Invalid sample path input: ' . $path);
}

$details = @file_get_contents("../../samples/$path/demo.details");
$isUnitTest = file_exists("../../samples/$path/unit-tests.js") || strstr($details, 'qunit') ? true : false;
$isManual = (strstr($details, 'requiresManualTesting: true') !== false);


$path = "../../samples/$path";

require_once('functions.php');

// Rewrite all external files to load via cache.php
function cachify($s) {

	$s = preg_replace('/(src|href)="([^"]+)"/', '$1="cache.php?file=$2"', $s);
	return $s;
}

function getResources() {
	global $path;
	
	// No idea why file_get_contents doesn't work here...
	ob_start();
	@include("$path/demo.details");
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
					$html .= "<script src=\"$url\"></script>\n";
				} elseif (preg_match('/\.css$/', $url)) {
					$html .= "<link rel=\"stylesheet\" href=\"$url\"></script>\n";
				}
			}
			
			
			if (trim($line) === 'resources:') {
				$run = true;
			}
		}
	}
	return cachify($html);
}

function getJS() {
	global $path, $topDomain;
	
	
	ob_start();
	include("$path/demo.js");
	$s = ob_get_clean();
	$_SESSION['js'] = $s; // for issue-by-commit


	// Use local data
	$s = str_replace('http://www.highcharts.com/samples/data', "http://www.highcharts.$topDomain/samples/data", $s);
	
	return cachify($s);
}

function getHTML($which) {
	global $path, $leftPath, $rightPath, $rightExporting, $leftExporting, $isUnitTest;
	$bogus = md5('bogus');
	
	// No idea why file_get_contents doesn't work here...
	ob_start();
	include("$path/demo.html");
	$s = ob_get_clean();

	// for issue-by-commit
	$issueHTML = $s;
	$issueHTML = str_replace('https://code.highcharts.com/stock/', 'http://github.highcharts.com/%s/', $issueHTML);
	$issueHTML = str_replace('https://code.highcharts.com/maps/', 'http://github.highcharts.com/%s/', $issueHTML);
	$issueHTML = str_replace('https://code.highcharts.com/mapdata/', $bogus, $issueHTML);
	$issueHTML = str_replace('https://code.highcharts.com/', 'http://github.highcharts.com/%s/', $issueHTML);
	$issueHTML = str_replace($bogus, 'https://code.highcharts.com/mapdata/', $issueHTML);
	
	$issueHTML = "<script src=\"http://code.jquery.com/jquery-1.11.0.js\"></script>\n" . $issueHTML;
	$_SESSION['html'] = $issueHTML;

	if (strstr($s, 'http://')) {
		$s .= '<script>console.warn("Do not use http in demo.html. Use secure https.")</script>';
	}
	if (strstr($s, '.src.js')) {
		$s .= '<script>console.warn("Do not use src.js files in demos. Use .js compiled files.")</script>';
	}

	$s = cachify($s);

	$s = str_replace('cache.php?file=https://code.highcharts.com/mapdata', $bogus, $s);
	
	if ($which == 'left') {
		$s = str_replace('cache.php?file=https://code.highcharts.com', $leftPath, $s);
		$exporting = $leftExporting;
		
	} else {
		if (strstr($rightPath, 'github') !== false) {
			$s = str_replace('cache.php?file=https://code.highcharts.com', $rightPath, $s);
		} else {
			// These are the files we want to test. Append a time stamp to ensure we're not loading
			// from browser cache.
			$s = preg_replace_callback(
				'/cache\.php\?file=https:\/\/code\.highcharts\.com([a-z\/\-\.]+)/',
				function ($matches) {
					global $rightPath;
					$src = $rightPath . $matches[1];
					$src = str_replace('.js', '.js?' . mktime(), $src);
					return $src;
				},
				$s
			);
		}
		
		$exporting = $rightExporting;
	}

	$s = str_replace($bogus, 'cache.php?file=https://code.highcharts.com/mapdata', $s);
	
	// If the export module is not loaded, add it so we can run compare
	if (strlen($s) > 0 && strpos($s, 'exporting.js') === false && !$isUnitTest) {
		$s .= '<script src="' . $exporting . '"></script>';
	}
	
	return $s;
}

function getCompareTooltips() {
	global $path;
	// No idea why file_get_contents doesn't work here...
	ob_start();
	@include("$path/demo.details");
	$yaml = ob_get_clean();

	return strstr($yaml, 'compareTooltips: true');
}
function getExportInnerHTML() {
	global $path;
	// No idea why file_get_contents doesn't work here...
	ob_start();
	@include("$path/demo.details");
	$yaml = ob_get_clean();

	return strstr($yaml, 'exportInnerHTML: true');
}


?><!DOCTYPE HTML>
<html>
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
		<title>Highcharts demo</title>
		<?php echo getFramework($_GET['which'] === 'left' ? $leftFramework : $rightFramework); ?>
		<?php echo getResources(); ?>

		<?php if (is_file("$path/unit-tests.js")) : ?>
		<script src="cache.php?file=http://code.jquery.com/qunit/qunit-1.19.0.js"></script>
   		<link rel="stylesheet" type="text/css" href="cache.php?file=http://code.jquery.com/qunit/qunit-1.19.0.css" />		
   		<?php endif; ?>

		<link rel="stylesheet" type="text/css" href="style.css"/>
		<style type="text/css">
			<?php 
			$_SESSION['css'] = @file_get_contents("$path/demo.css");
			echo $_SESSION['css'];
			?>
		</style>
		
		<script type="text/javascript">
			var chart,
				randomValues = [0.14102989272214472, 0.0351817375048995, 0.10094573209062219, 0.35990892769768834, 0.7690574480220675, 0.16634021210484207, 0.3944594960194081, 0.7656398438848555, 0.27706647920422256, 0.5681763959582895, 0.513730650767684, 0.26344996923580766, 0.09001278411597013, 0.2977627406362444, 0.6982127586379647, 0.9593012358527631, 0.8456065070349723, 0.26248381356708705, 0.12872424302622676, 0.25530692492611706, 0.9969052199739963, 0.09259856841526926, 0.9022860133554786, 0.3393681487068534, 0.41671016393229365, 0.10582929337397218, 0.1322793234139681, 0.595869708340615, 0.050670077092945576, 0.8613549116998911, 0.17356411134824157, 0.16447093593887985, 0.44514468451961875, 0.15736589767038822, 0.8677479331381619, 0.30932203005068004, 0.6120233973488212, 0.001859797164797783, 0.7689258102327585, 0.7421043077483773, 0.7548440918326378, 0.9667320610024035, 0.13654314493760467, 0.6277681242208928, 0.002858637133613229, 0.6877673089038581, 0.44036358245648444, 0.3101970909629017, 0.013212101766839623, 0.7115063068922609, 0.2931885647121817, 0.5031651991885155, 0.8921459852717817, 0.547999506117776, 0.010382920736446977, 0.9862914837431163, 0.9629317701328546, 0.07685352209955454, 0.2859949553385377, 0.5578324059024453, 0.7765828191768378, 0.1696563793811947, 0.34366130153648555, 0.11959927808493376, 0.8898638435639441, 0.8963573810178787, 0.332408863119781, 0.27137733018025756, 0.3066735703032464, 0.2789501305669546, 0.4567076754756272, 0.09539463231340051, 0.9158625246491283, 0.2145260546822101, 0.8913846455980092, 0.22340057184919715, 0.09033847553655505, 0.49042539740912616, 0.4070818084292114, 0.5827512110117823, 0.1993762720376253, 0.9264022477436811, 0.3290765874553472, 0.07792594563215971, 0.7663758248090744, 0.4329648329876363, 0.10257583996281028, 0.8170149670913815, 0.41387700103223324, 0.7504217880778015, 0.08603733032941818, 0.17256441875360906, 0.4064991301856935, 0.829071992309764, 0.6997416105587035, 0.2686419754754752, 0.36025605257600546, 0.6014082923065871, 0.9787689209915698, 0.016065671807155013],
				randomCursor = 0;

			Math.random = function () {
				var ret = randomValues[randomCursor];
				randomCursor++;
				if (randomCursor >= randomValues.length) {
					randomCursor = 0;
				}
				return ret;
			};

			function compareHTML() {
				var start = + new Date(),
					interval,
					QUnit = window.QUnit;
			
				window.parent.<?php echo $_GET['which']; ?>Version = Highcharts.version;

				// If running QUnit, use the built-in callback
				if (QUnit) {
					QUnit.done(function (e) {
						if (e.total === 0) {
							window.parent.onDifferent('Error');
							console.warn('No unit tests ran');
						} else if (e.passed === e.total) {
							window.parent.onIdentical();
						} else {
							window.parent.onDifferent(e.passed + '/' + e.total);
						}
					});

				// Else, prepare for async
				} else {
				
					// To give Ajax some time to load, look for the chart every 50 ms for two seconds
					interval = setInterval(function() {
						chart = window.Highcharts && window.Highcharts.charts[0],
						QUnit = window.QUnit;

						// Compare chart objects
						if (chart) {

							// Automatically click buttons with classname "autocompare"
							tryToRun(function () {
								$('.autocompare').click();
							});

							window.parent.onLoadTest('<?php echo $_GET['which']; ?>', $(chart.container).html());
							clearInterval(interval);
							
						// Compare renderers
						} else if (window.renderer) {
	
							// Automatically click buttons with classname "autocompare"
							tryToRun(function () {
								$('.autocompare').click();
							});

							// Create a mock chart object with a getSVG method
							chart = {
								getSVG: function () {
									return window.renderer.box.parentNode.innerHTML;
								}
							};
							window.parent.onLoadTest('<?php echo $_GET['which']; ?>', window.renderer.box.parentNode.innerHTML);
							clearInterval(interval);

						} else if (new Date() - start > 2000) {
							clearInterval(interval);
							window.parent.proceed();
							
						}
						
					}, 50);
				}
				
			}

			function compareSVG() {
				window.parent.onLoadTest('<?php echo $_GET['which']; ?>', (chart.getSVGForExport || chart.getSVG).call(chart));
			}

			function tryToRun(proceed) {
				try {
					if (proceed) {
						return proceed.apply(this, Array.prototype.slice.call(arguments, 1));
					}
				} catch (e) {
					e = 'ERROR (<?php echo $_GET['which']; ?> frame): ' + e.message;
					console.error(e);
					parent.window.error = e;
					parent.window.onDifferent('Error');

				}
			}

			$(function() {
				if (!window.Highcharts) {
					console.warn('Highcharts is undefined');
					window.parent.proceed();
					
				} else if (window.parent) {
					compareHTML();			
				}

				// Make sure getJSON content is not cached
				$.ajaxSetup({
					type: 'POST',
					headers: { "cache-control": "no-cache" }
				});

				if (window.Highcharts) {
					var animation = <?php echo ($isManual ? 'undefined' : 'false') ?>;
					Highcharts.setOptions({
						chart: {
							animation: animation
						},
						plotOptions: {
							series: {
								animation: animation,
								kdNow: true,
								kdSync: true // 4.1.9 and older, remove when not testing against those
							}
						},
						tooltip: {
							animation: animation
						}
					});

					// Wrap constructors in order to catch JS errors
					//Highcharts.wrap(Highcharts, 'Chart', tryToRun);
					//Highcharts.wrap(Highcharts, 'StockChart', tryToRun);
					//Highcharts.wrap(Highcharts, 'Map', tryToRun);
					Highcharts.wrap(Highcharts.Chart.prototype, 'init', tryToRun);					

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
					
					<?php if (file_exists("$path/test.js")) : ?>

					<?php include("$path/test.js"); ?>
					Highcharts.Chart.prototype.callbacks.push(function (chart) {
						try {
							test(chart);
						} catch (e) {
							e = 'ERROR in test.js (<?php echo $_GET['which'] ?> frame): ' + e.message;
							console.error(e);
							parent.window.error = e;
							parent.window.onDifferent('Error');
						}

					});
					<?php endif ?>

					<?php if (getExportInnerHTML()) : ?>
					// Bypass the export module
					Highcharts.Chart.prototype.getSVG = function () {
						return this.container.innerHTML
							.replace(/<\/svg>.*?$/, '</svg>'); // strip useHTML
					};
					<?php endif ?>



				}

			});
			
			window.isComparing = true;
			window.alert = function () {};
			window.onbeforeunload = function(){
				$(document).unbind().die();    //remove listeners on document
				$(document).find('*').unbind().die(); //remove listeners on all nodes
			}


			
		</script>
		
		
		<script type="text/javascript">
		try {

		<?php echo getJS(); ?>
		
		} catch (e) {
			console.error(e.message);
			parent.window.onDifferent('Error');
		}

		$(function () {
		<?php
			@include("$path/unit-tests.js");
		?>
		});
		</script>
		
	</head>
	<body>

		<div id="qunit"></div>
		<div id="qunit-fixture"></div>
<?php echo getHTML($_GET['which']); ?>

	</body>
</html>
