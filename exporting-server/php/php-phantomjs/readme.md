Locate these lines in index.php
	define ('PHANTOMJS_PATH', '/usr/local/bin/phantomjs');
	define ("PHANTOMJS_SCRIPT", 'highcharts-convert.js');

1. specify in index.php location of the phantom executable: f.eks. /usr/local/bin/phantomjs
2. specify in index.php location of the phantom script: highcharts-convert.js

Open highcharts-convert.js script and locate the config object

	var config = {
		/* define locations of mandatory javascript files */
		HIGHCHARTS: 'highcharts.js',
		HIGHCHARTS_MORE: 'highcharts-more',
		JQUERY: 'jquery-1.8.2.min.js'
	},
3. specify in the above config object the location of highcharts.js, jquery and evt. highcharts-more.js file. Point to these files relative from the highcharts-convert.js file.


