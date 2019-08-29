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
without any bundling tools by using `<script type="module">` ([demo](https://jsfiddle.net/highcharts/rtcx6j3h/)):
```html
<script type="module">
    import Highcharts from 'https://code.highcharts.com/es-modules/masters/highcharts.src.js';

    Highcharts.chart('container', {
        ...
    });
</script>
```
The following example shows dynamic import with lazy-loading:
```js
    import('https://code.highcharts.com/es-modules/masters/highcharts.src.js')
        .then(imported => imported.default)
        .then(Highcharts => import('https://code.highcharts.com/es-modules/masters/modules/exporting.src.js').then(() => Highcharts))
        .then(Highcharts => import('https://code.highcharts.com/es-modules/masters/modules/accessibility.src.js').then(() => Highcharts))
        .then(Highcharts => {
            Highcharts.chart('container', {
                ...
            });
        });
```

## Load Highcharts from the CDN as an AMD module
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

## Load Highcharts as a CommonJS module
Highcharts is using an UMD module pattern, as a result it has support for CommonJS.
*The following examples presumes you are using npm to install Highcharts, see [Download and install Highcharts](#download-and-install-highcharts) for more details.*
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

## Load Highcharts as a transpiled ES6/UMD module
Since Highcharts supports ES6 (ESM - ECMAScript modules) and UMD (AMD, CommonJS), it can be also loaded as a module with the use of transpilers. Two common transpilers are [Babel](https://babeljs.io/) and [TypeScript](https://www.typescriptlang.org/).
*The following examples presumes you are using npm to install Highcharts, see [Download and install Highcharts](#download-and-install-highcharts) for more details.*
### Babel
```js
import Highcharts from 'highcharts';
// Alternatively, this is how to load Highstock. Highmaps and Highcharts Gantt are similar.
// import Highcharts from 'highcharts/highstock';

// Load the exporting module.
import Exporting from 'highcharts/modules/exporting';
// Initialize exporting module. (CommonJS only)
Exporting(Highcharts);

// Generate the chart
Highcharts.chart('container', {
  // options - see https://api.highcharts.com/highcharts
});
```
### TypeScript + UMD
```js
import Highcharts from 'highcharts';
// Alternatively, this is how to load Highstock. Highmaps and Highcharts Gantt are similar.
// import Highcharts from 'highcharts/highstock';

// Load the exporting module.
import Exporting from 'highcharts/modules/exporting';
// Initialize exporting module. (CommonJS only)
Exporting(Highcharts);

// Generate the chart
Highcharts.chart('container', {
  // options - see https://api.highcharts.com/highcharts
});
```
```json
{
  "compilerOptions": {
    "allowSyntheticDefaultImports": true,
    "module": "umd",
    "moduleResolution": "node"
  }
}
```
### TypeScript + ESM from CDN
```js
// Load modules the ES6 way
import Highcharts from 'https://code.highcharts.com/es-modules/masters/highcharts.src.js';
import 'https://code.highcharts.com/es-modules/masters/modules/exporting.src.js';

// Generate the chart
Highcharts.chart('container', {
  // options - see https://api.highcharts.com/highcharts
});
```
```json
{
  "compilerOptions": {
    "allowSyntheticDefaultImports": true,
    "esModuleInterop": true,
    "baseUrl": "./",
    "module": "es6",
    "moduleResolution": "node",
    "target": "es6",
    "paths": {
      "https://code.highcharts.com/es-modules/masters/*.src.js": [
        "node_modules/highcharts/*.src"
      ]
    }
  }
}
```

## Build and debug
If you want to do modifications to Highcharts or fix issues, you may build your own files. Highcharts uses Gulp as the build system. After `npm install` in the root folder, run `gulp`, which will set up a watch task for the JavaScript and SCSS files. Now any changes in the files of the `/js` or `/css` folders will result in new files being built and saved in the `code` folder. Other tasks are also available, like `gulp lint`.

```
npm install
gulp
```

## Generate API docs
Run in this `highcharts` repository the doc generator with
`npx gulp jsdoc-watch`, which also starts a new server with the generated API
documentation.
