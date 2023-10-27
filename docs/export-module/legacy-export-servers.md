These methods are deprecated, please use our new ones, which can be found [here](https://highcharts.com/docs/export-module/setting-up-the-server).

Deprecated export servers
-------------------------

Previously we had two older varieties of servers to choose from; these export servers are no longer maintained. The documentation below serves for reference purposes only.

1.  PhantomJS based server
2.  The Java and PhantomJS-based server, which also supports server-side rendering of charts
3.  PHP and Batik-based

### 1. Export server based on PhantomJS

Our older, [legacy export server](https://github.com/highcharts/highcharts-export-server) includes a PhantomJS script package, which makes it possible to run Highcharts on the server without a client internet browser involved. **Note that there are no features in the legacy export server which are not included in the new node export server**.

Typical use cases are:

*   you want to include your charts in emails or automated management reports
*   you want to have a consistency between graphs you present on your website and your backend produced reports

We're using [PhantomJS](https://phantomjs.org) for this, which emulates a browser environment (Webkit) on the server. PhantomJS comes with a JavaScript API and we used this for making a script for converting our graphs to another file format. In summary, it works like this; the script ([highcharts-convert.js](https://github.com/highcharts/highcharts-export-server/tree/master/phantomjs/highcharts-convert.js)) starts a browser, opens a page with Highcharts loaded in it and produces a chart and saves it as an image, PDF or SVG.

### Command line usage

PhantomJS is started from the command line with our highcharts-convert.js script as first parameter. With the other command line parameters we pass over the Highcharts configuration, the name of the output file and parameters for the graphical layout. Example usage on the command line:


    phantomjs highcharts-convert.js -infile options.js -outfile chart.png -scale 2.5 -width 300 

Description of command line parameters:

`-infile`

The file to convert, the script has to find out if this is a javascript file with an options object or a svg file.  It checks if the input file begins with `<svg`, `<?xml` or `<!doctype`. If it does then it's a svg file, otherwise it's presumed to be an options file.

`-outfile`

The file to output. Must be a filename with the extension .jpg, .png .pdf or .svg.

`-type`

The type can be of jpg, png, pfd or svg. Ignored when `-outfile` is set. This parameter is useful when the script runs in servermode and outputs an image as a 64bit string. When not running in servermode the output file is stored in `-tmpdir`.

`-scale`

Set the zoomFactor of the page rendered by PhantomJs. For example, if the chart.width option in the chart configuration is set to 600 and the scale is set to 2, the output raster image will have a pixel width of 1200. So this is a convenient way of increasing the resolution without decreasing the font size and line widths in the chart. This is ignored if the `-width` parameter is set.

`-width`

Set the exact pixel width of the exported image or pdf. This overrides the `-scale` parameter.

`-constr`

The constructor name. Can be one of `Chart` or `StockChart`. This depends on whether you want to generate Highcharts Stock or basic Highcharts.

`-callback`

File containing a JavaScript callback. The callback is a function which will be called in the constructor of Highcharts to be executed on chart load. All code of the callback must be enclosed by a function. Example contents of the callback file: `function(chart) { chart.renderer.arc(200, 150, 100, 50, -Math.PI, 0).attr({ fill : '#FCFFC5', stroke : 'black', 'stroke-width' : 1 }).add(); }`

`-resources`

Stringified JSON which can contain three properties: js, css and files. Example:

```json
{
"files": "highstock.js,highcharts-more.js,data.js,drilldown.js,funnel.js,heatmap.js,treemap.js,highcharts-3d.js,no-data-to-display.js,map.js,solid-gauge.js,broken-axis.js",
"css": "g.highcharts-series path {stroke-width:2;stroke: pink}",
"js": "document.body.style.webkitTransform = 'rotate(-10deg)';"
}
```

*   `files`: A comma separated string of filenames that need to be injected to the page for rendering a chart. Only files with the extensions `.css` and `.js` are injected, the rest is ignored.
*   `css`: Css inserted in the body of the page
*   `js`: Javascript inserted in the body of the page

`-host`

Specify the host for running the script as a lightweight HTTP server. The server responds to JSON objects sent to the server in a POST request.

`-port`

The port number PhantomJS is listening on for POST requests.

`-tmpdir`

Specify where the scipt stores temporary- or output files, when output isn't defined.

### Start as a web server

You can also let the script start a web server. By doing so, we don't have to start a PhantomJS process over and over again for every conversion job and this results in better performance. While running the script in web server mode, the result isn’t saved to a file, but returned as a base64 string, unless when you want to export to SVG or PDF.

This is how you start a web server in PhantomJS with the highcharts-convert.js script, change the host and port to your needs. However do not expose the PhantomJS web server to the outside world, it’s not intended as a general production server.


    phantomjs highcharts-convert.js -host 127.0.0.1 -port 3003

Note that the web server listens only to POST requests. Use the same parameters as for command line usage, but wrap them in a JSON structure. See this example for the content of a POST request. Note that these parameters are defined: `infile`, `callback` and `constr`;

```json
{"infile":"{xAxis: {categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']},series: [{data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]}]};","callback":"function(chart) {chart.renderer.arc(200, 150, 100, 50, -Math.PI, 0).attr({fill : '#FCFFC5',stroke : 'black','stroke-width' : 1}).add();}","constr":"Chart"}
```

This is how you can send a POST from the command line with curl (Mac & Linux):

```sh
curl -H "Content-Type: application/json" -X POST -d '{"infile":"{xAxis: {categories: [\"Jan\", \"Feb\", \"Mar\"]},series: [{data: [29.9, 71.5, 106.4]}]}"}' 127.0.0.1:3005
```

Example of sending the contents of a file:

```sh
curl http://127.0.0.1:3005 -H "Content-Type: application/json" -X POST --data-binary "@/Users/yourname/yourfolder/chart-config.json"
```

This is how you can send a POST from the command line with curl (Windows):

```sh
curl -H "Content-Type: application/json" -X POST -d "{\"infile\":\"{series:[{data:[29.9,71.5,106.4]}]}\"}" 127.0.0.1:3005
```

### Setting it up

1.  To download and install of PhantomJS, see [https://phantomjs.org/download.html](https://phantomjs.org/download.html).
2.  Clone the [highcharts-export-server](https://github.com/highcharts/highcharts-export-server) repository from GitHub or download the zip file containing the repository and copy the [phantomjs](https://github.com/highcharts/highcharts-export-server/blob/master/phantomjs) folder to your installation folder.
3.  In the copied phantomjs folder is a file named [resources.json](https://github.com/highcharts/highcharts-export-server/blob/master/phantomjs/resources.json). This file specifies the Highcharts javascript files for creating the charts. Make sure the files can be looked up through the resources.json file. The files will be looked up relative to the working directory of PhantomJS, but you can also specify your own locations.
4.  If you experience issues with PDF export not matching the page size, try changing the `dpiCorrection` setting in the highcharts-convert.js script. The issue is likely related to this PhantomJS [bug](https://github.com/ariya/phantomjs/issues/12685).
5.  You're good to go!

### 2. Export server based on Java and PhantomJS

This solution also includes a standalone solution for creating charts on the server, without a client involved. Highcharts is using this export server at export.highcharts.com, the default Highcharts export server. It's a server which is desgined with a large network load in mind. Requests to this server are concurrently handled by an serverpool.

It takes either SVG or Highcharts options (in javascript) as input and converts it to images (PNG, JPEG ), PDF or SVG.

#### 2.1. Prerequisites for installation

The java based Highcharts export-server has the following prerequisites:

*   install an java application server (for example: Apache Tomcat, Jboss, TC server, Resin)

_TIP: use Jetty (application server) during development, requires no installation_

*   install Java 1.8
*   install Maven 3
*   install PhantomJS 2.0 on the server, [see here](https://bitbucket.org/ariya/phantomjs/downloads)
*   download the source for the export-server module from [Github](https://github.com/highcharts/highcharts-export-server/tree/master/java). This is a maven module. Save the _highcharts-export_ folder to a convenient place.

#### 2.2. Configuration

Edit the `app-convert.properties` file in `highcharts-export/highcharts-export-web/src/main/webapp/WEB-INF/spring` and change the properties if necessary. Read the comments in the property file, for deciding what you need to change.

You can for example change the location of the PhantomJS executable, the name of the convert script, timeouts and poolsize of how many PhantomJS processes you want to run.

#### 2.3. Copy Highcharts Javascript to the maven project

Highcharts JS is needed on the server for supporting server-side rendering of charts. Instead of posting a SVG from the browser to the server, you can also post a Highcharts configuration in javascript and let PhantomJS generate the chart on the server. Read more on server-side rendering [here.](https://highcharts.com/docs/export-module/render-charts-serverside)

To make this work we need to run a headless browser, PhantomJS and PhantomJS needs in it's turn the Highcharts JS files on the server. For licensing reasons the Highcharts export server doesn't ship with Highcharts javascript files. We need to copy the Highcharts files manually to the project.

Save `highcharts.js` or `highstock.js` for stock charts, `highcharts-more.js` (for bubble, range, polar charts), `funnel.js` for supporting funnel charts, etc. to this location: `highcharts-export-server/java/highcharts-export/highcharts-export-convert/src/main/resources/phantomjs` It's recommended to use the Highcharts compiled files from [code.highcharts.com](https://code.highcharts.com)/[highcharts-version-you-use]/

The javascript files are already configured in the `resources.json` file which is used by PhantomJS to determine which files need to be injected to PhantomJS. If convenient, you can specify alternative paths in the `resources.json`. So make sure the resources.json matches the files you just copied in this step.

#### 2.4. Install the Highcharts-export module in your local Maven repository

Open a Dos/Shell prompt and navigate to the main folder of the export server, _highcharts-export_ and install it in your local Maven repository. This installs also all dependencies (libraries) for the module.

$ cd highcharts-export/
$ mvn install

#### 2.5. Building a .war file

After you have configured and installed the application, you can compile the project files. Open a commandline in a terminal or DOS and navigate to the `highchart-export-web` folder and while standing here, type the following in a terminal: mvn clean package

$ cd highcharts-export-web/
$ mvn clean package

After compiling and the message BUILD SUCCESS, you will find a file: highcharts-export-web.war in the `highcharts-export/highcharts-export-web/target` folder.


    [INFO] ------------------------------------------------------------------------
     [INFO] BUILD SUCCESS
     [INFO] ------------------------------------------------------------------------
     [INFO] Total time: 2.476s
     [INFO] Finished at: Wed Jun 26 14:52:07 CEST 2013
     [INFO] Final Memory: 15M/215M
     [INFO] ------------------------------------------------------------------------
     highcharts-export-web $> ls target/
     classes                highcharts-export-web        maven-archiver
     generated-sources        **highcharts-export-web.war**    surefire
     Gerts-MacBook-Pro:highcharts-export-web gert$

Upload/copy this to the application server. You're done with setting up the highcharts-export server!

#### 2.6. Some Tips

*   We added the Jetty Server dependency in pom.xml file for testing convenience. For running the export-server locally, during development, navigate in a DOS/Shell to the highcharts-export/highcharts-export-web folder, and run this command: `mvn jetty:run`. This starts the Jetty application server and the application is now accessible at `http://localhost:8080/export`.

*   Change you url property for the [exporting option](https://api.highcharts.com/highcharts#exporting.url) in your (javascript) highcharts configuration, and point it to the new installed exporting-server, otherwise it still points at Highcharts export-server at http://export.highcharts.com


        exporting:{
        url:'http://new.server.com/highcharts-export/'
        }
*   Remember to install necessary fonts on the server. When characters are missing, they will be displayed as squares on the exported charts. The application will automatically pick the fonts up after installation.

    Highcharts sets its font globally to Lucida Grande, so if you use for example a japanese font, you have to set the fontFamily to a japanese-able font with [Highcharts.setOptions](https://api.highcharts.com/highcharts#Highcharts.setOptions), for making the export work.

*   When having problems while using the export-server, the first thing you could do is to enable logging Debug messages. This can give you a clue of what's going wrong. To enable Debug messages, uncomment these lines in highcharts-export/highcharts-export-web/src/main/resources/log4j.properties



    \# Debug specific class
     `log4j.logger.services=DEBUG`
     `log4j.logger.converter=DEBUG`
     `log4j.logger.exporter=DEBUG`
     `log4j.logger.pool=DEBUG`

*   **When running on WebLogic**

By default WebLogic registers its own `URLStreamHandler to handle http` URLs. This results in that the Connection silently returns and empty files being returned from the server. The solution is to get in a reference to Java's default `URLStreamHandler` instead of the one from WebLogic. Follow these steps

1. Alter this file: `highcharts-export\highcharts-export-convert/src/main/java/com/highcharts/export/server.Server.java`

Change line 94,95 from


    URL url = new URL("http://" + host + ":"
     + port + "/");

to


    sun.net.www.protocol.http.Handler handler = new sun.net.www.protocol.http.Handler();
    URL url = new URL(null, "http://" + host + ":" + port + "/", handler);

2. Goto the folder java/highcharts-export
3. Update your local maven repository, Run: `mvn install`
4. Goto the folder java/highcharts-export/highcharts-export-web
5. Create the .war file, Run: `mvn clean package`

### 3. EXPORT SERVER BASED ON PHP AND BATIK

Note that this export server omits server-side rendering. It can be used (only) to convert SVG files to images and PDF.

The `index.php` file that handles the POST can be downloaded from our [GitHub repository](https://github.com/highcharts/highcharts-export-server/tree/master/php/php-batik).

1.  Make sure that PHP and Java is installed on your server.
2.  Upload the `index.php` file from the [exporting-server](https://github.com/highcharts/highcharts-export-server/tree/master/php/php-batik) repository to your server.
3.  In your FTP program, create directory called `temp` in the same directory as `index.php` and chmod this new directory to 777 (Linux/Unix servers only).
4.  Download Batik from the [Batik Distribution Mirror](https://www.apache.org/dyn/closer.cgi/xmlgraphics/batik). Find the binary distribution for your java version.

5.  Upload `batik-rasterizer.jar` and the entire `lib` directory to a location on your web server.
6.  In the options in the top of the index.php file, set the path to batik-rasterier.jar.
7.  In your chart options, set the [exporting.url](https://api.highcharts.com/highcharts/exporting.url) option to match your PHP file location.

#### TROUBLESHOOTING

If for any reason the export-server fails to export images, then consider pasting this code snippet to output error messages. Paste this before Line 78, beginning with the commenting text: `// Do the conversion.`


    // Troubleshoot snippet
    $command = "java -jar ". BATIK_PATH ." $typeString -d $outfile $width temp/$tempName.svg 2>&1";
    $output = shell_exec($command);
    echo "Command: $command <br>";
    echo "Output: $output";
    die;

### 4. Other solutions

As an ASP.NET alternative to our Java/PHP based server module, Clément Agarini has kindly shared his [export module for ASP.NET](https://github.com/imclem/Highcharts-export-module-asp.net).