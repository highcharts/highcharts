<?php

session_start();

define('FRAMEWORK', 'jQuery');

require_once('functions.php');

if (isset($_GET['styled'])) {
	$_SESSION['styled'] = $_GET['styled'] == 'true' ? true : false;
}
$styled = @$_SESSION['styled'];

// Emulate legacy canvas boost
$boostCanvas = false;


$httpHost = $_SERVER['HTTP_HOST'];
$httpHost = explode('.', $httpHost);
$topDomain = $httpHost[sizeof($httpHost) - 1];


// Get HTML and use dev server
ob_start();
@include("$path/demo.html");
$html = ob_get_clean();

if ($boostCanvas) {
	$html = str_replace(
		'<script src="https://code.highcharts.com/modules/boost.js"></script>',

		'<script>delete window.WebGLRenderingContext</script>' .
		'<script src="https://code.highcharts.com/modules/boost-canvas.js"></script>' .
		'<script src="https://code.highcharts.com/modules/boost.js"></script>',
		$html
	);
}

$html = str_replace('https://code.highcharts.com/', "http://code.highcharts.$topDomain/", $html);


if (strstr($html, "/code.highcharts.$topDomain/mapdata")) {
	$html = str_replace("/code.highcharts.$topDomain/mapdata", "/code.highcharts.com/mapdata", $html);
} else {
	$time = time();
	$html = str_replace('.js"', '.js?' . $time . '"', $html); // Force no-cache for debugging
	$html = str_replace('.css"', '.css?' . $time . '"', $html); // Force no-cache for debugging

	// No go on github.highcharts.com
	$html = str_replace("sonification.js?$time", 'sonification.js', $html);
}



// Get CSS and use dev server
ob_start();
@include("$path/demo.css");
$css = ob_get_clean();
$css = str_replace('https://code.highcharts.com/', "http://code.highcharts.$topDomain/", $css);

// Styled mode
if ($styled) {
	$html = str_replace("code.highcharts.$topDomain/js/", "code.highcharts.$topDomain/", $html); // some to classic
	$html = str_replace("code.highcharts.$topDomain/", "code.highcharts.$topDomain/js/", $html); // all to styled
	$css = "@import 'http://code.highcharts.$topDomain/css/highcharts.css';";
}

// Old IE
/*
$html .= "
<!--[if lt IE 9]>
<script src='http://code.highcharts.$topDomain/modules/oldie.js'></script>
<![endif]-->
";
// */


// Handle themes
if (isset($_POST['theme'])) {
	$_SESSION['theme'] = $_POST['theme'];	
}
if (@$_SESSION['theme']) {
	$html .= "<script src='http://code.highcharts.$topDomain/themes/". $_SESSION['theme'] .".js'></script>";
}
$themes = array(
	'' => 'Default theme',
	'sand-signika' => 'Sand Signika',
	'dark-unica' => 'Dark Unica',
	'grid-light' => 'Grid Light'
);


function getResources() {
    global $path, $styled, $topDomain;

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
                    $html .= "<script src='$url'></script>\n";
                } elseif (preg_match('/\.css$/', $url)) {
                    $html .= "<link type='text/css' rel='stylesheet' href='$url' />\n";
                }
            }


            if (trim($line) === 'resources:') {
                $run = true;
            }
        }
    }


    return $html;
}


