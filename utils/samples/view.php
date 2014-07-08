<?php

session_start();
$defaults = json_decode(file_get_contents('default-settings.json'));

define('FRAMEWORK', 'jQuery');

require_once('functions.php');

@$path = $_GET['path'];
if (!preg_match('/^[a-z]+\/[a-z0-9\-\.]+\/[a-z0-9\-,]+$/', $path)) {
	die ('Invalid sample path input');
}

$i = (int)$_GET['i'];
$next = $i + 1;
$previous = $i - 1;

$fullpath = dirname(__FILE__) . '/../../samples/' . $path;


// Get HTML and use dev server
ob_start();
@include("$fullpath/demo.html");
$httpHost = $_SERVER['HTTP_HOST'];
$httpHost = explode('.', $httpHost);
$topDomain = $httpHost[sizeof($httpHost) - 1];
$html = ob_get_clean();
$html = str_replace('/code.highcharts.com/', "/code.highcharts.$topDomain/", $html);


if (strstr($html, "/code.highcharts.$topDomain/mapdata")) {
	$html = str_replace("/code.highcharts.$topDomain/mapdata", "/code.highcharts.com/mapdata", $html);
} else {
	$html = str_replace('.js"', '.js?' . time() . '"', $html); // Force no-cache for debugging
}



// Handle themes
if (isset($_POST['theme'])) {
	$_SESSION['theme'] = $_POST['theme'];	
}
if ($_SESSION['theme']) {
	$html .= "<script src='http://code.highcharts.$topDomain/themes/". $_SESSION['theme'] .".js'></script>";
}
$themes = array(
	'' => 'Default theme',
	'sand-signika' => 'Sand Signika',
	'dark-unica' => 'Dark Unica',
	'grid-light' => 'Grid Light'
);



