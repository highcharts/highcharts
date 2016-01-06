<?php

require_once('functions.php');

$browser = getBrowser();
$browserKey = isset($_GET['browserKey']) ? $_GET['browserKey'] : $browser['parent'];

$compare = @json_decode(file_get_contents('temp/compare.json'));


?><!DOCTYPE HTML>
<html>
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
		<title>Highcharts samples</title>

		<script type='text/javascript' src='http://code.jquery.com/jquery-1.9.1.js'></script>
  		<script type="text/javascript" src="http://code.jquery.com/ui/1.9.2/jquery-ui.js"></script>
  		<link rel="stylesheet" type="text/css" href="http://code.jquery.com/ui/1.9.2/themes/base/jquery-ui.css"/>
  		<link rel="stylesheet" type="text/css" href="style.css"/>

		<link href="http://netdna.bootstrapcdn.com/font-awesome/3.2.1/css/font-awesome.css" rel="stylesheet">
		
		<script>
			var diffThreshold = 0;
			function runBatch() {
				var currentLi = document.currentLi || $('#li1')[0];
				if (currentLi) {
					var href = currentLi.getElementsByTagName("a")[0].href;
				
					href = href.replace("view.php", "compare-view.php") + '&continue=true';
					window.parent.frames[1].location.href = href;
				}
				$(this).toggle();
				$('#batch-stop').toggle();
			}

			function countFails() {
				$('#count-fails').html('(' + ($('#main-nav li').length - 
					$('#main-nav li.identical, #main-nav li.approved').length) + ')');
			}

			$(function () {

				$(window).bind('keydown', parent.keyDown);

				
				$("#batch-compare").click(runBatch);

				$("#batch-stop").click(function() {
					var currentLi = document.currentLi || $('#li1')[0];
					if (currentLi) {
						var href = currentLi.getElementsByTagName("a")[0].href;
					
						href = href.replace("view.php", "compare-view.php");
						window.parent.frames[1].location.href = href;
					}
					$(this).toggle();
					$('#batch-compare').toggle();
				});

				$('#reset').click(function () {
					if (confirm("Do you want to reset the compare history? Results from all browsers will be lost.")) {
						$.getScript('compare-reset.php');
					}
				});

				$('#reload').click(function () {
					window.location.reload();
				});

				var fails = 0;
				$('#fails-only').click(function () {

					fails = (fails + 1) % 3;
					if (fails === 1) { // Hide passed tests
						$('#filtered').css('display', 'block');
						$('#main-nav h2, #main-nav h4, #main-nav li.identical, #main-nav li.approved').css('display', 'none');
					
					} else if (fails === 2) { // Hide manual tests
						$('#main-nav li.manual').css('display', 'none');
					
					} else if (fails === 0) { // Reset
						$('#filtered').css('display', 'none');
						$('#main-nav li').css('display', '');	
					}

					
				});

				$("#slider").slider({
					min: 0,
					max: 1,
					step: 0.01,
					slide: function (ui, e) {
						diffThreshold = e.value;
						$('#slider-value').html(e.value);
						$('a.dissimilarity-index').each(function (i, a) {
							var $a = $(a),
								$li = $a.parent(),
								diff = parseFloat($a.attr('data-diff'));

							if (diff >= e.value && $li.hasClass('identical')) {
								$li.removeClass('identical').addClass('different');
							} else if (diff < e.value && $li.hasClass('different')) {
								$li.removeClass('different').addClass('identical');
							}
						});
					}
				});

				$('#main-nav').css('margin-top', $('#top-nav').height());

				countFails();
				
			});
			
		</script>
		<style type="text/css">
			* {
				font-family: Arial, Verdana;
			}

			body {
				background: #F6F6F6;
			}

			li, a, p, div, span {
				font-size: 12px;
			}
			ul {
				margin-left: 0;
				padding-left: 0;
			}
			li {
				list-style: none;
				margin-left: 0;
				padding-left: 0;
			}
			a {
				text-decoration: none;
			}
			
			h2 {
				border-bottom: 1px solid gray;
				text-transform: uppercase;
			}
			li {
				border: 1px solid #F6F6F6;
				background: white;
				border-radius: 5px;
				padding: 2px;
			}
			li.visited a {
				color: gray;
			}
			
			
			li.different, li.different a {
				background: #f15c80;
				color: white;
				font-weight: bold;
			}

			li.identical, li.identical a, li.approved, li.approved a {
				background: #a4edba;
				color: #039;
				font-weight: normal;
			}
			
			
			li.hilighted {
				border-color: black;
				border-left-width: 1em;
			}
			body {
				margin: 0;
			}
			#top-nav {
				color: white; 
				font-family: Arial, sans-serif; 
				padding: 10px; 
				background: #34343e;
				box-shadow: 0px 0px 8px #888;
				position: fixed;
				top: 0;
				width: 100%;
				z-index: 10;
			}
			#top-nav .text {
				padding-top: 0.5em;
			}
			#top-nav .text a {
				color: white;
				text-decoration: underline;
			}
			#main-nav {
				margin-left: 10px;
				padding-top: 40px;
			}
			#batch-stop {
				display: none;
			}
			.comment {
				position: absolute;
				right: 3em;
			}
			.comment-title {
				display: none;
				position: absolute;
				width: 200px;
				background: white;
				color: black;
				padding: 20px;
				right: -3em;
				z-index: 2;
				border: 1px solid silver;
			}
			.comment:hover .comment-title {
				display: block;
			}
			.dissimilarity-index {
				float: right;
			}
			#filtered {
				display: none;
				margin: 1em 0;
				padding: 1em;
				border: 1px solid #7cb5ec;
				border-radius: 0.5em;
			}

		</style>
		
		
	</head>
	<body>
		
	<div id="top-nav">
		<a class="button" href="index.php" target="main">
			<i class="icon-home"></i>
		</a>
		<a class="button" id="batch-compare" title="Batch compare all samples">
			<i class="icon-play"></i>
			Run tests
		</a>
		<a class="button" id="batch-stop" title="Stop comparing">
			<i class="icon-stop"></i>
			Stop
		</a>
		<a class="button" href="compare-report.php" title="View compare history for all browsers" target="main">Report</a>
		<a class="button" id="reset" title="Reset compare history for all browsers">Reset</a>
		<a class="button" id="reload" title="Reload frame">
			<i class="icon-refresh"></i>
			Reload
		</a>
		<a class="button" id="settings" title="Settings" href="settings.php" target="main">
			<i class="icon-cog"></i>
			Settings
		</a>

		<a class="button" id="fails-only" title="Show only fails">
			<i class="icon-filter"></i>
			Fails only
			<span id="count-fails"></span>
		</a>

		<div class="text">
			View results for <a href="?"><?php echo $browser['name'] ?></a>, <a href="?browserKey=PhantomJS 2.0.0">PhantomJS</a>
		</div>

		<div style="margin-top: 1em">
			<div style="width: 45%; float:left">Diff limit: <span id="slider-value">0</span></div>
			<div id="slider" style="width: 45%; float:left"></div>
		</div>

	</div>


	<div id="main-nav">

	<div id="filtered">
		Showing only failed samples. Click "Fails only" again to change.
	</div>
	<?php
	$products = array('unit-tests', 'highcharts', 'maps', 'stock', 'issues');
	$samplesDir = dirname(__FILE__). '/../../samples/';
	

	$i = 1;
	foreach ($products as $dir) {
		if ($handle = opendir($samplesDir . $dir)) {

			echo "<h2>$dir</h2>";
			
			while (false !== ($file = readdir($handle))) {
				if (is_dir("$samplesDir/$dir/$file") && substr($file, 0, 1) != '.') {
					echo "
					<h4>$dir/$file</h4>
					<ul>
					";
				
					// loop over the inner directories
					if ($innerHandle = opendir($samplesDir . $dir . '/'. $file)) {
						while (false !== ($innerFile = readdir($innerHandle))) {
							$next = $i + 1;
							$batchClass = 'batch';
							$compareClass = '';
							if (preg_match('/^[a-z0-9\-,]+$/', $innerFile)) {
								$yaml = @file_get_contents(($samplesDir ."/$dir/$file/$innerFile/demo.details"));
								$path = "$dir/$file/$innerFile";
								$suffix = '';
								$dissIndex = '';
								$isUnitTest = strstr($yaml, 'qunit') || file_exists($samplesDir ."/$dir/$file/$innerFile/unit-tests.js");
								$diff = '';


								if (strstr($yaml, 'requiresManualTesting: true')) {
									$batchClass = '';
									$compareClass = 'manual';
								}

								// Display diff from previous comparison
								$compareIcon = $isUnitTest ? 'icon-puzzle-piece' : 'icon-columns';
								$dissIndex = "
									<a class='dissimilarity-index' href='compare-view.php?path=$path&amp;i=$i' target='main'><i class='$compareIcon'></i></a>
								";
								if (isset($compare->$path->$browserKey)) {
									$diff = $compare->$path->$browserKey;
									if ($diff > 0 || $diff == 'Error') {
										if (strstr($diff, '.')) {
											$diff = round($diff, 2);
										}
										$compareClass = 'different';
										$dissIndex = "
											<a class='dissimilarity-index' href='compare-view.php?path=$path&amp;i=$i' target='main' data-diff='$diff'>$diff</a>
										";
									} else {
										$compareClass = 'identical';
									}
								}

								// No symbol for manual tests
								if ($compareClass == 'manual') {
									$dissIndex = "
										<a title='Requires manual testing' class='dissimilarity-index' href='compare-view.php?path=$path&amp;i=$i' target='main'>
											<i class='icon-hand-left'></i>
										</a>
									";
								}

								// Comments
								if (isset($compare->$path->comment)) {
									$comment = $compare->$path->comment;
									
									// Sample is different but approved
									if ($comment->symbol === 'check' && $comment->diff == $diff) {
										$compareClass = 'approved';
									} else if ($comment->symbol === 'exclamation-sign') {
										$compareClass = 'different';
									}
									
									// Make it string
									$comment = "
										<i class='icon-$comment->symbol' title='$comment->title'></i>
										<span class='comment-title'>$comment->title<br>(Approved diff: $comment->diff)</span>
									";
									
								} else {
									$comment = "
										<i class='icon-pencil' title='Add comment'></i>
									";
								}

								echo "
								<li id='li$i' class='$compareClass'>$i. $suffix 
									<a target='main' id='i$i' class='$batchClass' href='view.php?path=$path&amp;i=$i'>$innerFile</a>
									<a class='comment' href='compare-comment.php?path=$path&amp;i=$i&amp;diff=$diff' target='main'>
										$comment
									</a>
									$dissIndex
								</li>
								";
								$i++;
							
							} elseif (preg_match('/^[a-zA-Z0-9\-,]+$/', $innerFile)) {
								echo "
								<li class='different'>
									Invalid sample name, use lower case only:<br>$innerFile
								</li>
								";
							}
						}
					}
				
					echo "</ul>";
				}
			}
		
		
			closedir($handle);
		}
	}
?>
</div>
</body>
</html>