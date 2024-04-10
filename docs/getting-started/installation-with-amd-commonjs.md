Installation with AMD or CommonJS modules
==========================================

## AMD

Highcharts is compatible with AMD module loaders (such as RequireJS). The
following example demonstrates loading Highcharts along with two modules from
our CDN using RequireJS.
```html
<html>
    <head>
        <script src="require.js"></script>
        <script>
            require.config({
                packages: [{
                    name: 'highcharts',
                    main: 'highcharts'
                }],
                paths: {
                    // Change this to your server if you do not wish to use our CDN.
                    'highcharts': 'https://code.highcharts.com'
                }
            });
        </script>
    </head>
    <body>
        <div id="container"></div>
        <script>
            require([
                'highcharts',
                'highcharts/modules/exporting',
                'highcharts/modules/accessibility'
            ], function (Highcharts) {
                // This function runs when the above files have been loaded.

                // Create a test chart.
                Highcharts.chart('container', {
                    series: [{
                        data: [1,2,3,4,5]
                    }]
                });
            });
        </script>
    </body>
</html>
```
See it [live on jsFiddle](https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/highcharts/amd/simple/).

When using AMD modules, Highcharts also allows mixing [multiple versions in the
same page](https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/highcharts/amd/version-mix/).


## CommonJS

Highcharts is using an UMD module pattern, and as a result it has support for CommonJS - as used by Node.js.
*The following examples presumes you are using npm to install Highcharts, see [installation with npm](https://highcharts.com/docs/getting-started/install-from-npm) for more details.*
```js
// Load Highcharts
var Highcharts = require('highcharts');
// Alternatively, this is how to load Highstock. Highmaps and Highcharts Gantt are similar.
// var Highcharts = require('highcharts/highstock');

// Load the exporting module, and initialize it.
require('highcharts/modules/exporting')(Highcharts);

// Generate the chart
Highcharts.chart('container', {
  // options - see https://api.highcharts.com/highcharts
});
```
