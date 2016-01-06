<title>Highcharts samples listing</title>
<h1>Highcharts samples listing</h2>

<p>Jump to <a href="#highcharts">Highcharts</a>, <a href="#maps">Highmaps</a>, <a href="#stock">Highstock</a></p>

<?php


$products = array('highcharts', 'maps', 'stock');
$samplesDir = '';

foreach ($products as $dir) {
	if ($handle = opendir($samplesDir . $dir)) {

		echo "<h2 id='$dir'>$dir</h2>";
		
		while (false !== ($file = readdir($handle))) {
			if (preg_match('/^[a-z\-]+$/', $file)) {
				echo "
				<h4>$dir/$file</h4>
				<ul>
				";
			
				// loop over the inner directories
				if ($innerHandle = opendir($samplesDir . $dir . '/'. $file)) {
					while (false !== ($innerFile = readdir($innerHandle))) {
						if (preg_match('/^[a-z0-9\-,]+$/', $innerFile)) {
							$path = "$dir/$file/$innerFile";
							$suffix = '';
							$dissIndex = '';
							
							echo "
							<li>
								$innerFile
								(<a href='view.php?path=$path'>view</a>,
								<a href='http://jsfiddle.net/gh/get/jquery/1.7.2/highcharts/highcharts/tree/master/samples/$path/'>fiddle</a>)
							</li>
							";
						}
					}
				}
			
				echo "</ul>";
			}
		}
	
	
		closedir($handle);
	}
}