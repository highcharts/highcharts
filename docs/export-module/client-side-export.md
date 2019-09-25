Client side export
===

The offline-exporting module allows for image export of charts without sending data to an external server. This is the solution if you:

*   Want to avoid having users send your chart configs to Highsoft's servers
*   Want to save the cost of setting up your own server
*   Don't require the export to work with old browsers like IE8

[View it live on jsFiddle](https://jsfiddle.net/gh/get/jquery/1.11.0/highslide-software/highcharts.com/tree/master/samples/highcharts/exporting/offline-download-demo/).

The module makes use of modern browser technology to accomplish this, and therefore does not work flawlessly with older browsers. For a detailed table of supported browsers, see below. In the case of an unsupported browser, the module will by default fall back to the export server, but this can be disabled with the [exporting.fallbackToExportServer](https://api.highcharts.com/highcharts/exporting.fallbackToExportServer) option.

Internet Explorer requires the [canvg](https://code.google.com/p/canvg/) library in order to export to PNG and to export charts with embedded images. PDF export also requires the [jsPDF](https://github.com/yWorks/jsPDF) and [svg2pdf](https://github.com/yWorks/svg2pdf.js) for all browsers. By default, the module will load these file from our server on demand, but the URL can be changed using the [exporting.libURL](https://api.highcharts.com/highcharts/exporting.libURL) option. If the scripts have already been loaded by the page, Highcharts will not load them again. Note that even when loading these files, no chart data is sent to our server.

PDF does not support exporting with images and will fall back to the export server.

To use the module, simply include it after the exporting module. The exporting module is a required dependency even if fallback is disabled.

    
    <script src="https://code.highcharts.com/highcharts.js"></script>
    <script src="https://code.highcharts.com/modules/exporting.js"></script>
    <script src="https://code.highcharts.com/modules/offline-exporting.js"></script>

### Browser support table


||Chrome (latest)|Firefox (latest)|Microsoft Edge|Internet Explorer 11|Internet Explorer 10|Safari (latest)|Safari 5.1|Android (latest)|Android (4.0)|Chrome for Android|iOS|Chrome for iOS|
|--- |--- |--- |--- |--- |--- |--- |--- |--- |--- |--- |--- |--- |
|SVG|OK|OK|OK|OK|OK|Opens data URI in new tab|Opens data URI|OK|Opens data URI|OK|Opens data URI in new tab|Opens blob URI in new tab|
|PNG/JPEG|OK|OK|OK|OK|OK|Opens data URI in same tab|Opens data URI|OK|Opens data URI|OK|Opens data URI in same tab|Opens blob URI in new tab|
|PDF|OK|OK|Fallback to export server|Fallback to export server|Fallback to export server|Opens data URI in same tab|Fallback to export server|OK|Fallback to export server|OK|Fallback to export server|Fallback to export server|
|SVG w/images (same server)|OK|OK|OK|OK|OK|Opens data URI in same tab|Opens data URI|OK|Opens data URI|OK|Opens data URI in same tab|Opens blob URI in new tab|
|PNG/JPEG w/images (same server)|OK|OK|Fallback to export server|Fallback to export server|Fallback to export server|Opens data URI in same tab|Suboptimal image|OK|Opens data URI|OK|Opens data URI in same tab|Opens blob URI in new tab|
|SVG w/images (CORS enabled server)|OK|OK|OK|Fallback to export server|Fallback to export server|Opens data URI in same tab|Fallback to export server|OK|Fallback to export server|OK|Fallback to export server|Fallback to export server|
|PNG/JPEG w/images (CORS enabled server)|OK|OK|Fallback to export server|Fallback to export server|Fallback to export server|Opens data URI in same tab|Fallback to export server|OK|Fallback to export server|OK|Fallback to export server|Fallback to export server|

Internet Explorer 9 and older will attempt to fall back to export server in all cases.

Decision flowchart of the module (click for large version):

[![Offline export decision flowchart](https://assets.highcharts.com/images/client-side-export-flow.svg)](https://assets.highcharts.com/images/client-side-export-flow.svg)
