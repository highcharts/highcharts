<?php


define(FRAMEWORK, 'jQuery');

require_once('functions.php');

$path = $_GET['path'];
if (!preg_match('/^[a-z]+\/[a-z\-]+\/[a-z0-9\-,]+$/', $path)) {
	die ('Invalid sample path input');
}

$i = (int)$_GET['i'];
$next = $i + 1;

$fullpath = dirname(__FILE__) . '/../../samples/' . $path;


// Get HTML and use dev server
ob_start();
include("$fullpath/demo.html");
$httpHost = $_SERVER['HTTP_HOST'];
$httpHost = explode('.', $httpHost);
$topDomain = $httpHost[sizeof($httpHost) - 1];
$html = ob_get_clean();
$html = str_replace('/code.highcharts.com/', "/code.highcharts.$topDomain/", $html);
$html = str_replace('.js"', '.js?' . mktime() . '"', $html); // Force no-cache for debugging



function getResources() {
	global $fullpath;

	// No idea why file_get_contents doesn't work here...
	ob_start();
	include("$fullpath/demo.details");
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
		<title>Highstock Example</title>
		<?php echo getFramework(FRAMEWORK); ?>
		<?php echo getResources(); ?>
		<script type="text/javascript">


		<?php if ($_GET['profile']) : ?>
		$(function () {
			// End profile on chart load
			Highcharts.Chart.prototype.callbacks.push(function (chart) {
				console.timeEnd('<?php echo $path ?>');
				console.profileEnd('<?php echo $path ?>');
			});
			// Start profile on DOM ready	
			console.profile('<?php echo $path ?>');
			console.time('<?php echo $path ?>');

		});
		<?php endif ?>


		<?php @include("$fullpath/demo.js"); ?>
		</script>

		<style type="text/css">
			<?php @include("$fullpath/demo.css"); ?>
		</style>

		<script type="text/javascript">
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

						$(contentDoc.body).animate({
							scrollTop: $(li).offset().top - 300
						},'slow');

						contentDoc.currentLi = li;
						$(li).addClass('hilighted');
					}

					// add the next button
					if (contentDoc.getElementById('i<?php echo $next ?>')) {
						function goNext () {
							window.location.href =
								window.parent.frames[0].document.getElementById('i<?php echo $next ?>').href;
						}

						$('#next').click(function() {
							goNext();
						});
						$('#next')[0].disabled = false;
					}

				}

			});
		</script>

		<style type="text/css">
			.top-bar {
				color: white;
				font-family: Arial, sans-serif;
				font-size: 0.8em;
				padding: 0.5em;
				height: 3.5em;
				background: #57544A;
				background: -webkit-linear-gradient(top, #57544A, #37342A);
				background: -moz-linear-gradient(top, #57544A, #37342A);
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
				<button id="next" disabled="disabled">Next</button>
				<button id="reload" style="margin-left: 1em" onclick="location.reload()">Reload</button>
				<a style="color: white; font-weight: bold; text-decoration: none; margin-left: 1em"
					href="compare-view.php?path=<?php echo $path ?>&amp;i=<?php echo $i ?>">Compare</a>
				<a style="color: white; font-weight: bold; text-decoration: none; margin-left: 1em"
					href="view.php?path=<?php echo $path ?>&amp;i=<?php echo $i ?>&amp;profile=1">Profile</a>
				<a style="color: white; font-weight: bold; text-decoration: none; margin-left: 1em"
					href="http://jsfiddle.net/gh/get/jquery/1.7.2/highslide-software/highcharts.com/tree/master/samples/<?php echo $path ?>/"
					target="_blank">» jsFiddle</a>
			</div>
		</div>

		<div style="margin: 1em">

		<?php echo $html ?>
		</div>
		<hr/>
		<ul>
			<li>Mobile testing: <a href="http://<?php echo $_SERVER['SERVER_NAME'] ?>/draft">http://<?php echo $_SERVER['SERVER_NAME'] ?>/draft</a></li>
		</ul>

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
