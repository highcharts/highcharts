Command Line Rendering
======================

Node Export Server
------------------

In addition to being able to run as a server, our [node export server](https://www.highcharts.com/docs/export-module/258) is a fully functional command line tool for creating chart images in PNG, JPEG, PDF or SVG, based on chart configurations or chart SVGs. Whether you want to generate charts in automated reports or emails, have consistent images between front and back end, or simply batch convert charts to images, the node export server is your tool.

Install with `npm install highcharts-export-server -g` or clone from [https://github.com/highcharts/node-export-server](https://github.com/highcharts/node-export-server)

The tool has a simple command line syntax: `highcharts-export-server <arguments>`

Examples:

*   Convert a chart configuration to a PNG image: `highcharts-export-server -infile chartConfig.json -outfile chart.png`
*   Batch convert three charts into images: `highcharts-export-server -batch "infile1.json=outfile1.png;infile2.json=outfile2.png;infile3.json=outfile3.png;"`

See documentation on [GitHub](https://github.com/highcharts/node-export-server/blob/master/README.md) for more information

Deprecated Export Server
------------------------

Our older, [legacy export server](https://highcharts.com/docs/export-module/setting-up-the-server) includes a PhantomJS script package, which makes it possible to run Highcharts on the server without a client internet browser involved. **Note that there are no features in the legacy export server which are not included in the new node export server**.

Typical use cases are:

*   you want to include your charts in emails or automated management reports
*   you want to have a consistency between graphs you present on your website and your backend produced reports

We're using [PhantomJS](https://phantomjs.org) for this, which emulates a browser environment (Webkit) on the server. PhantomJS comes with a JavaScript API and we used this for making a script for converting our graphs to another file format. In summary, it works like this; the script ([highcharts-convert.js](https://github.com/highcharts/highcharts-export-server/tree/master/phantomjs/highcharts-convert.js)) starts a browser, opens a page with Highcharts loaded in it and produces a chart and saves it as an image, PDF or SVG.

### Command line usage

PhantomJS is started from the command line with our highcharts-convert.js script as first parameter. With the other command line parameters we pass over the Highcharts configuration, the name of the output file and parameters for the graphical layout. Example usage on the command line:

    
    phantomjs highcharts-convert.js -infile options.js -outfile chart.png -scale 2.5 -width 300 

Description of command line parameters:

\-infile

The file to convert, the script have to find if this is a javascript file with a options object or a svg file.  It checks the input file for beginning with "<svg", "<?xml" or "<!doctype". Then it's a svg file, otherwise it's presumed to be an options file.

\-outfile

The file to output. Must be a filename with the extension .jpg, .png .pdf or .svg.

\-type

The type can be of jpg, png, pfd or svg. Ignored when 'outfile' is defined. This parameter is usefull when the script runs in servermode and outputs an image as a 64bit string. When not running in servermode the output file is stored in 'tmpdir'.

\-scale

To set the zoomFactor of the page rendered by PhantomJs. For example, if the chart.width option in the chart configuration is set to 600 and the scale is set to 2, the output raster image will have a pixel width of 1200. So this is a convenient way of increasing the resolution without decreasing the font size and line widths in the chart. This is ignored if the -width parameter is set.

\-width

Set the exact pixel width of the exported image or pdf. This overrides the -scale parameter.

\-constr

The constructor name. Can be one of Chart or StockChart. This depends on whether you want to generate Highstock or basic Highcharts.

\-callback

Filename containing a callback JavaScript. The callback is a function which will be called in the constructor of Highcharts to be executed on chart load. All code of the callback must be enclosed by a function. Example of contents of the callback file: function(chart) { chart.renderer.arc(200, 150, 100, 50, -Math.PI, 0).attr({ fill : '#FCFFC5', stroke : 'black', 'stroke-width' : 1 }).add(); }

\-resources

Stringified JSON which can contain three properties js, css and files. See below here for an example

```json
{ 
"files": "highstock.js,highcharts-more.js,data.js,drilldown.js,funnel.js,heatmap.js,treemap.js,highcharts-3d.js,no-data-to-display.js,map.js,solid-gauge.js,broken-axis.js", 
"css": "g.highcharts-series path {stroke-width:2;stroke: pink}", 
"js": "document.body.style.webkitTransform = 'rotate(-10deg)';" 
}
```

*   `files`: A comma separated string of filenames that need to be injected to the page for rendering a chart. Only files with the extensions `.css` and `.js` are injected, the rest is ignored.
*   `css`: css inserted in the body of the page
*   `js`: javascript inserted in the body of the page

\-host

Specify the host for running the script as an lightweight http-server. The server responds to JSON objects send to the server in a POST

\-port

The portnumber Phantomjs is listening on for POST-requests.

\-tmpdir

Specify where the scipt stores temporary- or output files, when output isn't defined.

### Start as a web server

You can also let the script start a web server. By doing so, we don't have to start a PhantomJS process over and over again for every conversion job and this results in a better performance. While running the script in web server mode, the result isn’t saved to a file, but returned as a base64 string, unless when you want to export to SVG or PDF.

This is how you start a web server in PhantomJS with the highcharts-convert.js script, change the host and port to your needs. However do not expose the PhantomJS web server to the outside world, it’s not intended as a general production server.

    
    phantomjs highcharts-convert.js -host 127.0.0.1 -port 3003

Note that the web server listens only to POST requests. Use the same parameters as for command line usage, but wrap them in a JSON structure. See this example for the content of a POST request. Note these parameters are defined: 'infile', 'callback' and 'constr';

```json
{"infile":"{xAxis: {categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']},series: [{data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]}]};","callback":"function(chart) {chart.renderer.arc(200, 150, 100, 50, -Math.PI, 0).attr({fill : '#FCFFC5',stroke : 'black','stroke-width' : 1}).add();}","constr":"Chart"}
```

This is how you can send a POST from the command line with Curl (MAC & Ubuntu);

```sh
curl -H "Content-Type: application/json" -X POST -d '{"infile":"{xAxis: {categories: [\"Jan\", \"Feb\", \"Mar\"]},series: [{data: [29.9, 71.5, 106.4]}]}"}' 127.0.0.1:3005
```

Example of sending the contents of a file

```sh
curl http://127.0.0.1:3005 -H "Content-Type: application/json" -X POST --data-binary "@/Users/yourname/yourfolder/chart-config.json"
```

This is how you can send a POST from the commandline with Curl (Windows);

```sh
curl -H "Content-Type: application/json" -X POST -d "{\"infile\":\"{series:[{data:[29.9,71.5,106.4]}]}\"}" 127.0.0.1:3005
```

### Setting it up

1.  For download and install of PhantomJS, see [https://phantomjs.org/download.html](https://phantomjs.org/download.html)
2.  Clone the [highcharts-export-server](https://github.com/highcharts/highcharts-export-server) repository from GitHub or download the zip file containing the repository and copy the [phantomjs](https://github.com/highcharts/highcharts-export-server/blob/master/phantomjs) folder to your installation folder
3.  In the copied phantomjs folder is a file named [resources.json](https://github.com/highcharts/highcharts-export-server/blob/master/phantomjs/resources.json). This file specifies the Highcharts javascript files for creating the charts. Make sure the files can be looked up through the resources.json file. The files will be looked up relative to the working directory of PhantomJS, but you can also specify your own locations.
4.  If you experience issues with PDF export not matching the page size, try changing the dpiCorrection setting in the highcharts-convert.js script. The issue is likely related to this PhantomJS [bug](https://github.com/ariya/phantomjs/issues/12685).
5.  You're good to go!