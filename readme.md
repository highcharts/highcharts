Highcharts JS is a JavaScript charting library based on SVG, with fallbacks to VML and canvas for old browsers.

_For NPM users, please note that this module replaces the previous [Highcharts Server](https://www.npmjs.com/package/highcharts-server) module._

* Official website:  [www.highcharts.com](http://www.highcharts.com)
* Download page: [www.highcharts.com/download](http://www.highcharts.com/download)
* Licensing: [www.highcharts.com/license](http://www.highcharts.com/license)
* Support: [www.highcharts.com/support](http://www.highcharts.com/support)
* Issues [Repo guidelines](repo-guidelines.md)

## Example Usage in Node/Browserify/Webpack
Please note that this is only one way to use Highcharts. For general installation instructions, see [the docs](http://www.highcharts.com/docs/getting-started/installation).
```js
// Load the framework first. Alternatively, load jQuery and pass it to Highcharts.
var hcFramework = require('highcharts/lib/adapters/standalone-framework');
var Highcharts = require('highcharts')(hcFramework);

// Alternatively, this is how to load Highstock. Highmaps is similar.
// var Highcharts = require('highcharts/lib/highstock');

// This is how a module is loaded
require('highcharts/lib/modules/exporting')(Highcharts);

// Generate the chart
var chart = new Highcharts.Chart({
  chart: {
    renderTo: 'container'
  },
  // ... more options - see http://api.highcharts.com/highcharts
});
```

