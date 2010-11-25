<?php


$seriesType = $_GET ? $_GET['seriesType'] : 'line';
$chartCount = $_GET ? $_GET['chartCount'] : 16;
$pointsPerSeries = $_GET ? $_GET['pointsPerSeries'] : 16;
$seriesPerChart = $_GET ? $_GET['seriesPerChart'] : 2;
$chartWidth = $_GET ? $_GET['chartWidth'] : 250;
$libSource = $_GET ? $_GET['libSource'] : 'highcharts.js';


$seriesTypeOptions = array(
	'area',
	'areaspline',	
	'column',
	'line',
	'line - no markers',
	'pie',
	'scatter',
	'spline'
);
$chartCountOptions = array(1, 2, 4, 8, 16, 32, 64, 128);
$seriesCountOptions = array(1, 2, 4, 8, 16, 32);
$pointCountOptions = array(2, 4, 8, 16, 32, 64, 128, 500, 1000, 2000, 4000);
$chartWidthOptions = array(1000, 500, 250);
$libSourceOptions = array(
	'1.2.5/highcharts.js',
	'2.0.5/highcharts.js',
	'/highcharts.src.js'
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
		<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.4.2/jquery.min.js"></script>
		<script type="text/javascript" src="../js/<?php echo $libSource ?>"></script>
		
		<?php if ($libSource != 'prerelease/highcharts.1.3.src.js') : ?>
		<!--[if IE]>
			<script type="text/javascript" src="../js/excanvas.compiled.js"></script>
		<![endif]-->
		<?php endif; ?>
		
		
		<script type="text/javascript">
			var countLoaded = 0;
		</script>
		
		
		
	</head>
	<body>
		<form action="" method="get">
			Series type:
			<select name="seriesType">
			<?php foreach ($seriesTypeOptions as $option) : ?>
				<option value="<?php echo $option ?>"<?php 
					if ($option == $seriesType) echo ' selected="selected"'?>>
						<?php echo $option ?></option>
			<? endforeach ?>
			</select>
			
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
<?php 		
		// special
if ($seriesType == 'line - no markers') {
	$seriesType = 'line';
	$noMarkers = true;
}
		?>
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
								$('#result').html('<?php echo $chartCount ?> charts loaded in '+ time +' milliseconds.');
							}
						}
					}
				},
				<?php if ($noMarkers): ?>
				plotOptions: {
					series: {
						marker: {
							enabled: false,
							states: {
								hover: {
									enabled: true
								}
							}
						}
					}
				},
				<?php endif ?>
				series: [
				<?php for ($seriesNumber = 0; $seriesNumber < $seriesPerChart; $seriesNumber++) : ?>
					{
					data: [<?php echo join(randomData(), ',') ?>]
				},
				<?php endfor ?>
				]
			});
			
			
		});
		</script>
		<? endfor ?>
	</body>
</html>
