<?php
	ini_set('display_errors', 'on');

	session_start();

	require_once('Git.php');

	try {
		$repo = Git::open(dirname(__FILE__) . '/../../');
		$branches = $repo->list_branches();
	} catch (Exception $e) {
		$error = "Error connecting to the local git repo <b>highcharts.com</b>. Make sure git is running.<br/><br>" . $e->getMessage();
	}


	$commit = @$_GET['commit'];

	// Defaults
	if (!@$_SESSION['branch']) {
		$_SESSION['after'] = strftime('%Y-%m-%d', mktime() - 30 * 24 * 3600);
		$_SESSION['before'] = strftime('%Y-%m-%d', mktime());
		$_SESSION['branch'] = 'master';
	}

	if (@$_POST['branch']) {
		try {
			$_SESSION['branch'] = @$_POST['branch'];
			$_SESSION['after'] = @$_POST['after'];
			$_SESSION['before'] = @$_POST['before'];
			$activeBranch = $repo->active_branch();
			$repo->checkout($_SESSION['branch']);
			$repo->run('log > ' . dirname(__FILE__) . '/log.txt --format="%H %ci %s" ' .
				'--first-parent --after={' . $_SESSION['after'] . '} --before={' . $_SESSION['before'] . '}');
			$repo->checkout($activeBranch);


			$commitsKey = join(array($_SESSION['branch'],$_SESSION['after'],$_SESSION['before']), ',');
		} catch (Exception $e) {
			$error = $e->getMessage();
		}
	}

	// handle input data
	if (@$_POST['html']) {
		file_put_contents('demo.html', stripslashes($_POST['html']));
	}
	if (@$_POST['js']) {
		file_put_contents('demo.js', stripslashes($_POST['js']));
	}

?><!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html>
	<head>
		<style type="text/css">
		textarea {
			font-family: monospace;
			color: green;
		}
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
	$html = file_get_contents('demo.html');
	printf($html, $commit, $commit, $commit, $commit, $commit, $commit, $commit, $commit, $commit, $commit);

		
	echo '<script type="text/javascript">';
	require_once('demo.js');
	echo '</script>';
	
	echo '<hr/>';
	echo "<a target='_blank' href='https://github.com/highslide-software/highcharts.com/commit/$commit'>View commit</a>";

} else { ?>

<?php if (@$error) { 
	echo "<pre style='margin: 2em; padding: 2em; background: red; color: white; border-radius: 5px'>$error</pre>";
} ?>


<form method="post" action="main.php">
<b>Paste HTML</b> here (including framework and Highcharts, use %s for commit):<br/>
<textarea name="html" rows="6" style="width: 100%"><?php include('demo.html'); ?></textarea>
	
<br/>
<b>Paste JS</b> here:<br/>
<textarea name="js" rows="30" style="width: 100%"><?php include('demo.js'); ?></textarea><br/>

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