Highcharts JS is a JavaScript charting library based on SVG, with fallbacks to VML and canvas for old browsers.

* Official website: [www.highcharts.com](http://www.highcharts.com)
* Download page: [www.highcharts.com/download](http://www.highcharts.com/download)
* Licensing: [www.highcharts.com/license](http://www.highcharts.com/license)
* Support: [www.highcharts.com/support](http://www.highcharts.com/support)
* Issues: [Repo guidelines](repo-guidelines.md)

## Download and install Highcharts
This is the *working repo* for Highcharts. If you simply want to include Highcharts into a project, use the [distribution package](https://www.npmjs.com/package/highcharts) instead, or read the [download page](http://www.highcharts.com/download). Please note that there are several ways to use Highcharts. For general installation instructions, see [the docs](http://www.highcharts.com/docs/getting-started/installation).

### Use our CDN
Instead of downloading, you can use our CDN to access files directly. See [code.highcharts.com](https://code.highcharts.com) for details.

```
<script src="https://code.highcharts.com/highcharts.js"></script>
```

### Install from npm
See [npm documentation](https://docs.npmjs.com/) on how to get started with npm.
```
npm install --save highcharts
```

### Install from Bower
[Bower is deprecated](https://bower.io/), but to install, run:
```
bower install highcharts
```

## Load Highcharts from the CDN as ECMAScript modules
Starting with v6.1.0, Highcharts is available on our CDN as ECMAScript modules. You can [import ES modules directly in modern browsers](https://jakearchibald.com/2017/es-modules-in-browsers/)
without any bundling tools, by using `<script type="module">` ([demo](https://jsfiddle.net/highcharts/rtcx6j3h/)):

```js
<script type="module">
  import Highcharts from 'https://code.highcharts.com/es-modules/masters/highcharts.src.js';

  Highcharts.chart('container', {
    ...
  });
</script>
```


## Load Highcharts as an AMD module
Highcharts is compatible with AMD module loaders (such as RequireJS). Module files require an initialization step in order to reference Highcharts. To accomplish this, pass Highcharts to the function returned by loading the module. The following example demonstrates loading Highcharts along with two modules using RequireJS. No special RequireJS config is necessary for this example to work.
```js
requirejs([
    'path/to/highcharts.js',
    'path/to/modules/exporting.js',
    'path/to/modules/accessibility.src.js'
], function (Highcharts, exporting, accessibility) {
    // This function runs when the above files have been loaded

    // We need to initialize module files and pass in Highcharts
    exporting(Highcharts); // Load exporting before accessibility
    accessibility(Highcharts);

    // Create a test chart
    Highcharts.chart('container', {
        series: [{
            data: [1,2,3,4,5]
        }]
    });
});
```

## Load Highcharts as a CommonJS module
Highcharts is using an UMD module pattern, as a result it has support for CommonJS.
*The following examples presumes you are using npm to install Highcharts, see [Download and install Highcharts](#download-and-install-highcharts) for more details.*
```js
// Load Highcharts
var Highcharts = require('highcharts');
// Alternatively, this is how to load Highstock. Highmaps is similar.
// var Highcharts = require('highcharts/highstock');

// Load the exporting module, and initialize it.
require('highcharts/modules/exporting')(Highcharts);

// Generate the chart
Highcharts.chart('container', {
  // options - see https://api.highcharts.com/highcharts
});
```

## Load Highcharts as an ES6 module
Since Highcharts supports CommonJS, it can be loaded as an ES6 module with the use of transpilers. Two common transpilers are [Babel](https://babeljs.io/) and [TypeScript](https://www.typescriptlang.org/). These have different interpretations of a CommonJS module, which affects your syntax.
*The following examples presumes you are using npm to install Highcharts, see [Download and install Highcharts](#download-and-install-highcharts) for more details.*
### Babel
```js
import Highcharts from 'highcharts';
// Alternatively, this is how to load Highstock. Highmaps is similar.
// import Highcharts from 'highcharts/highstock';

// Load the exporting module.
import Exporting from 'highcharts/modules/exporting';
// Initialize exporting module.
Exporting(Highcharts);

// Generate the chart
Highcharts.chart('container', {
  // options - see https://api.highcharts.com/highcharts
});
```
### TypeScript
```js
import * as Highcharts from 'highcharts';
// Alternatively, this is how to load Highstock. Highmaps is similar.
// import Highcharts from 'highcharts/highstock';

// Load the exporting module.
import * as Exporting from 'highcharts/modules/exporting';
// Initialize exporting module.
Exporting(Highcharts);

// Generate the chart
Highcharts.chart('container', {
  // options - see https://api.highcharts.com/highcharts
});
```

## Build and debug
If you want to do modifications to Highcharts or fix issues, you may build your own files. Highcharts uses Gulp as the build system. After `npm install` in the root folder, run `gulp`, which will set up a watch task for the JavaScript and SCSS files. Now any changes in the files of the `/js` or `/css` folders will result in new files being built and saved in the `code` folder. Other tasks are also available, like `gulp lint`.

```
npm install
gulp
```

## Generate API docs
Clone the repositories `api-docs` and `highcharts-docstrap` in the same parent
folder as this `highcharts` repository. Do not forgett to install depending
modules in this repositories by `npm i`. Finally you can run in this
`highcharts` repository the doc generator with `gulp jsdoc --watch`, which also
starts a new server with the generated API documentation.
