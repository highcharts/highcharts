<?php


$seriesType = $_GET ? $_GET['seriesType'] : 'line';
$markers = $_GET ? $_GET['markers'] : true;
$dataLabels = $_GET ? $_GET['dataLabels'] : false;
$chartCount = $_GET ? $_GET['chartCount'] : 16;
$pointsPerSeries = $_GET ? $_GET['pointsPerSeries'] : 16;
$seriesPerChart = $_GET ? $_GET['seriesPerChart'] : 2;
$chartWidth = $_GET ? $_GET['chartWidth'] : 250;
$libSource = $_GET ? $_GET['libSource'] : 'http://code.highcharts.com/highcharts.js';


$seriesTypeOptions = array(
	'area',
	'areaspline',	
	'column',
	'bar',
	'line',
	'pie',
	'scatter',
	'spline'
);
$chartCountOptions = array(1, 2, 4, 8, 16, 32, 64, 128);
$seriesCountOptions = array(1, 2, 4, 8, 16, 32);
$pointCountOptions = array(2, 4, 8, 16, 32, 64, 128, 500, 1000, 2000, 4000);
$chartWidthOptions = array(1000, 500, 250);
$libSourceOptions = array(
	'http://code.highcharts.com/2.2/highcharts.js',
	'http://code.highcharts.com/2.3/highcharts.js',
	'http://code.highcharts.com/highcharts.js',
	'http://github.highcharts.com/master/highcharts.js',
	'http://codev.highcharts.com/highcharts.js'
);


function randomData() {
	global $pointsPerSeries;
	$arr = array();
	for ($i = 0; $i < $pointsPerSeries; $i++) {
		$arr[] = rand(5, 95);
	}
	
	return $arr;
}

?><!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html>
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
		<title>Highcharts Example</title>
		
		
		<!-- 1. Add these JavaScript inclusions in the head of your page -->
		<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js"></script>
		<script type="text/javascript" src="<?php echo $libSource ?>"></script>
		
		<script type="text/javascript">
			var countLoaded = 0;
		</script>
		
		<link rel="stylesheet" href="/templates/yoo_symphony/css/template.css" type="text/css" />
  		<link rel="stylesheet" href="/templates/yoo_symphony/css/variations/brown.css" type="text/css" />
  		<style type="text/css">
  		.benchmark {
  			font-weight: bold;
  			font-size: 2em;
  		}
  		input[type="submit"] {
  			line-height: 2em;
  			background: green;
  			color: white;
  			padding: 0 1em;
  			font-weight: bold;
  			border-radius: 5px;
  			border: 1px solid darkgreen;
  		}
  		input[type="submit"]:hover {
  			border-color: black;
  		}
  		</style>
		
	</head>
	<body style="margin: 10px">
		<form action="" method="get">
			Series type:
			<select name="seriesType">
			<?php foreach ($seriesTypeOptions as $option) : ?>
				<option value="<?php echo $option ?>"<?php 
					if ($option == $seriesType) echo ' selected="selected"'?>>
						<?php echo $option ?></option>
			<? endforeach ?>
			</select>

			<input type="checkbox" name="markers" id="markers" <?php if ($markers) echo 'checked="checked"'; ?> />
			<label for="markers">Markers</label>
			
			<input type="checkbox" name="dataLabels" id="dataLabels" <?php if ($dataLabels) echo 'checked="checked"'; ?> />
			<label for="dataLabels">Data Labels</label>

			<br/>
			
			Number of charts:
			<select name="chartCount">
			<?php foreach ($chartCountOptions as $option) : ?>
				<option value="<?php echo $option ?>"<?php 
					if ($option == $chartCount) echo ' selected="selected"'?>>
						<?php echo $option ?></option>
			<? endforeach ?>
			</select>
			
			Series per chart:
			<select name="seriesPerChart">
			<?php foreach ($seriesCountOptions as $option) : ?>
				<option value="<?php echo $option ?>"<?php 
					if ($option == $seriesPerChart) echo ' selected="selected"'?>>
						<?php echo $option ?></option>
			<? endforeach ?>
			</select>
			
			Points per series:
			<select name="pointsPerSeries">
			<?php foreach ($pointCountOptions as $option) : ?>
				<option value="<?php echo $option ?>"<?php 
					if ($option == $pointsPerSeries) echo ' selected="selected"'?>>
						<?php echo $option ?></option>
			<? endforeach ?>
			</select>
			
			Chart width:
			<select name="chartWidth">
			<?php foreach ($chartWidthOptions as $option) : ?>
				<option value="<?php echo $option ?>"<?php 
					if ($option == $chartWidth) echo ' selected="selected"'?>>
						<?php echo $option ?>px</option>
			<? endforeach ?>
			</select>
			
			Source file:
			<select name="libSource">
			<?php foreach ($libSourceOptions as $option) : ?>
				<option value="<?php echo $option ?>"<?php 
					if ($option == $libSource) echo ' selected="selected"'?>>
						<?php echo $option ?></option>
			<? endforeach ?>
			</select>
			
			<input type="submit" value="Go" />
			
		</form>
		<div id="result" style="background: green; color: white; margin: 5px 0; padding: 5px"></div>
		
		<script type="text/javascript">
			var countLoaded = 0;
			var startTime;
			$(document).ready(function() {
				startTime = (new Date).getTime();
			});
		</script>
		
		
		<?php for ($chartNumber = 0; $chartNumber < $chartCount; $chartNumber++) : ?>
		<div id="container<?php echo $chartNumber ?>" 
			style="width: <?php echo $chartWidth?>px; height: 200px; float: left"></div>
		<script type="text/javascript">
		$(document).ready(function() {
			var chart = new Highcharts.Chart({
				chart: {
					renderTo: 'container<?php echo $chartNumber ?>',
					borderWidth: 1,
					defaultSeriesType: '<?php echo $seriesType ?>',
					events: {
						load: function() {
							countLoaded++;
							
							if (countLoaded >= <?php echo $chartCount ?>) {
								var time = (new Date).getTime() - startTime;
								$('#result').html('<?php echo $chartCount ?> charts loaded in <span class="benchmark">'+ time +'</span> milliseconds.');
							}
						}
					}
				},
				plotOptions: {
					series: {
						dataLabels: {
							enabled: <?php echo $dataLabels ? 'true' : 'false' ?>
						},
						marker: {
							enabled: <?php echo $markers ? 'true' : 'false' ?>
						}
					}
				},
				series: [
				<?php 
				$series = array();
				for ($seriesNumber = 0; $seriesNumber < $seriesPerChart; $seriesNumber++) {
					$series[] = '{ data: [' . join(randomData(), ',') . ']}';
				}
				echo join($series, ",\n");
				?>
				]
			});
			
			
		});
		</script>
		<? endfor ?>
	</body>
</html>
