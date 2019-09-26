Compatibility
===

Revised February 16, 2012

JavaScript Frameworks
---------------------

Highcharts can either run on top of jQuery, or on top of its own Standalone Framework. The Standalone Framework weighs about 2k gzipped. In terms of performance there is no noticeable difference, so if you don't use jQuery for other tasks in your project, we recommend using the Standalone Framework. 

We support jQuery version 1.6+ for legacy browsers, and 2.0+ for modern browsers.

Browser versions
----------------

We test our software on many browsers using the latest versions. Knowing that Internet Explorer users have a tendency not to upgrade we also systematically test older versions of that browser. Highcharts runs on the following browser versions:

|Brand|Versions supported|
|--- |--- |
|Firefox|2.0 +|
|Chrome|1.0 +|
|Safari|4.0 +|
|Edge|11.0+|
|Internet Explorer|6.0-8.0 partial. IE9+ full support.|
|Opera|9.0 +|
|iOS (Safari)|3.0 +|
|Android Browser|2.0 + *)|


*) Android 2.x has limited support, see [below](#android2).

As with the javascript frameworks, other versions may still work even though they are not tested.

Rendering engines and Performance
---------------------------------

Different browsers support different rendering technologies, modern browsers have support for [SVG](https://www.w3.org/TR/SVG/Overview.html) but older versions of Internet Explorer do not, here we use [VML](https://www.w3.org/TR/NOTE-VML) to draw the graphs. This table describes the technologies we use in various browsers:

|Browser version|Rendering technology|Rendering performance|
|--- |--- |--- |
|Internet Explorer 9|SVG|Excellent|
|Internet Explorer 8|VML|Ok|
|Internet Explorer 7|VML|Slow|
|Internet Explorer 6|VML|Slow|
|Firefox|SVG|Excellent|
|Chrome|SVG|Excellent|
|Safari|SVG|Excellent|
|Opera|SVG|Excellent|
|iOS Safari|SVG|Ok|
|Android 3+|SVG|Ok|
|Android 2.x|Canvas|Slow|

Android 2.x
-----------

Android 2.x doesn't have SVG support built in, so we have created a separate renderer based on the canvg library for this system. This solution has some limitations:

*   Using Highstock on Android 2.x is not recommended as it relies heavily on zooming and mouse interaction
*   Shared tooltip is always enabled.
*   During first render, the canvg renderer + rgbcolor.js + canvg.js (concatenated to one file) will be downloaded from code.highcharts.com This is configurable with the `global.canvasToolsURL` option.
*   Chart and series animation is turned off.
*   Show/hide series from the legend is not enabled.
*   Series and point touch events are not enabled.
*   Zooming is not enabled.
*   Using the Renderer API directly to add shapes to the charts is not supported.
