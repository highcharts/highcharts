Getting started with Highcharts Stock
===

Highcharts Stock allows to create stock or general timeline charts for your web and mobile apps. Features sophisticated navigation for high-volume data, user annotations and over 40 built-in Technical Indicators.

Find demos of Highcharts Stock charts [here](https://highcharts.com/stock/demo) to quickly get an overview of Highcharts Stock’s capabilities.

Get started
-----------

Load Highcharts Stock as a standalone library when there is no need for other Highcharts dependencies.

_Example of loading Highcharts Stock into a webpage_

    
    <script src="https://code.highcharts.com/stock/highstock.js"></script> 

Load Highcharts Stock as a module when a project needs both Highcharts and Highcharts Stock loaded at the same time. Place the script tag or import statement after loading the main library.

_Example of loading both libraries in a webpage_

    
    <script src="https://code.highcharts.com/highcharts.js"></script>
    <script src="https://code.highcharts.com/stock/modules/stock.js"></script> 

For alternative loading and bundling patterns, for UMD, AMD, CommonJS or ES6 modules, find more information [here](https://github.com/highcharts/highcharts/blob/master/readme.md). Highcharts Stock follows the same patterns as described for Highcharts.

Constructor
-----------

Run the `stockChart` constructor for initializing a Stock chart visualization. The constructor takes two required parameters and a third optional parameter.

    
    Highcharts.stockChart('container', {
        // configuration options
    }, myCallback); 

1.  `id:` The `id` of the HTML element used for rendering the chart.
2.  `config`: An object with configuration options for defining the Stock chart.
3.  `callback`: Optional, a callback for getting a handle on the chart, after rendering.

[See also explained here in Stock API](https://api.highcharts.com/class-reference/Highcharts#.stockChart/)

Simple example
--------------

_See below the simple live example of a Stock chart_

<iframe src="https://www.highcharts.com/samples/embed/stock/demo/basic-line" width="100%" height="400" allow="fullscreen"></iframe>
