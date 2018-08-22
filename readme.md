# lkHighcharts - Looker's fork of Highcharts

Highcharts is extremely extendable, so why would we need to fork it? As it turns down, in the root of Highchart's bootstrap code, it throws an error if Highcharts is already defined on the global scope. This is bad for us, since we potentially have two versions of Highcharts loading - one for custom visualizations, and a second one that we use internally. That being said, this fork makes exactly one change - it changes the name of that global variable from `Highcharts` to `lkHighcharts`. This prevents any additional highcharts loads from custom visualizations or anywhere else from interferring with our internal Highcharts. The great part about it is that it still exports a variable named `Highcharts`, so if you use the import syntax, you do not have to make any code changes to the codebase. You can still call `Highcharts.whatever_you_want`.

## Supporting this Fork

As was said above, there is exactly one codebase change in this fork to change the name of that global variable. However, you should also know I made some very minor changes to the package.json and the `.gitignore` to get this to play nicely with yarn and our codebase.

 - Changed the `main` in the package.json to `code/highcarts`
 - Removed the `code` directory from the `.gitignore` and adds it to the list of files in the package.json
 - Removed 4 test assertions that relied on a specific timezone locale.

## Updating a building the code.

If you upstream origin doesn't exist, you can add it with:

```
git remote add upstream https://github.com/highcharts/highcharts.git
```

Then run:
```
git fetch upstream
```

and:

```
git pull upstream master
```

This will pull in the latest master from highcharts. There should not be any conflicts, but if there are, refer to the changes above to resolve them correctly.

Once you have pulled in master and/or made your change. You have to build a new distribution. You can do this with:

```
npm install && gulp dist
```

The `dist` gulp task will build all of the files to the `code` directory. This will take a few minutes. Once it is complete, commit your code and PR it into this fork's master branch.

# Highcharts JS is a JavaScript charting library based on SVG, with fallbacks to VML and canvas for old browsers.

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
See [Bower documentation](https://bower.io/) on how to get started with Bower.
```
bower install highcharts
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
