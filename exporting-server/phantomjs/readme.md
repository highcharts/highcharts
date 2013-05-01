#The Highcharts image convert script#
The file highcharts-convert.js is a [PhantomJS](http://phantomjs.org/) script to convert SVG or Highcharts JSON options objects to chart images. It is ideal for batch processing Highcharts configurations for attaching to emails or reports. It is also used in the featured (Java based) export server. An online demo with a GUI can be viewed at [export.highcharts.com/demo](http://export.highcharts.com/demo).

#Example usage#
	for commandline use.
	phantomjs highcharts-convert.js -infile options1.json -outfile chart1.png -scale 2.5 -width 300 -constr Chart -callback callback.js

	Run Phantomjs as Http-server.
	phantomjs highcharts-convert.js -host 127.0.0.1 -port 3003


#Description of command line parameters#

**-infile:** The file to convert, assumes it's either a JSON file, the script checks for the input file to have the extension '.json', or otherwise it assumes it to be an svg file.

**-outfile:** The file to output. Must be a filename with the extension .jpg, .png .pdf or .svg.

**-scale:** To set the zoomFactor of the page rendered by PhantomJs. For example, if the _chart.width_ option in the chart configuration is set to 600 and the scale is set to 2, the output raster image will have a pixel width of 1200. So this is a convenient way of increasing the resolution without decreasing the font size and line widths in the chart. This is ignored if the _-width_ parameter is set.

**-width:** Set the exact pixel width of the exported image or pdf. This overrides the _-scale_ parameter.

**-constr:** The constructor name. Can be one of _Chart_ or _StockChart_. This depends on whether you want to generate Highstock or basic Highcharts.

**-callback:** Filename of the _callback_. The _callback_ is a function which will be called in the constructor of Highcharts to be executed on chart load. All code of the callback must be enclosed by a function. See this example of contents of the callback file:

	function(chart) {
	    chart.renderer.arc(200, 150, 100, 50, -Math.PI, 0).attr({
	        fill : '#FCFFC5',
	        stroke : 'black',
	        'stroke-width' : 1
	     }).add();
	}

**-host** The hostname Phantomjs is listening to for POST-requests. If this parameter is specified, phantomjs startsup as Http-server.

**-port** The portnumber Phantomjs is listening to for POST-requests.

#Running the script as Httpserver
Start the Phantomjs as a server. You can use the same script as for commandline usage. Start the server like this.
	phantomjs highcharts-convert.js -host 127.0.0.1 -port 3003
You can ofcourse change the host and port to your needs. The server listens only to a POST-request. You can use the the same parameters as for commandline usage, but wrap them in a JSON structure.

Example of an POST request

	"{"infile":"{xAxis: {categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']},series: [{data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]}]};","callback":"function(chart) {chart.renderer.arc(200, 150, 100, 50, -Math.PI, 0).attr({fill : '#FCFFC5',stroke : 'black','stroke-width' : 1}).add();}","constr":"Chart","outfile":"C:\\programs\\apache-tomcat-7.0.37\temp/qHROUfDh.png"}"

#Installation of Phantomjs#
See http://phantomjs.org/download.html
