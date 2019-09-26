System requirements
===

Highcharts is solely based on native browser technologies and doesn't require client side plugins like Flash or Java. Furthermore you don't need to install anything on your server. No PHP or ASP.NET. Highcharts needs only the highcharts.js core to run.

Highcharts and Highstock work in all modern browsers including mobile devices and Internet Explorer from version 6. Standard browsers use [SVG](https://www.w3.org/Graphics/SVG/) for the graphics rendering. In legacy Internet Explorer (IE8 and before) graphics are drawn using [VML](https://www.w3.org/TR/NOTE-VML).

Highcharts and Highstock run on any server that supports HTML. You can even run Highcharts locally from a filesystem, since all the rendering is done locally in a browser.

Browser compatibility
---------------------

We test our software on many browsers using the latest versions. Knowing that Internet Explorer users have a tendency not to upgrade we also systematically test older versions of that browser. Highcharts runs on the following browser versions:

|Brand|Versions supported|
|--- |--- |
|Firefox|2.0 +|
|Chrome|1.0 +|
|Safari|4.0 +|
|Opera|9.0 +|
|Edge|12.0 +|
|Internet Explorer|6.0-8.0 partial support using polyfills|
|Internet Explorer|9.0 +|
|Android Browser|2.0 + *)|

*) Android browser 2.x has limited support, see [below](#android).

Supporting IE 6-8
-----------------

For supporting IE 6-8, some polyfills are needed. The first file, `oldie-polyfills.js` includes some common array functions. This file extends array and object prototypes, and can be omitted if you have other polyfill libraries, or prefer to use your own. The second file, `oldie.js`, includes the VML renderer since old IE doesn't support SVG rendering. The polyfills must be inluded before the Highcharts main file. With conditional comments, it looks like this:

    
    <!--[if lt IE 9]>
    <script src="https://code.highcharts.com/modules/oldie-polyfills.js"></script>
    <![endif]-->  
    <script src="https://code.highcharts.com/highcharts.js"></script>
    <!--[if lt IE 9]>
    <script src="https://code.highcharts.com/modules/oldie.js"></script>
    <![endif]-->

Rendering engines and performance
---------------------------------

Different browsers support different rendering technologies, modern browsers have support for SVG but older versions of Internet Explorer do not, here we use VML to draw the graphs. This table describes the technologies we use in various browsers:

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

*   Shared tooltip is always enabled.
*   During first render, the canvg renderer + rgbcolor.js + canvg.js (concatenated to one file) will be downloaded from code.highcharts.com This is configurable with the [global.canvasToolsURL](https://api.highcharts.com/highcharts#global.canvasToolsURL) option.
*   Chart and series animation is turned off.
*   Show/hide series from the legend is not enabled.
*   Series and point touch events are not enabled.
*   Zooming is not enabled.
*   Using the Renderer API directly to add shapes to the charts is not supported.
