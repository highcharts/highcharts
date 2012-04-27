<?php
$product = $_GET['product'];

if ($product == 'highcharts') $dir = 'highcharts';
elseif ($product == 'highstock') $dir = 'stock';
?>
<!DOCTYPE HTML>
<html>
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
		<title>Highstock Example</title>
		<script type="text/javascript" src="http://code.jquery.com/jquery-1.7.js"></script>
		
		<script>
			$(function () {
				$("#batch-compare").click(function() {
					var currentLi = document.currentLi || $('#li1')[0];
					if (currentLi) {
						var href = currentLi.getElementsByTagName("a")[0].href;
					
						href = href.replace("/samples/", "/compare-svg/");
						window.parent.frames[1].location.href = href;
					}
				});
			});
			
		</script>
		<style type="text/css">
			* {
				font-family: Arial, Verdana;
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
			
			
			li {
				border: 1px solid white;
				border-radius: 5px;
				padding: 2px;
			}
			li.visited a {
				color: gray;
			}
			li.hilighted {
				border-color: silver;
				font-weight: bold;
			}
			li.hilighted a {
				color: black;
			}
			
			li.identical, li.identical a {
				background: green;
				color: white;
			}
			
			li.different, li.different a {
				background: red;
				color: white;
			}ß
			
		</style>
		
		
	</head>
	<body>
		
	Product: <a href='?product=highcharts'>Highcharts</a> | <a href='?product=highstock'>Highstock</a>
	<br/>
	<button id="batch-compare">Batch compare</button>
		<hr/>	

	<?php
	if (isset($dir)) {
		if ($handle = opendir(dirname(__FILE__). '/' . $dir)) {
			
			$i = 1;
			while (false !== ($file = readdir($handle))) {
				if (preg_match('/^[a-z]+$/', $file)) {
					echo "
					<h4>$file</h4>
					<ul>
					";
				
					// loop over the inner directories
					if ($innerHandle = opendir(dirname(__FILE__). '/' . $dir . '/'. $file)) {
						while (false !== ($innerFile = readdir($innerHandle))) {
							$next = $i + 1;
							if (preg_match('/^[a-z0-9\-]+$/', $innerFile)) {
								echo "
								<li id='li$i'>$i. <a target='main' id='i$i' href='view.php?path=$dir/$file/$innerFile&amp;i=$i'>$innerFile</a></li>
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
</body>
</html>