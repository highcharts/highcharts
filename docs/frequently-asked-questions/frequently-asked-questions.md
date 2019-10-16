FAQ
===
*   [Does Highcharts refer to files outside our domain?](#files-outside-domain)
*   [My charts are not showing in Internet Explorer 7 or 8](#not-showing-in-explorer)
*   [Can I use Highcharts with a ... server?](#can-i-use-highcharts-with)
*   [Can I use features from Highstock in Highcharts?](#highstock-features-in-highcharts)
*   [Can I add a data table to the exported chart?](#add-data-table)
*   [How can I get the best performance out of Highcharts?](#optimize-performance)
*   [Can I export multiple charts to the same image or PDF?](#export-multiple)
*   [My non-English characters don't display right in my charts](#non-ascii)
*   [Can I generate charts on the server without using a browser?](#server-side-charts)
*   [How do I define irregular time data?](#irregular-time)
*   [How do I add data from a MySQL database?](#data-from-sql)
*   [Your map of my country does not include a disputed area](#disputed-maps)

* * *

Does Highcharts refer to files outside our domain?
--------------------------------------------------

For basic usage, Highcharts doesn't refer to any files other than highcharts.js/highstock.js, though there are some cases that you should be aware of.

*   The exporting module. Since not all browsers are able to convert the chart to an image format, this operation is by default done on our web service, https://export.highcharts.com. The generated SVG is sent from your browser to the export server, and an image is sent back. If you're concerned about your data content being passed over the internet, you should consider our alternative solutions. The simplest alternative is to use our [module for client-side export](https://highcharts.com/docs/export-module/client-side-export). Check out the features and compatibility table if it meets your requirements. If you have access to a node server, you can also [set up your own export server](https://highcharts.com/docs/export-module/setting-up-the-server). 
*   Certain features, including client side exporting, may require third-party dependencies. Some of these are loaded on demand from our servers, but in these cases the loading location is configurable. Details on all external dependencies, including licensing and security details, can be found in the [optional dependencies](https://highcharts.com/docs/getting-started/optional-dependencies) documentation article.

* * *

My charts are not showing in Internet Explorer 7 or 8
-----------------------------------------------------

The most common reason why a chart works in modern browsers but fails in IE6, 7 and 8, is stray commas in the configuration options. Stray commas are commas after the last item of an object or an array in JavaScript. These will pass silently in modern browsers, but cause a JavaScript error in legacy IE.

    
    var chart = new Highcharts.Chart({
        chart: {
            renderTo: 'container'
        },
        xAxis: {
            type: 'datetime'
        },
        series: [{
            data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5,  
                   216.4, 194.1, 95.6, 54.4],
            pointStart: Date.UTC(2012, 0, 1),
            pointInterval: 24 * 3600 * 1000,
        }]
    });

[Try it live](https://jsfiddle.net/highcharts/DXnPa/).

Another case where legacy IE fails to show charts, is when the security setting "ActiveX controls and plug-ins" => "Binary and script behavious" is disabled. This happens very rarely on user computers, but we have seen it from time to time on company networks. In this case, IE fails to draw any of the vector graphics, only the the text is shown. 

* * *

Can I use Highcharts with a ... server?
---------------------------------------

Highcharts runs entirely on the client, and works with any web server that can deliver HTML and JavaScript content. Whether your server is PHP, Perl, ASP, ASP.NET, Node.js or whatever, Highcharts is completely ignorant of it. The HTML/JavaScript files may also be loaded from the file system, which is the case in app platforms where Highcharts is loaded in a web component inside the app.

The best practice in integrating Highcharts may differ from system to system. You should follow the common practice for handing JavaScript on your specific system. Some prefer to serve a clean JSON or JavaScript file with the Highcharts setup, others to write the JavaScript setup directly to the web page. Data can be loaded in form of JSON or CSV files (see Working with data in the left menu), or printed inline in the chart setup. When working with a databased powered backend, it may be cleaner to have your server system serve JSON or CSV files.

For a live connection to the server, you may set up the web page to load new data over XHR or set up direct communicatations using WebSockets. With the new data arriving in the browser, the chart can be kept updated through various dynamic endpoints like `Series.addPoint()`, `Point.update()`, `Chart.addSeries()`, `Chart.update()` etc.

Before you start to set up a complex backend, you may want to check out [www.highcharts.com/download](download) whether someone has created a wrapper for your specific system.

* * *

Can I use features from Highstock in Highcharts?
------------------------------------------------

Yes, most Highstock features can be applied to standard charts. From a licensing point of view, using features of the Stock package obviously requires a Highstock license.

Technically Highcharts Stock is implemented as a set of plugins for Highcharts. The entire code base for Highcharts is included in the Stock package, and you can invoke a chart using `Highcharts.Chart` and enable certain features that are normally associated with a stock chart.

Examples:

*   [Using flags in Highcharts](https://jsfiddle.net/highcharts/2BGSK/)
    
*   [Enabling a scrollbar in Highcharts](https://jsfiddle.net/highcharts/fj6d2/)
    
*   [Gap size in Highcharts](https://jsfiddle.net/highcharts/VwkHu/)
    

* * *

Can I add a data table to the exported chart?
---------------------------------------------

If you don't care about the export, a data table is simply added by the `export-data` module and a simple option, [exporting.showTable](https://api.highcharts.com/highcharts/exporting.showTable). However this table doesn't support exporting to SVG or other image formats, but with a little programming on top of the Highcharts data and drawing API you can draw a table. See [our jsFiddle demo](https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/highcharts/studies/exporting-table/) for source code and live example.

* * *

How can I get the best performance out of Highcharts?
-----------------------------------------------------

When working with series with a high number of data points, there are a few things to consider.

1.  First of all, consider using [the Boost module](news/175-highcharts-performance-boost).
2.  Otherwise, for line plots, it is recommended that you disable point markers, as these will add a performace overhead. See [https://highcharts.com/demo/line-time-series](https://highcharts.com/demo/line-time-series).
3.  Disabling shadows increases performance, as three shadow elements are created for each shape that includes a shadow.
4.  For large column series, it is recommended that you disable the initial animation, [plotOptions.column.animation](https://api.highcharts.com/highcharts#plotOptions.column.animation), at least for VML based browsers. The best way to distinguish between fast SVG browsers and slower VML browsers is to use the Highcharts.svg boolean property.

* * *

Can I export multiple charts to the same image or PDF?
------------------------------------------------------

Currently this isn't implemented in the core, but there are a couple of paths you can go to achieve this. 

1.  Use our hack for [exporting multiple charts](https://jsfiddle.net/gh/get/jquery/1.7.2/highcharts/highcharts/tree/master/samples/highcharts/exporting/multiple-charts/). Basically, this code gets the SVG of all charts, modifies it and applies it to one single SVG file that is sent to the server for image conversion. We also support using our client side exporting module, if sending data to our server is a concern. See [this demo](https://jsfiddle.net/gh/get/jquery/1.7.2/highcharts/highcharts/tree/master/samples/highcharts/exporting/multiple-charts-offline/) for an example of this approach.
2.  Create a HTML file on your server that contains all your desired charts, and do a pure server side conversion of this. See [Can I generate charts on the server without using a browser?](#server-side-charts)

* * *

My non-English characters don't display right in my charts
----------------------------------------------------------

If you're using German umlauts, Scandinavian vowels or non-European alphabets, you need to use UTF-8 encoding for your files. There are two ways of doing this.

1. Make sure your HTML page where your charts are defined, is UTF-8. The file itself and if applicable its database content must be encoded as UTF-8. Additionally, either the `content-type` HTTP header or the corresponding meta tag must reflect this:

    
    <meta http-equiv="content-type" content="text/html; charset=utf-8" />

2. If you don't have access to change your whole HTML file, you can define your charts in a separate JS file that has UTF-8 encoding. 

    
    <script src="charts.js" charset="UTF-8"></script>

* * *

Can I generate charts on the server without using a browser?
------------------------------------------------------------

Yes. See our article, [Render charts on the server](https://highcharts.com/docs/export-module/render-charts-serverside).

* * *

How do I define irregular time data?
------------------------------------

To add data points with irregular intervals, instead of defining pointStart and pointInterval for the series, define an X value (date) for each point. See [https://jsfiddle.net/highcharts/Jx5n2/](https://jsfiddle.net/highcharts/Jx5n2/).

If you want the line to be broken for missing dates, insert null values instead.

* * *

How do I add data from a MySQL database?
----------------------------------------

See [Preprocessing data from a database](https://highcharts.com/docs/working-with-data/data-from-a-database).

* * *

Your map of my country does not include a disputed area
-------------------------------------------------------

We do our best not to take sides in border conflicts, however we realize the need for maps including disputed areas. To solve this, we try to keep our default maps conforming to neutral de facto borders or conventions, while providing alternative maps that include disputed areas. For a complete list of all of our maps, visit our [Map Collection](https://code.highcharts.com/mapdata).