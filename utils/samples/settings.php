<?php 

session_start();
require_once('../settings.php');

if (isset($_SESSION['leftPath'])) {
	$leftPath = $_SESSION['leftPath'];
} else {
	$leftPath = Settings::$leftPath;
}

if (isset($_POST) && isset($_POST['leftPath'])) {
	$_SESSION['leftPath'] = $_POST['leftPath'];
}

?><html>

	<head>
	<link rel="stylesheet" type="text/css" href="style.css"/>
	<style type="text/css">
	body {
		margin: 2em;
	}
	input[type="text"] {
		min-width: 300px;
	}
	label {
		display: block;
	}
	input {
		display: block;
		margin-bottom: 2em;
	}
	</style>


	</head>

	<body>
		
		<form action="" method="POST">

		<div>
			<label for="leftPath">Compare against (leftPath). Defaults to 
			<code>http://code.highcharts.com</code>. Use <code>master</code> to compare to latest
			commit.</label>
			<input type="text" name="leftPath" value="<?php echo $_SESSION['leftPath'] ?>" />
		</div>

		<div>
			<input type="submit" value="Save">
		</div>
		</form>

	</body>
</html>