<?php 
require_once('functions.php');


$browsers = array('Safari', 'Chrome', 'Firefox', 'Edge', 'MSIE');
$comments = array();
$compare = array();
foreach($browsers as $browserKey) {
	if (file_exists(compareJSON($browserKey))) {
		$results = json_decode(file_get_contents(compareJSON($browserKey)));

		foreach ($results as $path => $sample) {
			// echo "$browserKey, $path, $sample->diff<br>";
			$range = array();
			$range[] = $sample->diff;
			@$compare[$path]->$browserKey = $sample->diff;
			if (isset($sample->comment)) {
				@$compare[$path]->comment = $sample->comment;
			}
		}
	}
}


	
?><!DOCTYPE HTML>
<html>
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
		<title>Comparison report :: Highcharts Utils</title>
		<script src="http://code.jquery.com/jquery.js"></script>
		<link href="//netdna.bootstrapcdn.com/font-awesome/3.2.1/css/font-awesome.css" rel="stylesheet">
		<script src="http://code.highcharts.com/highcharts.src.js"></script>

		<script>
		/* eslint-disable */
		/**
	     * Create a constructor for sparklines that takes some sensible defaults and merges in the individual
	     * chart options. This function is also available from the jQuery plugin as $(element).highcharts('SparkLine').
	     */
	    Highcharts.SparkLine = function (a, b, c) {
	        var hasRenderToArg = typeof a === 'string' || a.nodeName,
	            options = arguments[hasRenderToArg ? 1 : 0],
	            defaultOptions = {
	                chart: {
	                    renderTo: (options.chart && options.chart.renderTo) || this,
	                    backgroundColor: null,
	                    borderWidth: 0,
	                    type: 'area',
	                    margin: [2, 0, 2, 0],
	                    width: 120,
	                    height: 20,
	                    style: {
	                        overflow: 'visible'
	                    },
	                    skipClone: true
	                },
	                title: {
	                    text: ''
	                },
	                credits: {
	                    enabled: false
	                },
	                xAxis: {
	                    labels: {
	                        enabled: false
	                    },
	                    title: {
	                        text: null
	                    },
	                    startOnTick: false,
	                    endOnTick: false,
	                    tickPositions: []
	                },
	                yAxis: {
	                    endOnTick: false,
	                    startOnTick: false,
	                    labels: {
	                        enabled: false
	                    },
	                    title: {
	                        text: null
	                    },
	                    tickPositions: [0]
	                },
	                legend: {
	                    enabled: false
	                },
	                tooltip: {
	                    backgroundColor: null,
	                    borderWidth: 0,
	                    shadow: false,
	                    useHTML: true,
	                    hideDelay: 0,
	                    shared: true,
	                    padding: 0,
	                    positioner: function (w, h, point) {
	                        return { x: point.plotX - w / 2, y: point.plotY - h };
	                    }
	                },
	                plotOptions: {
	                    series: {
	                        animation: false,
	                        lineWidth: 1,
	                        shadow: false,
	                        states: {
	                            hover: {
	                                lineWidth: 1
	                            }
	                        },
	                        marker: {
	                            radius: 1,
	                            states: {
	                                hover: {
	                                    radius: 2
	                                }
	                            }
	                        },
	                        fillOpacity: 0.25
	                    },
	                    column: {
	                        negativeColor: '#910000',
	                        borderColor: 'silver'
	                    }
	                }
	            };

	        options = Highcharts.merge(defaultOptions, options);

	        return hasRenderToArg ?
	            new Highcharts.Chart(a, options, c) :
	            new Highcharts.Chart(options, b);
	    };
	    </script>
		<script>
			/* eslint-disable */
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
									<th class='sparkline'>Variance</th>
									<th class='diff'>Diff</th>
									<th class='comment'>Comment</th>
								</tr>
							";

						}
						$data = array();
						$showChart = false;



						echo "<tr><th class='path'>$i. <a href='compare-view.php?path=$path&amp;i=$i'>$path</a></th>";
						
						foreach ($browsers as $browser) {
							echo "<td class='value'>" . (isset($sample->$browser) ? round($sample->$browser, 2) : '-') . '</td>';

							if (isset($sample->$browser)) {
								$data[] = round($sample->$browser, 2);
								if ($sample->$browser > 0) {
									$showChart = true;
								}
							}
						}

						$range = isset($sample->range) ? $sample->range : '';
						
						echo "
						<td id='sparkline-$i' class='sparkline'>$range</td>
						";
						if ($showChart) {
							echo "
							<script>
							$('#sparkline-$i').highcharts('SparkLine', {
								series: [{
									data: [" . join($data, ', ') . "]
								}]
							});
							</script>
							";
						}


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
