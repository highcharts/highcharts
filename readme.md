Highcharts JS is a JavaScript charting library based on SVG, with fallbacks to VML and canvas for old browsers.

* Official website:  [www.highcharts.com](http://www.highcharts.com)
* Download page:  [www.highcharts.com/download](http://www.highcharts.com/download)
* Licensing: [www.highcharts.com/license](http://www.highcharts.com/license)
* Support: [www.highcharts.com/support](http://www.highcharts.com/support)
* Issues [Repo guidelines](repo-guidelines.md)

## Download and install
This is the *working repo* for Highcharts. If you simply want to include Highcharts into a project, use the [distribution package](https://www.npmjs.com/package/highcharts) instead, or read the [download page](http://www.highcharts.com/download). Please note that there are several ways to use Highcharts. For general installation instructions, see [the docs](http://www.highcharts.com/docs/getting-started/installation).

## Build and debug
If you want to do modifications to Highcharts or fix issues, you may build your own files. Highcharts uses Gulp as the build system. After `npm install` in the root folder, run `gulp`, which will set up a watch task for the JavaScript and SCSS files. Now any changes in the files of the `/js` or `/css` folders will result in new files being built and saved in the `code` folder. Other tasks are also available, like `gulp lint`.

```
npm install
gulp
```

## Usage in Node/Browserify/Webpack
This uses the [distribution package](https://www.npmjs.com/package/highcharts) which points to a separate repo.

```
npm install highcharts
```

```js
// Load Highcharts
const highcharts = require('highcharts/highcharts.src');

const Highcharts = typeof highcharts === 'function' ? highcharts(jsdomRoot()) : highcharts;

// Alternatively, this is how to load Highstock. Highmaps is similar.
// const Highcharts = require('highcharts/highstock.src');

// This is how a module is loaded. Pass in Highcharts as a parameter.
require('highcharts/modules/exporting')(Highcharts);

// Generate the chart
Highcharts.chart('container', {
  // options - see http://api.highcharts.com/highcharts
});
```

Example of using Highcharts in `ES2015`:

```js
// load Highcharts

import highcharts from 'highcharts/highcharts.src';
// load the exporting module
import Exporting from 'highcharts/modules/exporting';

const Highcharts = typeof highcharts === 'function' ? highcharts(jsdomRoot()) : highcharts;

// initialize exporting module
Exporting(Highcharts);

// Generate the chart
const chart = new Highcharts.Chart({
  chart: {
    renderTo: 'container'
  },
  // ... more options - see http://api.highcharts.com/highcharts
});
```
