Installing with NPM
===

The official npm package contains Highcharts, including the Stock, Maps and Gantt packages, plus all modules. Start by installing Highcharts as a node module and save it as a dependency in your package.json:

`npm install highcharts --save`

Load Highcharts with require
----------------------------

```js
var Highcharts = require('highcharts');  
// Load module after Highcharts is loaded
require('highcharts/modules/exporting')(Highcharts);  
// Create the chart
Highcharts.chart('container', { /*Highcharts options*/ });
```

For other ways to load Highcharts (for example using ECMAScript modules) please see [installation](https://highcharts.com/docs/getting-started/installation).

Load Highcharts Stock, Maps, or Gantt
-------------------------------------

Highcharts is already included in Highcharts Stock, Maps, and Gantt, so it is not necessary to load both. These products are all included in the npm package. The bundles are available as `highcharts/highstock`, `highcharts/highmaps`, and `highcharts/highcharts-gantt`.

These Stock, Maps, and Gantt bundles can't run in the same page along with each other or with `highcharts`. If Stock, Maps, or Gantt are required in the same page as each other or with basic Highcharts, they can be loaded as modules:

```js
// Highstock bundle includes Stock and basic Highcharts
var Highcharts = require('highcharts/highstock');  
// Load Highcharts Maps as a module to get both Maps and Stock
require('highcharts/modules/map')(Highcharts);
```

Alternatively when only Maps functionality is needed, and not Stock:

```js
// Highmaps bundle still includes basic Highcharts, but not Stock
var Highcharts = require('highcharts/highmaps');
```

Installing nightly builds of Highcharts
--------------------------------------
Nightly builds allow the access to the next Highcharts version prior to release and testing. Currently this is available via the [highcharts-dist nightly branch](https://github.com/highcharts/highcharts-dist/tree/nightly) on Github.
Note that we do not recommend the use of the nightly build in production environments as it **may contain bugs and are not considered stable.**

The nightly build can be installed by running `npm install --save highcharts/highcharts-dist#nightly`. 

As this is a dependency to a GitHub branch you will not be able to update the dependency using `npm update`. 
Updating requires that you uninstall and then reinstall by running `npm uninstall highcharts && npm install --save highcharts/highcharts-dist#nightly`. 
Uninstalling is also necessary when moving from a nightly build to a production version of Highcharts.
