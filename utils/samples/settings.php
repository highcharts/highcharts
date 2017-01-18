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

if (@$_SESSION['leftPath'] === '') {
	unset($_SESSION['leftPath']);
}

?><html>

	<head>
	<link rel="stylesheet" type="text/css" href="style.css"/>
	<style type="text/css">
	.main {
		max-width: 600px;
		margin: 2em auto;
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

		<div class="main">
			<h1>Sample runner settings</h1>
			<label for="leftPath">Compare against (leftPath). Defaults to 
			<code>http://code.highcharts.com</code> when left empty. Use <code>master</code> (or other branch name) to compare to latest
			commit.</label>
			<input type="text" name="leftPath" value="<?php echo @$_SESSION['leftPath'] ?>" />			

			<div>
				<input type="submit" value="Save">
			</div>
		</div>
		</form>

	</body>
</html>