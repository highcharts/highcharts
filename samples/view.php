<?php
$path = $_GET['path'];
if (!preg_match('/^[a-z]+\/[a-z]+\/[a-z\-]+$/', $path)) {
	die ('Invalid sample path input');
}
?><!DOCTYPE HTML>
<html>
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
		<title>Highstock Example</title>
		
		<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.6.1/jquery.min.js"></script>
		<script type="text/javascript">
		<?php include("$path/demo.js"); ?>
		</script>
		
		<script type="text/javascript">
			$(function() {
				
				
				
				if (window.parent.frames[0]) {
					function goNext () {
						window.location.href = 
							window.parent.frames[0].document.getElementById('i<?php echo (int)$_GET['next'] ?>').href;
					}
					
					$('#next').click(function() {
						goNext();
					});
					$('#next')[0].disabled = false;
				}
			});
		</script>
		
	</head>
	<body>
		<?php include("$path/demo.html"); ?>
		
		<div style="text-align: center">
			<button id="next" disabled="disabled">Next</button>
			<a target="_blank" href="http://jsfiddle.net/gh/get/jquery/1.6/highslide-software/highcharts.com/tree/stock/samples/<?php echo $path ?>/">jsFiddle</a>
		</div>
	</body>
</html>
