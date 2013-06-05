<?php
$path = $_GET['path'];
if (!preg_match('/^[a-z]+\/[a-z]+\/[a-z0-9\-,]+$/', $path)) {
	die ('Invalid sample path input');
}

$i = (int)$_GET['i'];
$next = $i + 1;

$fullpath = dirname(__FILE__) . '/' . $path;


// Get HTML and use dev server
ob_start();
include("$fullpath/demo.html");
$html = ob_get_clean();
$html = str_replace('/code.highcharts.com/high', '/code.highcharts.local/high', $html);
$html = str_replace('/code.highcharts.com/stock/', '/code.highcharts.local/', $html);
$html = str_replace('/code.highcharts.com/modules/', '/code.highcharts.local/modules/', $html);



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
		<!-- script type="text/javascript" src="http://code.jquery.com/jquery-1.7.js"></script -->
		<script src="/lib/jquery-1.10.1.js"></script>
		<?php echo getResources(); ?>
		<script type="text/javascript">
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
					href="../compare-svg/view.php?path=<?php echo $path ?>&amp;i=<?php echo $i ?>">Compare</a>
				<a style="color: white; font-weight: bold; text-decoration: none; margin-left: 1em"
					href="http://jsfiddle.net/gh/get/jquery/1.9.1/highslide-software/highcharts.com/tree/master/samples/<?php echo $path ?>/"
					target="_blank">» jsFiddle</a>
			</div>
		</div>
		<div style="margin: 1em">

		<?php echo $html ?>
		</div>

	</body>
</html>
