Custom technical indicators
===

This article shows how to create custom technical indicators, in this case, linear regression. To read more about technical indicators offered by Highcharts click [here](https://www.highcharts.com/docs/stock/technical-indicator-series).

Be sure to have at least the [Highcharts version 6](https://www.highcharts.com/blog/news/announcing-highcharts-6/), as previous Highcharts versions don’t support technical indicators.

TECHNICAL INDICATOR SERIES
--------------------------

There are two main steps to create a technical indicator series:

1.  Set up the technical indicator structure.
2.  Create the technical indicator functionality.

### 1. Set up the structure

Each technical indicator requires the method `getValues()` to be implemented. This method takes two arguments and returns an object. The arguments are the main series and the parameters. The parameters are specific to a technical indicator. Check the structure of the method `getValue()`:

```js
  function getValues(series, params) {
    // calculations
    ...
    // end of calculations
    return {
      xData: [...], // array of x-values
      yData: [...] // array of y-values
      values: [...], // array of points
    };
  }
```

All technical indicators are series types, and to create a new series, in Highcharts, the following method [Highcharts.seriesType()](https://api.highcharts.com/class-reference/Highcharts.html#seriesType) is used.

```js
<script type="text/javascript" src="https://code.highcharts.com/stock/indicators/indicators.js"></script>

Highcharts.seriesType(
  'linearregression',
  'sma',
  {
    name: 'Linear Regression',
    params: {} // linear regression doesn’t need params
  },
  {
    getValues: function (series, params) {
      return this.getLinearRegression(series.xData, series.yData);
    },
    getLinearRegression: getLinearRegression
  }
);
```
    

The method `getLinearRegression()` includes the technical indicator functionality (mathematical calculation). Notice that the indicators module `indicators.js` is included when creating technical indicators, as it includes the core-logic for all indicators.

Now the structure is set, the next step is to create the main indicator functionality.

### 2. Technical indicator functionality

The technical indicator functionality is represented by the following method `getLinearRegression()`, that calculates the regression points according to xData and yData.

Here is a simple mathematical representation of the linear regression:

![Screen Shot 2017-11-03 at 14.11.43.png](https://lh6.googleusercontent.com/8NvDcqjObGTJGu-fuCMAcfWFK8OwOsOO65LmuJobonUW0sueqSeW4whnWOLWmHrC4tqvgpvfzNgSrurM6cSFOuvE7anlKHPEI1xoz9uHh2BRTVEv1woPHaL9Xqv0VAhXoCxBLZdI)

Where the slope is: 

![Screen Shot 2017-11-03 at 14.11.51.png](https://lh4.googleusercontent.com/Owfqf0RgAgMeOQIsjt6oGyhUpEVC2U0tJq1oyc-J8Ney01UN-WLutwXxGbEpClkGBQNLaZ2FHtm4oSegZmg5clvlsBl9LiAWAVPpgb8oWoE06s7h8SO8LYU6seepsdkyxCFhq8AU)

And offset:

![Screen Shot 2017-11-03 at 14.12.06.png](https://lh3.googleusercontent.com/oACfBFWV5gm7yPq6kUoPGJkPbdntUnjOVqRON491vVA77WbvS294c8kTEshlzPbu7Yoo1zoUeqP5afr2WfxBUhgUIwFO2uojZWlGlFy1nQBa2KjF7HfF_cPEHTRjUS9U1lyyUZ0g)

The JavaScript representation of the formulas above is as follow:

```js
function getLinearRegression(xData, yData) {
  var sumX = 0,
      sumY = 0,
      sumXY = 0,
      sumX2 = 0,
      linearData = [],
      linearXData = [],
      linearYData = [],
      n = xData.length,
      alpha, beta, i, x, y;

  // Get sums:
  for (i = 0; i < n; i++) {
    x = xData[i];
    y = yData[i];
    sumX += x;
    sumY += y;
    sumXY += x * y;
    sumX2 += x * x;
  }

  // Get slope and offset:
  alpha = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  if (isNaN(alpha)) {
    alpha = 0;
  }
  beta = (sumY - alpha * sumX)/ n;

  // Calculate linear regression:
  for (i = 0; i < n; i++) {
    x = xData[i];
    y = alpha * x + beta;

    // Prepare arrays required for getValues() method
    linearData[i] = [x, y];
    linearXData[i] = x;
    linearYData[i] = y;
  }

  return {
    xData: linearXData,
    yData: linearYData,
    values: linearData
  };
}
```

Notice that Linear regression series in this example is still a line series, and that means data has to be sorted ascending by x-values.

That’s it; the technical indicator is ready to be used. Keep in mind that the technical indicator is connected to the main series by the [linkedTo](https://api.highcharts.com/highstock/plotOptions.sma.linkedTo) option:

```js
series: [{
  id: 'main',
  type: 'scatter',
  data: [ ... ]
}, {
  type: 'linearregression',
  linkedTo: 'main'
}]
```
    

For live demos check the links below:

*   [Scatter Height vs Weight](https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/stock/indicators/custom-regression-scatter/)
*   [AAPL Stock Price](https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/stock/indicators/custom-regression-aapl/)
*   [Average Monthly Temperature and Rainfall in Tokyo](https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/stock/indicators/custom-regression-column/)

**Remark**

To improve the user experience when using the linear regression series, try to disable tooltip and/or markers. Go to the `seriesType()` and set the default options as follow:

```js
Highcharts.seriesType(
  'linearregression',
  'sma',
  {
    name: 'Linear Regression',
    enableMouseTracking: false, // default options
    marker: {
      enabled: false
    }
    params: {} // linear regression doesn’t need params
  },
  {
    getValues: ... ,
    getLinearRegression: ...
  }
);
```