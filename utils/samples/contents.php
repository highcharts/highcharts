<!DOCTYPE HTML>
<html>
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
		<title>Highcharts samples</title>

		<script type='text/javascript' src='//code.jquery.com/jquery-1.9.1.js'></script>
  		<script type="text/javascript" src="//code.jquery.com/ui/1.9.2/jquery-ui.js"></script>
  		<link rel="stylesheet" type="text/css" href="//code.jquery.com/ui/1.9.2/themes/base/jquery-ui.css"/>
		
		<script>
			var diffThreshold = 0;
			$(function () {
				$("#batch-compare").click(function() {
					var currentLi = document.currentLi || $('#li1')[0];
					if (currentLi) {
						var href = currentLi.getElementsByTagName("a")[0].href;
					
						href = href.replace("view.php", "compare-view.php") + '&continue=true';
						window.parent.frames[1].location.href = href;
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

						})
					}
				});
			});
			
		</script>
		<style type="text/css">
			* {
				font-family: Arial, Verdana;
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
				border: 1px solid white;
				border-radius: 5px;
				padding: 2px;
			}
			li.visited a {
				color: gray;
			}
			
			li.identical, li.identical a {
				background: green;
				color: white;
				font-weight: bold;
			}
			
			li.different, li.different a {
				background: red;
				color: white;
				font-weight: bold;
			}
			
			li.hilighted {
				border-color: silver;
				font-weight: bold;
				background: black !important;
				color: white;
			}
			li.hilighted a {
				color: white;
				background: black;
			}
			body {
				margin: 0;
			}
			#top-nav {
				color: white; 
				font-family: Arial, sans-serif; 
				padding: 0.5em; 
				height: 6.5em;
				background: #57544A;
				background: -webkit-linear-gradient(top, #57544A, #37342A); 
				background: -moz-linear-gradient(top, #57544A, #37342A);
				box-shadow: 0px 0px 8px #888;
				position: fixed;
				top: 0;
				width: 100%;
			}
			#top-nav a {
				color: white;
				font-weight: bold;
				
			}
			#main-nav {
				margin-top: 100px;
				margin-left: 10px;
			}
			.batch {
			}
		</style>
		
		
	</head>
	<body>
		
	<div id="top-nav">
		<button id="batch-compare">Batch compare</button>

		<div>Show only differences above: <span id="slider-value">0</span></div>
		<div id="slider" style="margin: 1em 3em 1em 1em"></div>
	</div>


	<div id="main-nav">
	<?php
	$products = array('highcharts', 'stock');
	$samplesDir = dirname(__FILE__). '/../../samples/';

	$i = 1;
	foreach ($products as $dir) {
		if ($handle = opendir($samplesDir . $dir)) {

			echo "<h2>$dir</h2>";
			
			while (false !== ($file = readdir($handle))) {
				if (preg_match('/^[a-z]+$/', $file)) {
					echo "
					<h4>$dir/$file</h4>
					<ul>
					";
				
					// loop over the inner directories
					if ($innerHandle = opendir($samplesDir . $dir . '/'. $file)) {
						while (false !== ($innerFile = readdir($innerHandle))) {
							$next = $i + 1;
							$batchClass = 'class="batch"';
							if (preg_match('/^[a-z0-9\-,]+$/', $innerFile)) {
								$yaml = file_get_contents(($samplesDir ."/$dir/$file/$innerFile/demo.details"));
								$suffix = '';
								if (strstr($yaml, 'requiresManualTesting: true')) {
									$batchClass = '';
									$suffix = ' <acronym title="Requires manual testing">[m]</acronym>';
								}
								echo "
								<li id='li$i'>$i. $suffix <a target='main' id='i$i' $batchClass href='view.php?path=$dir/$file/$innerFile&amp;i=$i'>$innerFile</a> </li>
								";
								$i++;
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