?><!DOCTYPE HTML>
<html>
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
		<title>Sample viewer - Highcharts</title>
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<?php echo getFramework(FRAMEWORK); ?>
		<?php echo getResources(); ?>
		<?php if ($isUnitTest) { ?>
		<script src="test-controller.js"></script>
		<?php } ?>
		<link rel="stylesheet" type="text/css" href="style.css"/>


		<script type="text/javascript">
		/* eslint-disable */
		var sampleIndex,
			path = '<?php echo $path ?>'.replace('../../samples/', ''),
			browser = <?php echo json_encode(getBrowser()); ?>,
			controller = window.parent && window.parent.controller;

		(function () {


			if (typeof $ === 'undefined') {
				window.onload = function () {
					document.getElementById('container').innerHTML = 
						'<div style="margin-top: 150px; text-align: center"><h3 style="font-size: 2em; color: red">' +
						'jQuery is missing</h3><p>Check your settings in <code>settings.php</code>.</div>';
				};
				return;
			}

			
			$(function() {


				if (typeof Highcharts === 'undefined' && !document.getElementById('container')) {
					window.onload = function () {
						document.body.innerHTML = 
							'<div style="margin-top: 150px; text-align: center"><h3 style="font-size: 2em; color: red">' +
							'Highcharts and container are missing</h3><p>Most likely this sample does not exist.</div>';
					};
					return;
				}

				if (controller) {
					$('#bisect').click(controller.toggleBisect);
				}

				if (typeof Highcharts !== 'undefined') {
					$('#version').html(Highcharts.product + ' ' + Highcharts.version +
						' / ' + browser.parent);
				}

				if (window.parent.frames[0]) {

					if (window.parent.history.pushState) {
						window.parent.history.pushState(null, null, '#view/' + path);
					}
					
					var contentDoc = window.parent.frames[0].document;

					sampleIndex = window.parent.frames[0].samples.indexOf &&
						window.parent.frames[0].samples.indexOf(path);

					// Highlight the current sample in the left
					var li = contentDoc.getElementById('li' + sampleIndex);
					if (li) {
						// previous
						if (contentDoc.currentLi) {
							$(contentDoc.currentLi).removeClass('hilighted');
							$(contentDoc.currentLi).addClass('visited');
						}

						$('html,body', contentDoc).animate({
							scrollTop: $(li).offset().top - 300
						},'slow');

						contentDoc.currentLi = li;
						$(li).addClass('hilighted');
					}

					// add the next button
					if (contentDoc.getElementById('i' + (sampleIndex + 1))) {
						
						$('#next').click(function() {
							next();
						});
						$('#next')[0].disabled = false;
					}
				}

				// Activate view source button
				$('#view-source').bind('click', function () {
					var checked;

					$(this).toggleClass('active');

					checked = $(this).hasClass('active')
					
					$('#source-box').css({
						width: checked ? '50%' : 0
					});
					$('#main-content').css({
						width: checked ? '50%' : '100%'
					});
					if (typeof Highcharts !== 'undefined') {
						$.each(Highcharts.charts, function () {
							this.reflow();
						});
					}

					if (checked) {
						$('<iframe>').appendTo('#source-box')
							.attr({
								src: 'view-source.php?path=' + path
							})
							.css({
								width: '100%',
								border: 'none',
								borderRight: '1px solid gray',
								height: $(document).height() - 80
							});
					} else {
						$('#source-box').html('');
					}
				});
				contentDoc = null;

			});
		}());
		</script>
		<script>
		if (window.console) {
			console.clear();
		}
		function next() {
			var a = window.parent.frames[0].document.getElementById('i' + (sampleIndex + 1));
			if (a) {
				window.location.href = a.href;
			}
		}
		function previous() {
			var a = window.parent.frames[0].document.getElementById('i' + (sampleIndex - 1));
			if (a) {
				window.location.href = a.href;
			}
		}

		if (jQuery) {
			jQuery.readyException = function (error) {
				throw error;
			};
		}
		// Wrappers for recording mouse events in order to write automatic tests 
		
		function setUp() {

			$(window).bind('keydown', parent.keyDown);
			
			var checkbox = $('#record')[0],
				pre = $('pre#recording')[0];
			if (typeof Highcharts !== 'undefined') {
				Highcharts.wrap(Highcharts.Pointer.prototype, 'onContainerMouseDown', function (proceed, e) {
					if (checkbox.checked) {
						pre.innerHTML += "chart.pointer.onContainerMouseDown({\n"+
							"	type: 'mousedown',\n" +
							"	pageX: " + e.pageX + ",\n" + 
							"	pageY: " + e.pageY + "\n" + 
							"});\n\n";
					}
					return proceed.call(this, e);
				});
				Highcharts.wrap(Highcharts.Pointer.prototype, 'onContainerMouseMove', function (proceed, e) {
					if (checkbox.checked) {
						pre.innerHTML += "chart.pointer.onContainerMouseMove({\n"+
							"	type: 'mousemove',\n" +
							"	pageX: " + e.pageX + ",\n" + 
							"	pageY: " + e.pageY + ",\n" +  
							"	target: chart.container\n" + 
							"});\n\n";
					}
					return proceed.call(this, e);
				});
				Highcharts.wrap(Highcharts.Pointer.prototype, 'onDocumentMouseUp', function (proceed, e) {
					if (checkbox.checked) {
						pre.innerHTML += "chart.pointer.onContainerMouseMove({\n"+
							"	type: 'mouseup'\n" + 
							"});\n\n";
					}
					return proceed.call(this, e);
				});

				Highcharts.setOptions({
					exporting: {
						// Avoid versioning
						// libURL: 'https://code.highcharts.com/lib'
						libURL: 'http://rawgithub.local/highcharts/vendor'
					}
				});
			}
		

			<?php if (@$_GET['profile']) : ?>
			if (typeof Highcharts !== 'undefined') {
				Highcharts.wrap(Highcharts.Chart.prototype, 'init', function (proceed) {
					var chart,
						start;

					// Start profile
					if (window.console && console.profileEnd) {
						console.profile('<?php echo $path ?>');
					}
					
					chart = proceed.apply(this, Array.prototype.slice.call(arguments, 1));

					if (window.console && console.profileEnd) {
				 		console.profileEnd();
				 	}

				 	return chart;

				});
			}
			<?php endif ?>
			<?php if (@$_GET['time']) : ?>
			if (typeof Highcharts !== 'undefined') {
				Highcharts.wrap(Highcharts.Chart.prototype, 'init', function (proceed) {
					var chart,
						start;

					// Start profile
					if (window.console && console.time) {
						console.time('<?php echo $path ?>');
					} else {
						start = +new Date();
					}


					chart = proceed.apply(this, Array.prototype.slice.call(arguments, 1));

					if (window.console && console.time) {
						console.timeEnd('<?php echo $path ?>');
					} else if (window.console) {
						console.log('<?php echo $path ?>: ' + (new Date() - start) + 'ms');
					}
					
				 	return chart;

				});
			}
			<?php endif ?>

			<?php if ($styled) { ?>
			var warnedAboutColors = false;
			function warnAboutColors () {
				if (!warnedAboutColors) {
					console.info('This sample uses getOtions.colors, which is ignored in Styled mode.');
					warnedAboutColors = true;
				}

				return undefined;
			}
			Highcharts.wrap(Highcharts, 'getOptions', function (proceed) {
				var options = proceed.call(Highcharts);
				if (!options.colors) {
					options.colors = [];
					for (var i = 0; i < 10; i++) {
						options.colors = {
							get 0 () { warnAboutColors(); },
							get 1 () { warnAboutColors(); },
							get 2 () { warnAboutColors(); },
							get 3 () { warnAboutColors(); }
						};
					}
				}
				return options;
			});

			<?php } ?>

			if (/\/css\//.test(path)) {
				Highcharts.Chart.prototype.callbacks.push(function (chart) {
					var svg = Highcharts.charts[0].container.innerHTML;
					var match = svg.match(/ (style|fill|stroke|stroke-width|fill-opacity)="/);
					if (match) {
						console.warn(
							'Found presentational attribute',
							match[1],
							svg.substr(match.index - 80, 250)
						);
					}
				});
			}
		}
		
		</script>

		<style type="text/css">
			<?php echo $css; ?>
		</style>

	</head>
	<body style="margin: 0">

		<div class="top-bar">

			<div id="version" style="float:right; color: white"></div>

			<h2 style="margin: 0"><?php echo $path ?></h2>

			<div style="text-align: center">
				<form method="post" action="" style="display:inline">
					<select name="theme" onchange="this.form.submit()">
					<?php foreach ($themes as $theme => $themeName) : ?>
						<option value="<?php echo $theme ?>" <?php if ($theme == @$_SESSION['theme']) echo 'selected' ?>>
							<?php echo $themeName ?>
						</option>
					<?php endforeach ?>
					</select>
				</form>
				<button id="next" disabled="disabled" title="Next (Arrow Right)">Next</button>

				<button id="reload" onclick="location.reload()"
					title="Reload (Ctrl + Enter)">Reload</button>
				<?php if (!$styled) { ?>
				<a class="button" title="View this sample with CSS and no inline styling"
					href="view.php?path=<?php echo $path ?>&amp;styled=true">Styled</a>
				<?php } else { ?>
				<a class="button active" title="View this sample with CSS and no inline styling"
					href="view.php?path=<?php echo $path ?>&amp;styled=false">Styled</a>
				<?php } ?>
				
				<a class="button"
					style="border-bottom-right-radius: 0; border-top-right-radius: 0; margin-right: 0"
					href="compare-view.php?path=<?php echo $path ?>">Compare
				</a><a class="button" id="bisect" 
					style="border-bottom-left-radius: 0; border-top-left-radius: 0; margin-left: 0; border-left: 1px solid gray">Bisect</a>
				

				<a class="button"
					href="view.php?path=<?php echo $path ?>&amp;profile=1"
					style="border-bottom-right-radius: 0; border-top-right-radius: 0; margin-right: 0">Profile
				</a><a class="button"
					style="border-bottom-left-radius: 0; border-top-left-radius: 0; margin-left: 0; border-left: 1px solid gray"
					href="view.php?path=<?php echo $path ?>&amp;time=1">Time</a>
				

				<a id="view-source" class="button" href="javascript:;"
					style="border-bottom-right-radius: 0; border-top-right-radius: 0; margin-right: 0">View source
				</a><a class="button"
					href="http://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/<?php echo $path ?>/"
					style="border-bottom-left-radius: 0; border-top-left-radius: 0; margin-left: 0; border-left: 1px solid gray"
					target="_blank">jsFiddle</a>

				
				<input id="record" type="checkbox" />
				<label for="record" title="Record calls to Pointer mouse events that can be added to test.js for automatic testing of tooltip and other mouse operations">Record mouse</label>
				
			</div>
		</div>
		<div id="source-box"></div>
		<div id="main-content">
			<div style="margin: 1em">

			<?php echo $html ?>
			</div>
			<script>
			setUp();
			<?php @include("$path/demo.js"); ?>
			</script>
			<?php if (is_file("$path/test-notes.html")) { ?>
			<section class="test-notes">
				<header>Test notes</header>
				<div class="test-notes-content">
					<?php include("$path/test-notes.html"); ?>
				</div>
			</section>
			<?php } else { ?>
			<hr/>
			<?php } ?>
			<ul>
				<li>Mobile testing: <a href="http://<?php echo $_SERVER['SERVER_NAME'] ?>/draft">http://<?php echo $_SERVER['SERVER_NAME'] ?>/draft</a></li>
			</ul>
			<pre id="recording" style="padding: 1em"></pre>
		</div>
	</body>
</html>
<?php
//------------ Output the sample into /draft/index.htm for debugging on mobile --------
ob_start();
?><!DOCTYPE HTML>
<html>
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
		<title>Highcharts Sample</title>
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<?php echo getFramework(FRAMEWORK); ?>
		<?php echo getResources(); ?>

		<style type="text/css">
			<?php echo $css; ?>
		</style>

	</head>
	<body style="margin: 0">

		<div style="margin: 1em">

		<?php echo $html ?>
		</div>
		<script type="text/javascript">
		<?php @include("$path/demo.js"); ?>
		</script>

	</body>
</html>
<?php 
$draft = ob_get_clean();
$draft = str_replace('cache.php?file=', '', $draft);
file_put_contents('../draft/index.html', $draft);

?>
