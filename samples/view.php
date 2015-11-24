
<?php
ini_set('display_errors', true);

$path = $_GET['path'];
if (!preg_match('/^[a-z\-0-9]+\/[a-z0-9\-\.]+\/[a-z0-9\-,]+$/', $path)) {
	die ('Invalid sample path input: ' . $path);
}

function getResources() {
	global $path;
	
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
		<title>Highcharts Sample</title>

		<script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.min.js"></script>
		<style type="text/css">
<?php include("$path/demo.css"); ?>
		</style>
		<script type="text/javascript">
<?php include("$path/demo.js"); ?>
		</script>
	</head>
	<body>
<?php include("$path/demo.html"); ?>
	</body>
</html>