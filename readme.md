Highcharts JS is a JavaScript charting library based on SVG, with fallbacks to VML and canvas for old browsers.

_For NPM users, please note that this module replaces the previous [Highcharts Server](https://www.npmjs.com/package/highcharts-server) module._

* Official website:  [www.highcharts.com](http://www.highcharts.com)
* Download page: [www.highcharts.com/download](http://www.highcharts.com/download)
* Licensing: [www.highcharts.com/license](http://www.highcharts.com/license)
* Support: [www.highcharts.com/support](http://www.highcharts.com/support)
* Issues [Repo guidelines](repo-guidelines.md)

## Example Usage in Node/Browserify/Webpack
Please note that there are several ways to use Highcharts. For general installation instructions, see [the docs](http://www.highcharts.com/docs/getting-started/installation).

```
npm install highcharts
```

```js
// Load Highcharts
var Highcharts = require('highcharts');

// Alternatively, this is how to load Highstock. Highmaps is similar.
// var Highcharts = require('highcharts/highstock');

// This is how a module is loaded. Pass in Highcharts as a parameter.
require('highcharts/modules/exporting')(Highcharts);

// Generate the chart
Highcharts.chart('container', {
  // options - see http://api.highcharts.com/highcharts
});
```

