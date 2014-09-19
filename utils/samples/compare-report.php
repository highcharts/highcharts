<?php 

$compare = json_decode(file_get_contents('temp/compare.json'));

$browsers = array();
$comments = array();
foreach ($compare as $path => $sample) {
	$range = array();
	foreach ($sample as $key => $diff) {
		if ($key !== 'comment') {
			if (!in_array($key, $browsers)) {
				$browsers[] = $key;
			}
			$range[] = $diff;
		}
	}
	//$sample->range = round(abs(max($range) - min($range)), 2);
}


	
?><!DOCTYPE HTML>
<html>
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
		<title>Comparison report :: Highcharts Utils</title>
		<script src="http://code.jquery.com/jquery.js"></script>
		<link href="//netdna.bootstrapcdn.com/font-awesome/3.2.1/css/font-awesome.css" rel="stylesheet">
		<script>
			function updateDiff() {
				var $inputs = $('#compare-browsers').find('input'),
					checked = [];

				$inputs.each(function (i) {
					if ($(this)[0].checked) {
						checked.push(i);
					}
				});

				$('#results').find('tr').each(function () {
					var range = [], diff, className;
				
					$(this).find('td.value').each(function (i, td) {
						if (checked.indexOf(i) !== -1) {
							td = +td.innerHTML;
							if (!isNaN(td)) {
								range.push(td);
							}
						}
					});


					if (range.length < 2) {
						diff = '-';
					} else {
						diff = Math.abs(Math.max.apply(0, range) - Math.min.apply(0, range));

						if (diff === 0) {
							className = 'diff';
						} else {
							className = 'diff different';
							diff = Math.round(diff * 100) / 100;
						}
					}
					$(this).find('td.diff')
						.attr({
							'class': className
						})
						.html(diff);
				});
			}
			$(function () {
				var $compareDiv = $('#compare-browsers'),
					$inputs = $compareDiv.find('input');

				updateDiff();
				$inputs.each(function () {
					$(this).bind('change', function () {
						updateDiff();
					});
				})
			});
		</script>
		
		<style type="text/css">
			* {
				font-family: Arial, sans-serif;
			}
			body {
				font-size: 0.8em;
			}
			.top-bar {
				color: white;
				font-family: Arial, sans-serif; 
				font-size: 0.8em; 
				padding: 0.5em; 
				height: 3.5em;
				background: #57544A;
				background: -webkit-linear-gradient(top, #57544A, #37342A); 
				background: -moz-linear-gradient(top, #57544A, #37342A);
				box-shadow: 0px 0px 8px #888;
			}

			
			.top-bar a {
				color: white;
				text-decoration: none;
				font-weight: bold;
			}

			table {
				border-collapse: collapse;
			}
			th {
				text-align: left;
				background: #EEF;
			}
			td, th {
				border: 1px solid silver;
				padding: 3px;
			}
			.path {
				border-right: 2px solid black;
			}
			.diff {
				background: #EEF;
				border-left: 2px solid black;
				border-right: 2px solid black;
			}
			.different {
				background: red;
				color: white;
			}
		</style>
		
	</head>
	<body style="margin:0">


		<div class="top-bar">
			
			<h2 style="margin: 0">Comparison report</h2> 
		</div>

		<div style="margin: 10px">
			
			<div id="compare-browsers">
				<h3>Compare browsers</h3>
				<p>Select which browsers to compare in the Diff column</p>
				<?php
					foreach ($browsers as $i => $browser) {
						echo "
						<div>
							<input id='input-$i' value='$i' type='checkbox' checked>
							<label for='input-$i'>$browser</label>
						</div>

						";
					}

				?>
			</div>
			
			<div>
				<h3>Test results</h3>
				<table id="results">
					<?php 
					$i = 0;
					foreach ($compare as $path => $sample) {
						// Insert browsers every nth row
						if ($i % 10 === 0) {


							echo "
								<tr>
									<th class='path'></th>
									<th>" . join($browsers, '</th><th>') . "</th>
									<th class='diff'>Diff</th>
									<th class='comment'>Comment</th>
								</tr>
							";

						}



						echo "<tr><th class='path'>$i. <a href='compare-view.php?path=$path&amp;i=$i'>$path</a></th>";
						
						foreach ($browsers as $browser) {
							echo "<td class='value'>" . (isset($sample->$browser) ? round($sample->$browser, 2) : '-') . '</td>';
						}


						$range = isset($sample->range) ? $sample->range : '';
						echo "<td class='diff'>$range</td>"; 

						echo "<td class='comment'>";
						if (isset($sample->comment)) {
							echo "<i class='icon-" . $sample->comment->symbol . "'></i> " . $sample->comment->title;
						}

						echo '</td></tr>';
						$i++;
					}
					?>
				</table>
			</div>
		</div>
	</body>
</html>
