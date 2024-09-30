Frequently asked questions
===

*   [Does Highcharts refer to files outside our domain?](#does-highcharts-refer-to-files-outside-our-domain)
*   [Can I use Highcharts with a ... server?](#can-i-use-highcharts-with-a-server)
*   [Can I use features from Highcharts Stock in Highcharts?](#can-i-use-features-from-highcharts-stock-in-highcharts)
*   [Can I add a data table to the exported chart?](#can-i-add-a-data-table-to-the-exported-chart)
*   [How can I get the best performance out of Highcharts?](#how-can-i-get-the-best-performance-out-of-highcharts)
*   [Can I export multiple charts to the same image or PDF?](#can-i-export-multiple-charts-to-the-same-image-or-pdf)
*   [My non-English characters don't display right in my charts](#my-non-english-characters-don39t-display-right-in-my-charts)
*   [Can I generate charts on the server without using a browser?](#can-i-generate-charts-on-the-server-without-using-a-browser)
*   [How do I define irregular time data?](#how-do-i-define-irregular-time-data)
*   [How do I add data from a MySQL database?](#how-do-i-add-data-from-a-mysql-database)
*   [Your map of my country does not include a disputed area](#your-map-of-my-country-does-not-include-a-disputed-area)

* * *

Does Highcharts refer to files outside our domain?
--------------------------------------------------

For basic usage, Highcharts doesn't refer to any files other than highcharts.js/highstock.js, though there are some cases that you should be aware of.

*   The exporting module. Since not all browsers are able to convert the chart to an image format, this operation is by default done on our web service, https://export.highcharts.com. The generated SVG is sent from your browser to the export server, and an image is sent back. If you're concerned about your data content being passed over the internet, you should consider our alternative solutions. The simplest alternative is to use our [module for client-side export](https://highcharts.com/docs/export-module/client-side-export). Check out the features and compatibility table if it meets your requirements. If you have access to a node server, you can also [set up your own export server](https://highcharts.com/docs/export-module/setting-up-the-server). 
*   Certain features, including client side exporting, may require third-party dependencies. Some of these are loaded on demand from our servers, but in these cases the loading location is configurable. Details on all external dependencies, including licensing and security details, can be found in the [optional dependencies](https://highcharts.com/docs/getting-started/optional-dependencies) documentation article.
* Stock Tools icons. By default the icons are loaded dynamically from https://code.highcharts.com. To change where icons should be loaded from see the [iconsURL](https://api.highcharts.com/highstock/navigation.iconsURL) option.

* * *

Can I use Highcharts with a ... server?
---------------------------------------

Highcharts runs entirely on the client, and works with any web server that can deliver HTML and JavaScript content. Whether your server is PHP, Perl, ASP, ASP.NET, Node.js or whatever, Highcharts is completely ignorant of it. The HTML/JavaScript files may also be loaded from the file system, which is the case in app platforms where Highcharts is loaded in a web component inside the app.

The best practice in integrating Highcharts may differ from system to system. You should follow the common practice for handing JavaScript on your specific system. Some prefer to serve a clean JSON or JavaScript file with the Highcharts setup, others to write the JavaScript setup directly to the web page. Data can be loaded in form of JSON or CSV files (see Working with data in the left menu), or printed inline in the chart setup. When working with a database powered backend, it may be cleaner to have your server system serve JSON or CSV files.

For a live connection to the server, you may set up the web page to load new data over XHR or set up direct communications using WebSockets. With the new data arriving in the browser, the chart can be kept updated through various dynamic endpoints like `Series.addPoint()`, `Point.update()`, `Chart.addSeries()`, `Chart.update()` etc.

Before you start to set up a complex backend, you may want to check out [highcharts.com/download](https://highcharts.com/download) to see if there is a wrapper for your specific system.

* * *

Can I use features from Highcharts Stock in Highcharts?
------------------------------------------------

Yes, most Highcharts Stock features can be applied to standard charts. From a licensing point of view, using features of the Stock package obviously requires a Highcharts Stock license.

Technically Highcharts Stock is implemented as a set of plugins for Highcharts. The entire code base for Highcharts is included in the Stock package, and you can invoke a chart using `Highcharts.Chart` and enable certain features that are normally associated with a stock chart.

Examples:

*   [Using flags in Highcharts](https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/stock/series-flags/in-highcharts/)

*   [Enabling a scrollbar in Highcharts](https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/stock/scrollbar/in-highcharts/)

*   [Gap size in Highcharts](https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/stock/plotoptions/gapsize-in-highcharts/)

* * *

Can I add a data table to the exported chart?
---------------------------------------------

If you don't care about the export, a data table is simply added by the `export-data` module and a simple option, [exporting.showTable](https://api.highcharts.com/highcharts/exporting.showTable). However this table doesn't support exporting to SVG or other image formats, but with a little programming on top of the Highcharts data and drawing API you can draw a table. See [our jsFiddle demo](https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/highcharts/studies/exporting-table/) for source code and live example.

* * *

How can I get the best performance out of Highcharts?
-----------------------------------------------------

When working with series with a high number of data points, there are a few things to consider.

1.  First of all, consider using the [Boost module](https://www.highcharts.com/blog/tutorials/highcharts-high-performance-boost-module/).
2.  Otherwise, for line plots, it is recommended that you disable point markers, as these will add a performance overhead. See [https://highcharts.com/demo/line-time-series](https://highcharts.com/demo/line-time-series).
3.  Disabling shadows increases performance, as three shadow elements are created for each shape that includes a shadow.
4.  If you have a Stock licence, consider using the [Data Grouping module](https://www.highcharts.com/docs/stock/data-grouping). This module packs multiple consecutive values into the same point, and results in considerably fewer points to render. This greatly
reduces the initial loading time. The following chart compares the loading times of the same data set with and without data grouping.

<iframe style="width: 100%; height: 470px" src="https://www.highcharts.com/samples/embed/highcharts/blog/dg-performance-comparison/" frameborder="0"></iframe>

* * *

Can I export multiple charts to the same image or PDF?
------------------------------------------------------

Currently this isn't implemented in the core, but there are a couple of paths you can go to achieve this. 

1.  Use our hack for [exporting multiple charts](https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/highcharts/exporting/multiple-charts/). Basically, this code gets the SVG of all charts, modifies it and applies it to one single SVG file that is sent to the server for image conversion. We also support using our client side exporting module, if sending data to our server is a concern. See [this demo](https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/highcharts/exporting/multiple-charts-offline/) for an example of this approach.
2.  Create a HTML file on your server that contains all your desired charts, and do a pure server side conversion of this. See [Can I generate charts on the server without using a browser?](#server-side-charts)

* * *

My non-English characters don't display right in my charts
----------------------------------------------------------

If you're using German umlauts, Scandinavian vowels or non-European alphabets, you need to use UTF-8 encoding for your files. There are two ways of doing this.

1. Make sure your HTML page where your charts are defined, is UTF-8. The file itself and if applicable its database content must be encoded as UTF-8. Additionally, either the `content-type` HTTP header or the corresponding meta tag must reflect this:
    ```html
    <meta http-equiv="content-type" content="text/html; charset=utf-8" />
    ```

2. If you don't have access to change your whole HTML file, you can define your charts in a separate JS file that has UTF-8 encoding. 
    ```html
    <script src="charts.js" charset="UTF-8"></script>
    ```

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
