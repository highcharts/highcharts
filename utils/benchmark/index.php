<?php 
session_start();
?><!DOCTYPE html>
<html>
	<head>
		<title>Benchmark - Highcharts Utils</title>
		<link rel="stylesheet" type="text/css" href="test-style.css">

		<?php

			// Array of different jquery versions.
			// index 0 being default.
			$jqueryVersions = array(
				0 => 'http://code.jquery.com/jquery.min.js'
				);

			// Array of different Highcharts versions.
			// index 0 being default.
			$highchartsVersions = array(
				'http://code.highcharts.local/stock/highstock.js',
				'http://code.highcharts.com/stock/highstock.js',
				'http://github.highcharts.com/highstock.js'
			);

			$repetitions = array(
				1, 5, 10
			);

			// Repetitions each chart is to be run within runChart();
			// This takes longer time but results in a more accurate average.
			$defaultRepetitions = 5;

			// These lines determine what jquery version to load based on POST/SESSION variables.
			if (isset($_POST['jquery']) && $_POST['jquery'] != $jqueryVersions[0]) {
				$_SESSION['jquery'] = $_POST['jquery'];

			} else if (isset($_SESSION['jquery'])) {
				echo "<script src='".$_SESSION['jquery']."'></script>";

			} else {
				echo "<script src='".$jqueryVersions[0]."'></script>";
				$_SESSION['jquery'] = $jqueryVersions[0];
			}


			// These lines determine what Highchart version to load based on POST/SESSION variables.
			if (isset($_POST['highcharts'])) {
				echo '<script src="'.$_POST['highcharts'].'"></script>';
				$_SESSION['highcharts'] = $_POST['highcharts'];

			} else if (isset($_SESSION['highcharts'])) {
				echo "<script src='".$_SESSION['highcharts']."'></script>";

			} else {
				echo "<script src='".$highchartsVersions[0]."'></script>";
				$_SESSION['highcharts'] = $highchartsVersions[0];
			}

			// The variable "rep" is set:
			if (isset($_POST['repetitions'])) {
				$_SESSION['repetitions'] = $_POST['repetitions'];

			} else if (!isset($_SESSION['repetitions'])) {
				$_SESSION['repetitions'] = $defaultRepetitions;
			}
		?>

		<script src="javascript-functions.js"></script>

		<script><?php
				// This code makes available folders a json variable.
				// Similar code in dir-struct.php - but needed seperate for both php and js variables.

				// Filenames to ignore
				$del_vals = array(	0 => '.', 
					1 => '..'
					);

				$folderDir = 'tests-js/';
				$tmpFolders = scandir($folderDir);
				$folders = array();

				// Removing ignored filenames.
				foreach ($del_vals as $del_val) {
					if (($key = array_search($del_val, $tmpFolders)) !== false) {
						unset($tmpFolders[$key]);
					} 
				}

				// Sort array properly
				foreach ($tmpFolders as $folder) {
					if (is_dir('tests-js/'.$folder) && count(scandir('tests-js/'.$folder)) > 2) {
						$folders[] = $folder;
					}
				}

				// Sets the js variable as well.
				echo "\nvar folders = ".json_encode($folders). ",\n";

				// Updates js array result to current $_SESSION content. 
				echo "results = ".json_encode($_SESSION).",\n";

				// Sets the "rep" variable.
				echo "rep = ".json_encode($_SESSION['repetitions']).";\n";
			?></script>

	</head>

	<body>

		<?php
		// Code for picking up browser information.
			$browser = array(
				'version'   => '0.0.0',
				'majorver'  => 0,
				'minorver'  => 0,
				'build'     => 0,
				'name'      => 'unknown',
				'useragent' => ''
			);

			$browsers = array(
				'firefox', 'msie', 'opera', 'chrome', 'safari', 'mozilla', 'seamonkey', 'konqueror', 'netscape',
				'gecko', 'navigator', 'mosaic', 'lynx', 'amaya', 'omniweb', 'avant', 'camino', 'flock', 'aol'
			);

			if (isset($_SERVER['HTTP_USER_AGENT'])) {
				$browser['useragent'] = $_SERVER['HTTP_USER_AGENT'];
				$user_agent = strtolower($browser['useragent']);
				foreach($browsers as $_browser) {
					if (preg_match("/($_browser)[\/ ]?([0-9.]*)/", $user_agent, $match)) {
						$browser['name'] = $match[1];
						$browser['version'] = $match[2];
						@list($browser['majorver'], $browser['minorver'], $browser['build']) = explode('.', $browser['version']);
						break;
					}
				}

				$_SESSION['browsername'] = $browser['name'];
				$_SESSION['browserversion'] = $browser['version'];

			}

		?>

		<div id="topMenu">
			<h1>Highcharts Benchmarks</h1>


			<form method="post" action="index.php" id="setup">
				<table>
					<tr>
						<td><label for="jquery">jQuery version</label></td>
						<td><select name="jquery" id="jquery">
							<?php
								foreach ($jqueryVersions as $jquery) {
									$selected = $jquery == $_SESSION['jquery'] ? 'selected' : '';
									echo "<option value='".$jquery."' ".$selected.">".$jquery."</option>";
								}
							?>
						</select></td>
					</tr>
					<tr>
						<td><label for="highcharts">Highcharts version</label></td>
						<td>
							<select name="highcharts">
								<?php
									foreach ($highchartsVersions as $highcharts) {
										$selected = $highcharts == $_SESSION['highcharts'] ? 'selected' : '';
										echo "<option value='".$highcharts."' ".$selected.">".$highcharts."</option>";
									}
								?>
							</select>
						</td>
					</tr>
					<tr>
						<td>Repeat each test</td>
						<td>
							<select name="repetitions">
								<?php
									foreach ($repetitions as $rep) {
										$selected = $rep == $_SESSION['repetitions'] ? 'selected' : '';
										echo "<option value='$rep' $selected>$rep</option>";
									}
								?>
							</select> times
					</tr>
				</table>
			</form>
			<hr>

			<?php 
				// IE8 makes the runChart() function work in mysterious ways the second time the 
				// "Run absolutely everything" button is clicked. The browser, and if needed; the session must be restarted/destroyed.
				// This code gives out a message at once this button is clicked, the $_SESSION['allclicked'] function is set in dir-struct.php through buttonClick().
				if (isset($_SESSION['allclicked']) && $_SESSION['browsername'] == 'msie' && $_SESSION['browserversion'] < 9) {
					echo "<p id='warning'>Due to incompability issues with IE8, a new 'absolutely everything run' requires a browser restart. <br> Also make sure the session is destroyed (button below).</p>";
				} else {
					echo "<button id='all' onclick='buttonClick(this.id);'>Run all</button>";
				}

				// This code creates a reset results button by destroying the session.
				if (isset($_POST['reset'])) {
					session_destroy();
					echo "<script>location.href = 'index.php';</script>";
				} else {
					echo "
						<form method='post' action='index.php'>
							<button name='reset' value='reset'>Reset results</button>
						</form>
						";
				}
			?>

		</div>

		<div id="testOverview">

				<?php
					echo "<ul id='maintab'>";

					foreach($folders as $group) {
						echo "
								<li>
									<a href='index.php?group=".$group."'>".$group."</a>
									<button class=run id ='".$group."_all' onclick='buttonClick(this.id);'>Run</button>
									<span class='result ".$group."Result'>-</span>
								</li>
							";
					}

					echo "	<li class='total'> Total result: <span class='result' id='allResult'>-</span></li>
						</ul>";

					echo "<script> resultUpdate(); </script>";

				?>

		</div>

		<div id="rightList">
			<?php
				// This code sets up the right list containing the specific group tests.
				// Based on a few $_GET variables this also saves results, runs more tests
				// and redirects.

					// If group variable is set, like this: "index.php?group=area"
					if (isset($_GET['group'])) {

						// Creates the ul element that createRows() will use.
						echo " 	<ul id='testList'>
								</ul>";

						// Calls getScriptnames with groupname and the callbacks needed.
						echo "	<script>
								getScriptnames('".$_GET['group']."', createRows, resultUpdate);
								</script>";

					} else {

						// An url like "index.php?run=all&groupIndex=2" are sent when multiple
						// groups are being run.
						if (isset($_GET['run']) && isset($_GET['groupIndex'])) {

							$groupIndex = $_GET['groupIndex'];
							$lastIndex = $groupIndex - 1;

							// The result variable contains the result of the last group of tests run.
							if (isset($_GET['result'])) {
								$_SESSION[$folders[$lastIndex]] = $_GET['result'];
							}
							
							// The groupIndex is the number of the group / folder that is supposed to be run.
							// Also checks if all groups/folders are supposed to run.
							if ($groupIndex < count($folders) && $_GET['run'] == 'all') {
								echo "	<script>
											getScriptnames('".$folders[$groupIndex]."', getScripts);
										</script>";

							// If there are no more groups to be run the user is redirected to index.php.
							} else if ($_GET['run'] == 'all') {
								echo "<script>location.href = 'index.php';</script>";

							// If the run variable is not set to 'all' the user is redirected to the 
							// last group/folder that ran.
							} else {
								echo "<script>location.href = 'index.php?group=" . $folders[$lastIndex] . "';</script>";
							}
						}
					}	

			?>
		</div>

		<div id="container"></div>
	</body>

</html>