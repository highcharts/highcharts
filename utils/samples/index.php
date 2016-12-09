
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
				To compare against a specific commit in a visual browser, set the <code>leftPath</code> to the commit id in the <code>settings.php</code>
				file.</li>
			<li>See the <a href="https://github.com/highslide-software/highcharts.com/tree/master/utils#tests">GitHub readme file</a> 
				for guidelines on setting up the tests.</li>
			<li>Tests can also run in <strong>PhantomJS</strong>, which is faster than a visual browser. Navigate to the <code>/utils/samples</code> directory and
				run <code>phantomjs phantomtest.js</code>. If there are errors, they can be inspected in a browser by clicking "View
				results for PhantomJS" at the top left. Use the <code>--commit</code> argument to run the visual tests against a
				specific commit, for example when you are testing an uncommitted bug fix against the latest commit.</li>
			
			<li><strong>Mouse events</strong> are emulated using the <a href="https://github.com/highcharts/highcharts/blob/master/utils/samples/test-controller.js" target="_blank">TestController</a>
			that is available in the test environment (through compare-iframe.php). To emulate
			a mouse event on a specific target, its position can be found using <code>getBBox()</code>.
			<pre>
// Instanciate
var controller = TestController(chart);
 
// Simulate panning with the shift key pressed. X and Y are chart coordinates.
test.mousedown(200, 100, { shiftKey: true });
test.mousemove(150, 100, { shiftKey: true });
test.mouseup();
 </pre>
			</li>
		</ul>
	</body>
</html>