function getResources() {
	global $fullpath;

	// No idea why file_get_contents doesn't work here...
	ob_start();
	@include("$fullpath/demo.details");
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


?><!DOCTYPE HTML>
<html>
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
		<title>Sample viewer - Highcharts</title>
		<?php echo getFramework(FRAMEWORK); ?>
		<?php echo getResources(); ?>
		<link rel="stylesheet" type="text/css" href="style.css"/>


		<script type="text/javascript">

		(function () {
			if (typeof $ === 'undefined') {
				window.onload = function () {
					document.getElementById('container').innerHTML = 
						'<div style="margin-top: 150px; %text-align: center"><h3 style="font-size: 2em; color: red">' +
						'jQuery is missing</h3><p>Check your settings in <code>default-settings.json</code>.</div>';
				}
				return;
			}

			
			$(function() {

				$('#version').html(Highcharts.product + ' ' + Highcharts.version);

				if (window.parent.frames[0]) {
					var contentDoc = window.parent.frames[0].document;

					// Highlight the current sample in the left
					var li = contentDoc.getElementById('li<?php echo $i ?>');
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
					if (contentDoc.getElementById('i<?php echo $next ?>')) {
						
						$('#next').click(function() {
							next();
						});
						$('#next')[0].disabled = false;
					}
				}

				// Activate view source button
				$('#view-source').bind('change', function () {
					var checked = $(this).attr('checked');
					
					$('#source-box').css({
						width: checked ? '50%' : 'auto',
						'float': checked ? 'left' : 'none'
					});
					$('#main-content').css({
						width: checked ? '50%' : 'auto',
						'float': checked ? 'right' : 'none'
					});
					$.each(Highcharts.charts, function () {
						this.reflow();
					});

					if (checked) {
						$('<iframe>').appendTo('#source-box')
							.attr({
								src: 'view-source.php?path=<?php echo $path ?>'
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

			});
		}());
		</script>
		<script>

		function next() {
			window.location.href =
				window.parent.frames[0].document.getElementById('i<?php echo $next ?>').href;
		}
		function previous() {
			window.location.href =
				window.parent.frames[0].document.getElementById('i<?php echo $previous ?>').href;
		}


		/* Wrappers for recording mouse events in order to write automatic tests */
		$(function () {

			$(window).bind('keydown', parent.keyDown);
			
			var checkbox = $('#record')[0],
				pre = $('pre#recording')[0];
			Highcharts.wrap(Highcharts.Pointer.prototype, 'onContainerMouseDown', function (proceed, e) {
				if (checkbox.checked) {
					pre.innerHTML += "chart.pointer.onContainerMouseDown({\n"+
						"    type: 'mousedown',\n" +
						"    pageX: " + e.pageX + ",\n" + 
						"    pageY: " + e.pageY + "\n" + 
						"});\n\n";
				}
				return proceed.call(this, e);
			});
			Highcharts.wrap(Highcharts.Pointer.prototype, 'onContainerMouseMove', function (proceed, e) {
				if (checkbox.checked) {
					pre.innerHTML += "chart.pointer.onContainerMouseMove({\n"+
						"    type: 'mousemove',\n" +
						"    pageX: " + e.pageX + ",\n" + 
						"    pageY: " + e.pageY + ",\n" +  
						"    target: chart.container\n" + 
						"});\n\n";
				}
				return proceed.call(this, e);
			});
			Highcharts.wrap(Highcharts.Pointer.prototype, 'onDocumentMouseUp', function (proceed, e) {
				if (checkbox.checked) {
					pre.innerHTML += "chart.pointer.onContainerMouseMove({\n"+
						"    type: 'mouseup'\n" + 
						"});\n\n";
				}
				return proceed.call(this, e);
			});
		});


		<?php if (@$_GET['profile']) : ?>
		$(function () {
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
		});
		<?php endif ?>
		<?php if (@$_GET['time']) : ?>
		$(function () {
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
		});
		<?php endif ?>


		<?php @include("$fullpath/demo.js"); ?>
		</script>

		<style type="text/css">
			<?php @include("$fullpath/demo.css"); ?>
		</style>

		<style type="text/css">
			.top-bar {
				color: white;
				font-family: Arial, sans-serif;
				font-size: 0.8em;
				padding: 0.5em;
				height: 50px;
				background: #34343e;
				box-shadow: 0px 0px 8px #888;
			}
			li, a, p, div {
				font-family: Arial, sans-serif;
				font-size: 10pt;
			}
		</style>

	</head>
	<body style="margin: 0">

		<div class="top-bar">

			<div id="version" style="float:right; color: white"></div>

			<h2 style="margin: 0"><?php echo ($next - 1) ?>. <?php echo $path ?></h2>

			<div style="text-align: center">
				<form method="post" action="" style="display:inline">
					<select name="theme" onchange="this.form.submit()">
					<?php foreach ($themes as $theme => $themeName) : ?>
						<option value="<?php echo $theme ?>" <?php if ($theme == $_SESSION['theme']) echo 'selected' ?>>
							<?php echo $themeName ?>
						</option>
					<?php endforeach ?>
					</select>
				</form>
				<button id="next" disabled="disabled">Next</button>
				<button id="reload" style="margin-left: 1em" onclick="location.reload()">Reload</button>
				<input id="view-source" type="checkbox" />
				<label for="view-source">View source</label>
				<a style="color: white; font-weight: bold; text-decoration: none; margin-left: 1em"
					href="compare-view.php?path=<?php echo $path ?>&amp;i=<?php echo $i ?>">Compare</a>
				<a style="color: white; font-weight: bold; text-decoration: none; margin-left: 1em"
					href="view.php?path=<?php echo $path ?>&amp;i=<?php echo $i ?>&amp;profile=1">Profile</a>
				<a style="color: white; font-weight: bold; text-decoration: none; margin-left: 1em"
					href="view.php?path=<?php echo $path ?>&amp;i=<?php echo $i ?>&amp;time=1">Time</a>
				<a style="color: white; font-weight: bold; text-decoration: none; margin-left: 1em"
					href="http://jsfiddle.net/gh/get/jquery/1.7.2/highslide-software/highcharts.com/tree/master/samples/<?php echo $path ?>/"
					target="_blank">» jsFiddle</a>

				<input id="record" type="checkbox" />
				<label for="record" title="Record calls to Pointer mouse events that can be added to test.js for automatic testing of tooltip and other mouse operations">Record mouse</label>
			</div>
		</div>
		<div id="source-box"></div>
		<div id="main-content">
			<div style="margin: 1em">

			<?php echo $html ?>
			</div>
			<hr/>
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
		<?php echo getFramework(FRAMEWORK); ?>
		<?php echo getResources(); ?>
		<script type="text/javascript">
		<?php @include("$fullpath/demo.js"); ?>
		</script>

		<style type="text/css">
			<?php @include("$fullpath/demo.css"); ?>
		</style>

	</head>
	<body style="margin: 0">

		<div style="margin: 1em">

		<?php echo $html ?>
		</div>

	</body>
</html>
<?php 
file_put_contents('../draft/index.html', ob_get_clean());

?>
