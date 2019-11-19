Export module
=============

The exporting module allows your users to download the chart as PDF, PNG, JPG or SVG vector images. It also allows printing the chart directly without distracting elements from the web page. The downloads can be created on the client side if you use the [offline-exporting.js](https://highcharts.com/docs/export-module/client-side-export) module, otherwise they are generated on Highcharts' featured server or optionally [your own server](https://highcharts.com/docs/export-module/setting-up-the-server).

Additionally there's the [export data module](https://api.highcharts.com/highcharts/exporting.csv) that enables exporting the chart data to CSV, XLS or HTML table formats.

To enable exporting, the module needs to be included, it can be downloaded from [https://code.highcharts.com/](https://code.highcharts.com/) and included after highcharts.js or highstock.js. The module can also be included directly from [https://code.highcharts.com/](https://code.highcharts.com/) like this:

    
    <script src="https://code.highcharts.com/modules/exporting.js"></script>  
    <!-- optional -->  
    <script src="https://code.highcharts.com/modules/offline-exporting.js"></script>  
    <script src="https://code.highcharts.com/modules/export-data.js"></script>

### The button

When enabled, a context button with a menu appears in the top right corner of the chart.

The position of the button as well as various styling can be edited using [navigation.buttonOptions](https://api.highcharts.com/highcharts/navigation.buttonOptions) and [exporting.buttons.contextButton](https://api.highcharts.com/highcharts/exporting.buttons.contextButton).

To unleash the full power of HTML5, it is also possible to fully [disregard](https://api.highcharts.com/highcharts/exporting.buttons.contextButton.enabled) our built-in button and menu, and build your own buttons or links that call [Chart.print()](https://api.highcharts.com/highcharts/Chart.print()) or [Chart.exportChart()](https://api.highcharts.com/highcharts/Chart.exportChart()) with parameters.

### Controling the size of the exported image

Since Highcharts 3.0 and Highstock 1.3, the size of the exported image is computed based on a few rules:

*   If the [exporting.sourceWidth](https://api.highcharts.com/highcharts/exporting.sourceWidth) and [exporting.sourceHeight](https://api.highcharts.com/highcharts/exporting.sourceHeight) options are set, they take predence. This provides a convenient way of having separate sizes of the on-screen chart and the exported one.
*   If not, and the [chart.width](https://api.highcharts.com/highcharts/chart.width) and [chart.height](https://api.highcharts.com/highcharts/chart.height) options are set, those are used for the exported chart.
*   If a size hasn't been found yet, and the [containing div](https://api.highcharts.com/highcharts/chart.renderTo) has an explicit pixel width or height, that width or height is used. Percentage and other non-pixel widths will not take effect. This prevents a common pitfall in Highcharts 2, where charts with the typical 100% width would look out of proportion in export. 
*   If a size still hasn't been found, it defaults to 600 by 400 pixels.
*   After rendering the chart width the above size, and all text sizes in relation to that, the actual image _resolution_ is determined by [exporting.scale](https://api.highcharts.com/highcharts/exporting.scale) which defaults to 2. In practice this means that a 600x400 chart will return an image of 1200x800 pixels by default. The rationale behind this is quite simple - if we used a scale of 1 and just set the sourceWidth to 1200 and sourceHeight to 800, all the text would become too small. And if we didn't scale it up, the resolution would be too small for print. 

See also [Setting up the export server](https://highcharts.com/docs/export-module/setting-up-the-server).

### Description of POST parameters for the Highcharts Export Server

Normally Highcharts sends data to the export server for saving a graph as an image or PDF. Use the following POST parameters, if you want to request the export server yourself.



|||
|--- |--- |
|svg|The string representation of a SVG file you want to export. Can be ignored when you provide the options parameter.|
|options|Use this parameter if you want to create a graph out of a Highcharts configuration. The options are sent as a JSON string. This parameter overrides the svg option. Example of content:`{xAxis: {categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']},series: [{data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]}]};`|
|type|The content-type of the file to output. Can be one of `image/png`, `image/jpeg`, `application/pdf`, or `image/svg+xml`.|
|filename|The name of the exported file. Defaults to 'Chart'.|
|scale|To scale the original SVG. For example, if the chart.width option in the chart configuration is set to 600 and the scale is set to 2, the output raster image will have a pixel width of 1200. So this is a convenient way of increasing the resolution without decreasing the font size and line widths in the chart. This is ignored if the -width parameter is set. For now we allow a maximum scaling of 4. This is for ensuring a good repsonse time. Scaling is a bit resource intensive.|
|width|Set the exact pixel width of the exported image or pdf. This overrides the -scale parameter. The maximum allowed width is 2000px|
|constr|The constructor name. Can be one of 'Chart' or 'StockChart'. This depends on whether you want to generate Highstock or basic Highcharts. Only applicable when using this in combination with the options parameter.|
|callback|String containing a callback JavaScript. The callback is a function which will be called in the constructor of Highcharts to be executed on chart load. All code of the callback must be enclosed by a function. Only applicable when using this in combination with theoptions parameter. Example of contents of the callback file:`function(chart) { chart.renderer.arc(200, 150, 100, 50, -Math.PI, 0).attr({ fill : '#FCFFC5', stroke : 'black', 'stroke-width' : 1 }).add(); }`|
|resources|Stringified JSON which can contain three properties js and css. Example: `{"css": "g.highcharts-series path {stroke-width:2;stroke: pink}", "js": "document.body.style.webkitTransform = \"rotate(-10deg)\";" }`css: css inserted in the body of the page, js: javascript inserted in the body of the page|
|async|Can be of true or false. Default is false. When setting async to true a download link is returned to the client, instead of an image. This download link can be reused for 30 seconds. After that, the file will be deleted from the server.|

See here for an example on how to perform an Ajax Post and return an image. https://jsfiddle.net/6h8o16g0/


