<?php
ini_set('display_errors', 'on');
session_start();
require_once('../settings.php');

// When emulating karma, load all Highcharts files
$emulateKarma = false;


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

// A commit or tag is given, insert the full path
$commitOrTag = '/^[a-z0-9]+$/';
$githubServer = 'http://github.highcharts.com';
if (preg_match($commitOrTag, $leftPath)) {
	$leftPath = "cache.php?file=$githubServer/$leftPath";
}
if (preg_match($commitOrTag, $rightPath)) {
	$rightPath = "cache.php?file=$githubServer/$rightPath";
}

// Forced options
$overrides = Settings::$overrides;
if ($overrides && $_GET['which'] == 'left') {
	$overrides .= "\nconsole.warn('Running tests with overrides. To disable these, modify settings.php.');";
}

$leftExporting = "$leftPath/modules/exporting.src.js";
$rightExporting = "$rightPath/modules/exporting.src.js";

$leftFramework = 'jQuery';
$rightFramework = 'jQuery';


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
	global $path, $leftPath, $rightPath, $rightExporting, $leftExporting,
		$isUnitTest, $githubServer, $topDomain, $emulateKarma;
	$bogus = md5('bogus');

	
	// No idea why file_get_contents doesn't work here...
	ob_start();

	if ($emulateKarma && $isUnitTest) {
		$files = json_decode(
			file_get_contents(__DIR__ . '/../../test/karma-files.json')
		);
		$scripttags = '';

		foreach ($files as $file) {
			$file = preg_replace('/^code\//', "http://code.highcharts.$topDomain/", $file);
			$scripttags .= "<script src='$file'></script>\n";
		}

		echo '<html>
	<head>
		' . $scripttags . '
	</head>
	<body>
		<div id="qunit"></div>
		<div id="qunit-fixture"></div>

		<div id="container" style="width: 600px; margin: 0 auto"></div>
	</body>
</html>';
	} elseif (is_file("$path/demo.html")) {
		include("$path/demo.html");

	} elseif ($which === 'right') {
		echo "
			<div style='padding: 2em; text-align: center'>
				<span style='color:red'>Missing file:</span><br>
				<code style='line-height: 3em'>$path/demo.html</code><br>
				Probably the sample has been deleted but the folder structure 
				remains. This happens when deleting files from Git. The
				remaining folders can safely be removed.
			</div>
		";
	}
	
	$s = ob_get_clean();

	// Highchart 5 preview
	$s = str_replace("code.highcharts.com/5/", "code.highcharts.com/", $s);


	// for issue-by-commit
	$issueHTML = $s;
	/*$issueHTML = str_replace('https://code.highcharts.com/stock/', $githubServer . '/%s/', $issueHTML);
	$issueHTML = str_replace('https://code.highcharts.com/maps/', $githubServer . '/%s/', $issueHTML);
	$issueHTML = str_replace('https://code.highcharts.com/mapdata/', $bogus, $issueHTML);
	$issueHTML = str_replace('https://code.highcharts.com/', $githubServer . '/%s/', $issueHTML);
	$issueHTML = str_replace($bogus, 'https://code.highcharts.com/mapdata/', $issueHTML);

	$issueHTML = "<script src=\"http://code.jquery.com/jquery-1.11.0.js\"></script>\n" . $issueHTML;*/
	$_SESSION['html'] = $issueHTML;

	if (strstr($s, 'http://code.highcharts.com') || strstr($s, 'http://www.highcharts.com')) {
		$s .= "
		<script>
		window.demoError = 'Do not use http in demo.html. Use secure https. ($path)';
		throw window.demoError;
		</script>";
	}
	if (strstr($s, '.src.js') && !$emulateKarma) {
		$s .= "
		<script>
		window.demoError = 'Do not use src.js files in demos. Use .js compiled files, and add rewrite in .htaccess ($path)';
		throw window.demoError;
		</script>";
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
					$src = str_replace('.js', '.js?' . time(), $src);
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
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<title>Highcharts demo</title>
		<?php echo getFramework($_GET['which'] === 'left' ? $leftFramework : $rightFramework); ?>
		<?php echo getResources(); ?>

		<?php if (is_file("$path/unit-tests.js")) : ?>
		<script src="cache.php?file=http://code.jquery.com/qunit/qunit-<?php echo Settings::$QUnitVersion; ?>.js"></script>
		<link rel="stylesheet" type="text/css" href="cache.php?file=http://code.jquery.com/qunit/qunit-<?php echo Settings::$QUnitVersion; ?>.css" />
   		<?php endif; ?>
   		<script src="test-controller.js?1"></script>

		<link rel="stylesheet" type="text/css" href="style.css"/>
		<style type="text/css">
			<?php 
			$css = @file_get_contents("$path/demo.css");

			// Highchart 5 preview
			$css = str_replace("code.highcharts.com/5/", "code.highcharts.com/", $css);

			$css = str_replace("https://code.highcharts.com/", "http://code.highcharts.$topDomain/", $css);

			$_SESSION['css'] = $css;
			echo $_SESSION['css'];
			?>
		</style>

		<script type="text/javascript">
			var chart,
				randomValues = [0.14102989272214472, 0.0351817375048995, 0.10094573209062219, 0.35990892769768834, 0.7690574480220675, 0.16634021210484207, 0.3944594960194081, 0.7656398438848555, 0.27706647920422256, 0.5681763959582895, 0.513730650767684, 0.26344996923580766, 0.09001278411597013, 0.2977627406362444, 0.6982127586379647, 0.9593012358527631, 0.8456065070349723, 0.26248381356708705, 0.12872424302622676, 0.25530692492611706, 0.9969052199739963, 0.09259856841526926, 0.9022860133554786, 0.3393681487068534, 0.41671016393229365, 0.10582929337397218, 0.1322793234139681, 0.595869708340615, 0.050670077092945576, 0.8613549116998911, 0.17356411134824157, 0.16447093593887985, 0.44514468451961875, 0.15736589767038822, 0.8677479331381619, 0.30932203005068004, 0.6120233973488212, 0.001859797164797783, 0.7689258102327585, 0.7421043077483773, 0.7548440918326378, 0.9667320610024035, 0.13654314493760467, 0.6277681242208928, 0.002858637133613229, 0.6877673089038581, 0.44036358245648444, 0.3101970909629017, 0.013212101766839623, 0.7115063068922609, 0.2931885647121817, 0.5031651991885155, 0.8921459852717817, 0.547999506117776, 0.010382920736446977, 0.9862914837431163, 0.9629317701328546, 0.07685352209955454, 0.2859949553385377, 0.5578324059024453, 0.7765828191768378, 0.1696563793811947, 0.34366130153648555, 0.11959927808493376, 0.8898638435639441, 0.8963573810178787, 0.332408863119781, 0.27137733018025756, 0.3066735703032464, 0.2789501305669546, 0.4567076754756272, 0.09539463231340051, 0.9158625246491283, 0.2145260546822101, 0.8913846455980092, 0.22340057184919715, 0.09033847553655505, 0.49042539740912616, 0.4070818084292114, 0.5827512110117823, 0.1993762720376253, 0.9264022477436811, 0.3290765874553472, 0.07792594563215971, 0.7663758248090744, 0.4329648329876363, 0.10257583996281028, 0.8170149670913815, 0.41387700103223324, 0.7504217880778015, 0.08603733032941818, 0.17256441875360906, 0.4064991301856935, 0.829071992309764, 0.6997416105587035, 0.2686419754754752, 0.36025605257600546, 0.6014082923065871, 0.9787689209915698, 0.016065671807155013],
				randomCursor = 0,
				which = '<?php echo $_GET['which']; ?>';

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

				window.parent[which + 'Version'] = Highcharts.version;

				// If running QUnit, use the built-in callback
				if (QUnit) {
					if (navigator.userAgent.indexOf('PhantomJS') !== -1) {
						QUnit.config.notrycatch = true;
						QUnit.log(function( details ) {
							if (!details.result ) {
								var loc = details.module + ": " + details.name + ": ",
								output = "FAILED: " + loc + ( details.message ? details.message + ". " : "" );
							 
								if (details.actual) {
									output += "Expected: " + details.expected + ", actual: " + details.actual;
								}
								if (details.source) {
									output += "\n     " + details.source;
								}
								console.log( output );
							}
						});
					}

					/**
					 * Compare numbers taking in account an error.
					 * http://bumbu.me/comparing-numbers-approximately-in-qunitjs/
					 *
					 * @param  {Float} number
					 * @param  {Float} expected
					 * @param  {Float} error    Optional
					 * @param  {String} message  Optional
					 */
					QUnit.assert.close = function (number, expected, error, message) {
					    if (error === void 0 || error === null) {
					        error = 0.00001; // default error
					    }

					    var result = number === expected || (number < expected + error && number > expected - error) || false;

					    this.push(result, number, expected, message);
					};

					QUnit.done(function (e) {
						if (e.passed === e.total) {
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
							clearInterval(interval);
							
							// Automatically click buttons with classname "autocompare"
							tryToRun(function () {
								$('.autocompare').click();
							});
							window.parent.onLoadTest(which, $(chart.container).html());

						// Compare renderers
						} else if (window.renderer) {
							clearInterval(interval);

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
							window.parent.onLoadTest(which, window.renderer.box.parentNode.innerHTML);

						} else if (new Date() - start > 2000) {
							clearInterval(interval);
							window.parent.proceed();

						}

					}, 50);
				}

			}

			function compareSVG() {
				window.parent.onLoadTest(which, (chart.getSVGForExport || chart.getSVG).call(chart));
			}

			function error(e) {
				if (which === 'right') {
					e = 'ERROR (' + which + ' frame): ' + (e.message || e);
					console.error(e);
					parent.window.error = e;
					parent.window.onDifferent('Error');
				}
			}

			function tryToRun(proceed) {
				if (typeof QUnit !== 'undefined' && proceed) { // Let QUnit catch the error
					return proceed.apply(this, Array.prototype.slice.call(arguments, 1));
				}
				try {
					if (proceed) {
						return proceed.apply(this, Array.prototype.slice.call(arguments, 1));
					}
				} catch (e) {
					error(e);

				}
			}

			/**
			 * Do the required overrides and options for the charts to compare 
			 * nicely.
			 */
			function setUpHighcharts() {
				if (!window.Highcharts) {
					console.warn('Highcharts is undefined');
					window.parent.proceed();

				} else if (window.parent) {
					compareHTML();
				}

				if (window.parent && window.parent.parent) {
					$(window).bind('keydown', window.parent.parent.keyDown);
				}

				// Make sure getJSON content is not cached
				$.ajaxSetup({
					type: 'POST',
					headers: { "cache-control": "no-cache" }
				});

				if (window.Highcharts) {
					var animation = <?php echo ($isManual ? 'undefined' : 'false') ?>;


					if (window.demoError) {
						parent.window.error = window.demoError;
						parent.window.onDifferent('Error');
					}

					Highcharts.setOptions({
						exporting: {
							libURL: 'https://code.highcharts.com/lib' // Avoid the '../x.y.z-modified/lib' issue to allow for testing
						},
						chart: {
							animation: animation
						},
						plotOptions: {
							series: {
								animation: animation,
								kdNow: true,
								dataLabels: {
									defer: false
								}
							}
						},
						tooltip: {
							animation: animation
						}
					});

					<?php echo $overrides; ?>

					// Wrap constructors in order to catch JS errors
					//Highcharts.wrap(Highcharts, 'Chart', tryToRun);
					//Highcharts.wrap(Highcharts, 'StockChart', tryToRun);
					//Highcharts.wrap(Highcharts, 'Map', tryToRun);
					Highcharts.wrap(Highcharts.Chart.prototype, 'init', tryToRun);

					<?php if (getCompareTooltips()) : ?>
					// Start with tooltip open
					Highcharts.Chart.prototype.callbacks.push(function (chart) {
						var x = 2,
							series = chart.series,
							hoverPoint = series[0] && series[0].points[x],
							pointOrPoints;
						if (hoverPoint) {
							/*
							if  (chart.tooltip.options.shared) {
								pointOrPoints = [];
								Highcharts.each(series, function (s) {
									if (s.options.enableMouseTracking !== false && s.points[x]) {
										pointOrPoints.push(s.points[x]);
									}
								});
								if (pointOrPoints.length === 0) {
									pointOrPoints.push(hoverPoint);
								}
							} else {
								pointOrPoints = hoverPoint;
							}
							*/
							hoverPoint.onMouseOver();
							// Note: As of 5.0.8 onMouseOver takes care of refresh.
							//chart.tooltip.refresh(pointOrPoints);
						}
					});
					<?php endif ?>

					<?php if (file_exists("$path/test.js")) : ?>

					<?php include("$path/test.js"); ?>
					Highcharts.Chart.prototype.callbacks.push(function (chart) {
						try {
							test(chart);
						} catch (e) {
							e = 'ERROR in test.js (' + which + ' frame): ' + e.message;
							console.error(e);
							parent.window.error = e;
							parent.window.onDifferent('Error');
						}

					});
					<?php endif ?>

					<?php if (getExportInnerHTML() || getCompareTooltips()) : ?>
					// Bypass the export module
					Highcharts.Chart.prototype.getSVG = function () {
						return this.container.innerHTML
							.replace(/<\/svg>.*?$/, '</svg>'); // strip useHTML
					};
					<?php endif ?>



				}

			}

			window.isComparing = true;
			window.alert = function () {};
			window.onbeforeunload = function(){
				$(document).unbind();    //remove listeners on document
				$(document).find('*').unbind(); //remove listeners on all nodes
			}



		</script>


		<script type="text/javascript">

		// Make sure deferred errors are captured by the test runner.
		if (jQuery) {
			jQuery.readyException = error;
		}
		

		$(function () {
		<?php
			@include("$path/unit-tests.js");
		?>
		});
		</script>

	</head>
	<body>

		<?php if (is_file("$path/unit-tests.js")) { ?>
		<div id="qunit"></div>
		<div id="qunit-fixture"></div>
		<?php } ?>
<?php echo getHTML($_GET['which']); ?>

		<script>
		// Set options, overrides etc.
		setUpHighcharts();
		try {

		<?php echo getJS(); ?>

		} catch (e) {
			console.error(e.message);
			parent.window.onDifferent('Error');
		}
		</script>
	</body>
</html>
