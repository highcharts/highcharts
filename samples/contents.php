<!DOCTYPE HTML>
<html>
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
		<title>Highstock Example</title>
		
		<style type="text/css">
			* {
				font-family: Arial, Verdana;
				font-size: 12px;
			}
			ul {
				margin-left: 0;
				padding-left: 0;
			}
			li {
				list-style: none;
				margin-left: 0;
				padding-left: 0;
			}
			a {
				text-decoration: none;
			}
			
			a:visited {
				color: silver;
			}
			
		</style>
		
		
	</head>
	<body><?php

if ($handle = opendir(dirname(__FILE__). '/stock')) {
	
	$i = 1;
	while (false !== ($file = readdir($handle))) {
		if (preg_match('/^[a-z]+$/', $file)) {
			echo "
			<h4>$file</h4>
			<ul>
			";
		
			// loop over the inner directories
			if ($innerHandle = opendir(dirname(__FILE__). '/stock/'. $file)) {
				while (false !== ($innerFile = readdir($innerHandle))) {
					$next = $i + 1;
					if (preg_match('/^[a-z\-]+$/', $innerFile)) {
						echo "
						<li>$i) <a target='main' id='i$i' href='view.php?path=stock/$file/$innerFile&next=$next'>$innerFile</a></li>
						";
						$i++;
					}
				}
			}
		
			echo "</ul>";
		}
	}


	closedir($handle);
}
?>
</body>
</html>