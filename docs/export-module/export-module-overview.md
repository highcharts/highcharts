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

### Controlling the size of the exported image

Since Highcharts 3.0 and Highcharts Stock 1.3, the size of the exported image is computed based on a few rules:

*   If the [exporting.sourceWidth](https://api.highcharts.com/highcharts/exporting.sourceWidth) and [exporting.sourceHeight](https://api.highcharts.com/highcharts/exporting.sourceHeight) options are set, they take precedence. This provides a convenient way of having separate sizes of the on-screen chart and the exported one.
*   If not, and the [chart.width](https://api.highcharts.com/highcharts/chart.width) and [chart.height](https://api.highcharts.com/highcharts/chart.height) options are set, those are used for the exported chart.
*   If a size hasn't been found yet, and the [containing div](https://api.highcharts.com/highcharts/chart.renderTo) has an explicit pixel width or height, that width or height is used. Percentage and other non-pixel widths will not take effect. This prevents a common pitfall in Highcharts 2, where charts with the typical 100% width would look out of proportion in export. 
*   If a size still hasn't been found, it defaults to 600 by 400 pixels.
*   After rendering the chart with the above size, and all text sizes in relation to that, the actual image _resolution_ is determined by [exporting.scale](https://api.highcharts.com/highcharts/exporting.scale) which defaults to 2. In practice this means that a 600x400 chart will return an image of 1200x800 pixels by default. The rationale behind this is quite simple - if we used a scale of 1 and just set the sourceWidth to 1200 and sourceHeight to 800, all the text would become too small. And if we didn't scale it up, the resolution would be too small for print. 

### The Highcharts Export Server

For an overview of the features of the public export server, see the [documentation on GitHub](https://github.com/highcharts/node-export-server#http-server).

See also [Setting up the export server](https://highcharts.com/docs/export-module/setting-up-the-server) for instructions on how to run your own export server.