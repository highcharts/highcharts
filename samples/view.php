<?php
$path = $_GET['path'];
if (!preg_match('/^[a-z]+\/[a-z]+\/[a-z\-]+$/', $path)) {
	die ('Invalid sample path input');
}

$i = (int)$_GET['i'];
$next = $i + 1;
?><!DOCTYPE HTML>
<html>
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
		<title>Highstock Example</title>
		
		<script type="text/javascript" src="http://code.jquery.com/jquery-1.7.js"></script>
		<script type="text/javascript">
		<?php include("$path/demo.js"); ?>
		</script>
		
		<script type="text/javascript">
			$(function() {
				
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
						
						$(li).addClass('hilighted');
						contentDoc.currentLi = li;
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
					
					// the reload button
					$('#reload').click(function() {
						location.reload();
					});
					
					// the jsfiddle button
					$('#jsfiddle').click(function() {
						location.href = 'http://jsfiddle.net/gh/get/jquery/1.6/highslide-software/highcharts.com/tree/stock/samples/<?php echo $path ?>/';
					});
				}
			});
		</script>
		
		<style type="text/css">
			h1 {
				text-align: center;
			}
		</style>
		
	</head>
	<body>
		<h1><?php echo ($next - 1) ?>. /samples/<?php echo $path ?></h1> 
		<?php include("$path/demo.html"); ?>
		
		<div style="text-align: center">
			<button id="next" disabled="disabled">Next</button>
			<button id="reload">Reload</button>
			<button id="jsfiddle">jsFiddle</button>
		</div>
	</body>
</html>
