Installing with NPM
===

The official npm package contains Highcharts, Highstock and Highmaps plus all modules. Start by installing Highcharts as a node module and save it as a dependency in your package.json:

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
    

Load Highstock or Highmaps
--------------------------

Highcharts is already included in Highstock, so it is not necessary to load both. The highstock.js file is included in the package. The highmaps.js file is also included, but unlike highstock.js, this doesn't include the complete Highcharts feature set. To load the full suite in one page, load Highmaps as a module.

```js
var Highcharts = require('highcharts/highstock');  
// Load Highmaps as a module
require('highcharts/modules/map')(Highcharts);
```

Alternatively when only map functionality is needed, and not stock.

```js
var Highcharts = require('highcharts/highmaps');
```

