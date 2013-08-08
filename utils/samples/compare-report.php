<?php 

$compare = json_decode(file_get_contents('temp/compare.json'));

$browsers = array();
foreach ($compare as $path => $sample) {
	$range = array();
	foreach ($sample as $browser => $diff) {
		if (!in_array($browser, $browsers)) {
			$browsers[] = $browser;
		}
		$range[] = $diff;
	}
	$sample->range = round(abs(max($range) - min($range)), 2);
}


	
?><!DOCTYPE HTML>
<html>
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
		<title>Compare SVG</title>
		
		<style type="text/css">
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
			
			#report {
				border-radius: 5px;
				color: white;
				margin-bottom: 0.5em;
				border: 1px solid silver;
				font-family: Arial, sans-serif; 
				font-size: 0.8em; 
				padding: 0.5em; 
				
			}
		</style>
		
	</head>
	<body style="margin: 0">
		
		<div class="top-bar">
			
			<h2 style="margin: 0"><?php echo $path ?></h2> 
			
			<div style="text-align: right">
				<button id="reload" style="margin-left: 1em">Reload</button>
			</div>
		</div>
		
		<div>
			<table>
				<?php 
				$i = 0;
				foreach ($compare as $path => $sample) {
					// Insert browsers every nth row
					if ($i % 10 === 0) {


						echo "<tr><th><th>" . join($browsers, '</th><th>') . "</th><th>Range</th></tr>";

					}


					echo "<tr><th>$path</th>";
					
					foreach ($browsers as $browser) {
						echo '<td>' . (isset($sample->$browser) ? round($sample->$browser, 2) : '-') . '</td>';
					}

					echo "<td>$sample->range</td>"; 
					echo '</tr>';
					$i++;
				}
				?>
			</table>
		</div>
	</body>
</html>
