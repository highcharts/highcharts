<?php
	ini_set('display_errors', 'on');

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


	$commit = @$_GET['commit'];
	$tempDir = sys_get_temp_dir();

	// Defaults
	if (!@$_SESSION['branch']) {
		$_SESSION['after'] = strftime('%Y-%m-%d', time() - 30 * 24 * 3600);
		$_SESSION['before'] = strftime('%Y-%m-%d', time());
		$_SESSION['branch'] = 'master';
	}

	if (@$_POST['branch']) {
		try {
			$_SESSION['branch'] = @$_POST['branch'];
			$_SESSION['after'] = @$_POST['after'];
			$_SESSION['before'] = @$_POST['before'];
			$activeBranch = $repo->active_branch();
			$repo->checkout($_SESSION['branch']);
			$repo->run('log > ' . $tempDir . '/log.txt --format="%h|%ci|%s|%p" ' .
				//'--first-parent --after={' . $_SESSION['after'] . '} --before={' . $_SESSION['before'] . '}');
				'--after={' . $_SESSION['after'] . '} --before={' . $_SESSION['before'] . '}');
			$repo->checkout($activeBranch);


			$commitsKey = join(array($_SESSION['branch'],$_SESSION['after'],$_SESSION['before']), ',');
		} catch (Exception $e) {
			$error = $e->getMessage();
		}
	}

	// handle input data
	if (@$_POST['html']) {
		$_SESSION['html'] = stripslashes($_POST['html']);
	}
	if (@$_POST['css']) {
		$_SESSION['css'] = stripslashes($_POST['css']);
	}
	if (@$_POST['js']) {
		$_SESSION['js'] = stripslashes($_POST['js']);
	}


	// Get demo code
	$html = isset($_SESSION['html']) ? $_SESSION['html'] : file_get_contents('demo.html');

	$css = isset($_SESSION['css']) ? $_SESSION['css'] : @file_get_contents('demo.css');
	$js = isset($_SESSION['js']) ? $_SESSION['js'] : file_get_contents('demo.js');


?><!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html>
	<head>
		<style type="text/css">
		body {
			font-family: Arial;
		}
		a, p, div, li {
			font-size: 10pt;
		}
		textarea, code {
			font-family: monospace;
			color: green;
		}

		/* Styles from demo.css */
		<?php echo $css ?>
		</style>
		<?php if (@$_POST['branch']) : ?>
		<script>
			window.onload = function () {
				var commitsKey = "<?php echo $commitsKey ?>";

				// If we have loaded a new branch or new dates, update commits frame
				//if (window.parent.commitsKey) {
					window.parent.frames[0].location.reload();
				//}

				window.parent.commitsKey = commitsKey;
			}
		</script>
		<? endif; ?>
	</head>

	<body>


<?php if ($commit) {
	printf($html, $commit, $commit, $commit, $commit, $commit, $commit, $commit, $commit, $commit, $commit);


	echo "<script>$js</script>";
	echo '<hr/><ul>';
	echo "<li>View commit: <a target='_blank' href='https://github.com/highslide-software/highcharts.com/commit/$commit'>". substr($commit, 0, 8) ."</a></li>";
	echo "<li>Mobile testing: <a href='http://" . $_SERVER['SERVER_NAME'] . "/draft'>http://" . $_SERVER['SERVER_NAME'] . "/draft</a>.";

} else { ?>

<?php if (@$error) {
	echo "<pre style='margin: 2em; padding: 2em; background: red; color: white; border-radius: 5px'>$error</pre>";
} ?>


<form method="post" action="main.php">
<b>Paste HTML</b> here (including framework and Highcharts, use %s for commit):<br/>
<textarea name="html" rows="6" style="width: 100%"><?php echo $html; ?></textarea>

<br/>
<b>Paste CSS</b> here:<br/>
<textarea name="css" rows="6" style="width: 100%"><?php echo $css; ?></textarea>

<br/>
<b>Paste JS</b> here:<br/>
<textarea name="js" rows="30" style="width: 100%"><?php echo $js; ?></textarea><br/>

Load commits in <b>branch</b>
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
<input type="text" name="before" value="<?php echo $_SESSION['before'] ?>" />

<br/>
<br/>

<input type="submit" value="Submit"/>

	<br/>
	<br/>
</form>
<?php } ?>

	</body>
</html>
<?php
//------------ Output the sample into /draft/index.htm for debugging on mobile --------
if ($commit) {
ob_start();
?><!DOCTYPE HTML>
<html>
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
		<title>Highcharts Sample</title>
<style type="text/css">
<?php echo $css ?>
</style>
	</head>
	<body style="margin: 0">

		<div style="margin: 1em">

		<?php printf($html, $commit, $commit, $commit, $commit, $commit, $commit, $commit, $commit, $commit, $commit); ?>
		</div>


		<script>
		<?php echo $js ?>
		</script>

	</body>
</html>
<?php
file_put_contents('../draft/index.html', ob_get_clean());
}
?>
