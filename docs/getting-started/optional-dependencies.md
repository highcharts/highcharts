Optional dependencies
---------------------

Highcharts by default is self-contained, but in some situations Highcharts requires external libraries to enable certain features. The following is an overview of these libraries, along with the required license and security information. The loading of the libraries is always configurable in such a way that you can load the files from your own servers if this is a security requirement. Note that even when loading these files, your chart data is never sent to our servers.

|File with source link|License|Loading|Usage
|---|---|---|---|
|[svg2pdf.js](https://code.highcharts.com/lib/svg2pdf.js)|MIT. [Open source](https://github.com/yWorks/svg2pdf.js).|Loaded on demand from [exporting.libURL](https://api.highcharts.com/highcharts/exporting.libURL) if not present on page.|Required by the [client side exporting module](https://highcharts.com/docs/export-module/client-side-export) for PDF export.|
|[jspdf.js](https://code.highcharts.com/lib/jspdf.js)|MIT. [Open source](https://github.com/yWorks/jsPDF).|Loaded on demand from [exporting.libURL](https://api.highcharts.com/highcharts/exporting.libURL) if not present on page.|Dependency of svg2pdf, required by the [client side exporting module](https://highcharts.com/docs/export-module/client-side-export) for PDF export.|
|[canvg.js](https://code.highcharts.com/lib/canvg.js)|MIT. [Open source](https://github.com/canvg/canvg).|Loaded on demand from [exporting.libURL](https://api.highcharts.com/highcharts/exporting.libURL) if not present on page.|Required by the [client side exporting module](https://highcharts.com/docs/export-module/client-side-export) to export certain image types in Internet Explorer and pre-Chromium Edge browsers.|
|[proj4.js](http://proj4js.org/)|MIT. [Open source](https://github.com/proj4js/proj4js).|Not loaded automatically, must be included on page.|Prior to v10, required for [latitude/longitude](https://highcharts.com/docs/maps/latlon) support in Highcharts Maps. Since v10 it is no longer needed as projection is built in.|
