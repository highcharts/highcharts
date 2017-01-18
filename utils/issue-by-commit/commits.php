<?php 

session_start();
require_once('../settings.php');
require_once('Git.php');

try {
	Git::set_bin(Settings::$git);
	$repo = Git::open(dirname(__FILE__) . '/../../');
	$branches = $repo->list_branches();
} catch (Exception $e) {
	$error = "Error connecting to the local git repo <b>highcharts.com</b>. Make sure git is running.<br/><br>" . $e->getMessage();
}
if (@$_POST['branch']) {
	try {

		// Post to session
		$_SESSION['branch'] = @$_POST['branch'];
		$_SESSION['after'] = @$_POST['after'];
		$_SESSION['before'] = @$_POST['before'];
		
		// Prepare command
		//$cmd = 'log > ' . sys_get_temp_dir() . '/log.txt --format="%h|%ci|%s|%p" ';
		$cmd = 'log > ' . sys_get_temp_dir() .
			'/log.txt --graph --format="<br>%h<br>%ci<br>%s<br>%p" ';

		// Date
		if (preg_match('/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/', $_SESSION['after'])) {
			$cmd .= '--after={' . $_SESSION['after'] . '} --before={' . @$_SESSION['before'] . '}';

		// Tag or commit
		} else {
			$cmd .= '' . $_SESSION['after'] . '..' . (isset($_SESSION['before']) ? $_SESSION['before'] : 'HEAD');
		}

		// Repo
		$activeBranch = $repo->active_branch();
		$repo->checkout($_SESSION['branch']);
		$repo->run($cmd);
		$repo->checkout($activeBranch);


		$commitsKey = join(array($_SESSION['branch'],$_SESSION['after'],$_SESSION['before']), ',');
	} catch (Exception $e) {
		$error = $e->getMessage();
	}
}
// Populate input fields
if (!isset($_SESSION['branch'])) {
	$_SESSION['branch'] = 'master';
}
if (!isset($_SESSION['after'])) {
	$_SESSION['after'] = strftime('%Y-%m-%d', time() - 31 * 24 * 3600);
}

// Move the log file back from temp dir
if (!is_dir('../samples/temp')) {
	mkdir('../samples/temp');
}
copy(sys_get_temp_dir() . '/log.txt', '../samples/temp/log.txt');

?>
<html>
	
	<head>
		<script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/1.6.4/jquery.min.js"></script>
		<script type="text/javascript" src="http://code.highcharts.com/highcharts.js"></script>
		
		<script src="commits.js"></script>
		
		<style type="text/css">
			* {
				font-size: 0.95em;
				font-family: Arial, sans-serif;
			}
			h3 {
				font-size: 16pt;
				background: white;
			}
			ul {
				margin: 150px 1em 1em 1em;
				padding-left: 10px;
				
			}
			
			a {
				text-decoration: none;
				border-right: 10px solid white;
				background: rgba(255,255,255,0.75);
			}

			a.visited {
				color: silver;
			}
			a.active {
				border-right-color: black;
			}
			
			body {
				margin: 0;
			}

			ul {
				list-style-type: none;
				position: relative;

			}

			ul li {
				padding: 0.5em 0;
				border-bottom: 1px solid silver;
				margin: 0;
			}
			.date {
				color: gray;
				display: block;
				background: white;
			}
			.parents {
				position: absolute;
			}
			.parents .disc {
				width: 6px;
				height: 6px;
				border-radius: 5px;
				border-width: 2px;
				border-color: black;
			}
			.message {
				display: block;
			}
			.status {
				float: right;
				cursor: pointer;
				color: silver;
				width: 100px;
				padding: 3px;
				border-radius: 3px;
				text-align: center;
			}
			.status.status-good {
				background: green;
				color: white;
			}
			.status.status-bad {
				background: red;
				color: white;
			}

			#topnav {
				position: fixed;
				z-index: 2;
				top: 0;
				box-shadow: 5px 5px 5px #888;
				background: white;
				width: 100%; 
				padding-top: 1em;
			}
			#topnav a, input[type="submit"] {
				background: white;
				color: black;
				cursor: pointer;
				border: 1px solid silver;
				border-radius: 5px;
				margin: 0.5em;
				padding: 0.5em;
			}
			#topnav span {
				padding-left: 5px;
			}
			#topnav div {
				padding: 1em;
				line-height: 1.5em;
			}
			#graph {
				position: absolute;
				width: 100%;
				left: 20px;
				top: 0;
			}
			#compare-header {
				display: none;
			}

			.compare #setdata {
				display: none;
			}
			.compare #compare-header {
				display: block;
				color: silver;
				font-style: italic;
				padding: 1em 1em 0 1em;
			}

			#close {
				display: none;
			}
			.compare #close {
				display: inline-block;
				float: right;
				margin: 2em 0.5em;
				border-radius: 0;
				color: white;
				background: #34343e;
				border: none;
			}

			.intro {
				padding: 0 10px;
				color: silver;
				font-style: italic;
				font-size: 0.9em;
			}
		</style>
	</head>
	
	<body>
		<div id="topnav">

			<button id="close">X</button>
			
			<form method="post" action="commits.php">
			<p class="intro">
			Tip: from and to inputs can be dates (YYYY-mm-dd), tags or commits.
			Use tags to bisect between two known releases, like from <code>v4.2.6</code>
			to <code>v4.2.7</code>.</p>
			<div>
			Branch

			<select name="branch">
			<?php
			foreach ($branches as $branchOption) {
				$selected = ($branchOption == $_SESSION['branch']) ? 'selected="selected"' : '';
				echo "<option value='$branchOption' $selected>$branchOption</option>\n";
			}
			?>
			</select>
			from
			<input type="text" name="after" value="<?php echo $_SESSION['after'] ?>" />
			to
			<input type="text" name="before" value="<?php echo @$_SESSION['before'] ?>" />
			
			<input type="submit" value="Submit"/>
			<a id="setdata" href="main.php" target="main">Change test data</a>
			</div>

			</form>
		</div>
		<div id="compare-header">
		Click commit messages to compare the left side (usually the latest stable version) on the left, with the actual commit on the right.
		</div>
		<div id="graph"></div>
		<ul id="ul"></ul>
		
	</body>
</html>