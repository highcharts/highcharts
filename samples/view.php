<?php
$path = $_GET['path'];
if (!preg_match('/^[a-z]+\/[a-z]+\/[a-z\-]+$/', $path)) {
	die ('Invalid sample path input');
}

$i = (int)$_GET['i'];
$next = $i + 1;


function getResources() {
	global $path;
	
	// No idea why file_get_contents doesn't work here...
	ob_start();
	include("$path/demo.details");
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
		
		<script type="text/javascript" src="http://code.jquery.com/jquery-1.7.js"></script>
		<?php echo getResources(); ?>
		<script type="text/javascript">$(function() {
		<?php @include("$path/demo.js"); ?>
		});</script>
		
		<style type="text/css">
			<?php @include("$path/demo.css"); ?>
		</style>
		
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
						$(contentDoc.body).animate({
							scrollTop: $(li).offset().top - 50
						},'slow');

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
					
				}
			});
		</script>
		
		<style type="text/css">
			h1 {
				text-align: center;
			}
		</style>
		
	</head>
	<body style="margin: 0">
		
		<div style="background: #57544A; color: white; font-family: Arial, sans-serif; font-size: 0.8em; padding: 0.5em; height: 2em">
			
			<h2 style="float: left; margin: 0"><?php echo ($next - 1) ?>. <?php echo $path ?></h2> 
			
			<div style="float: right">
				<button id="next" disabled="disabled">Next</button>
				<button id="reload" style="margin-left: 1em">Reload</button>
				<a style="color: white; font-weight: bold; text-decoration: none; margin-left: 1em" 
					href="http://jsfiddle.net/gh/get/jquery/1.7.1/highslide-software/highcharts.com/tree/master/samples/<?php echo $path ?>/"
					target="_blank">» jsFiddle</a>
			</div>
		</div>
		<div style="margin: 1em">
		
		<?php @include("$path/demo.html"); ?>
		</div>
		
	</body>
</html>
