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
		
	</head>
	<body>
		<?php include("$path/demo.html"); ?>		
	</body>
</html>
