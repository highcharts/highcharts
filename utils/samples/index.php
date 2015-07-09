
<!DOCTYPE HTML>
<html>
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
		<title>Sample viewer - Highcharts</title>
		<link rel="stylesheet" type="text/css" href="style.css"/>
	</head>
	<body class="page">

		<h1>Sample viewer and test tool for Highcharts</h1>

		<ul>
			<li>Use the icon next to the sample to either compare against a previous version, or to run a unit test. Unit tests
				are marked with a jigsaw puzzle icon.</li>
			<li>By default, visual tests compare against the latest stable release.
				To compare against a specific commit, set the <code>leftPath</code> to the commit id in the <code>settings.php</code>
				file.</li>
			<li>Tests can also be run in PhantomJS, which is a bit faster. Navigate to the <code>/utils/samples</code> directory and
				run <code>phantomjs phantomtest.js</code>. If there are errors, they can be inspected in a browser by clicking "View
				results for PhantomJS" at the top left.</li>
			<li>See the <a href="https://github.com/highslide-software/highcharts.com/tree/master/utils#tests">GitHub readme file</a> for guidelines on setting up the tests.</li>
		</ul>
	</body>
</html>
