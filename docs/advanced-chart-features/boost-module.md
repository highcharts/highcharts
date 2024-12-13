Boost module
============

The Boost module is a stripped down renderer and a set of data handling modifications for Highcharts. It bypasses some of the standard Highcharts features, applies some trade-offs and focuses on handling and rendering as many data points as possible as quickly as possible. It renders the data using WebGL on a canvas inside the chart's SVG structure.

This document will guide you through your first steps with the Highcharts Boost module.

Including the Boost module in your project
-------------------------------

The Boost module is a "renderer-in-a-module". Including [modules/boost.js](https://code.highcharts.com/modules/boost.js) will, by default, activate boost once the number of points or series exceed either of the [boost thresholds](#series-boosting-versus-chart-boosting) for all series that support it (line, column, bar, treemap, heatmap, scatter, bubble, area, areaspline, arearange, columnrange).

If needed, boost can be disabled on a chart-by-chart basis by setting [boost.enabled](https://api.highcharts.com/highcharts/boost.enabled) to `false` in the chart configuration.

**Note**: The Boost module should be included last. This is because it overrides both standard Highcharts functionality, and functionality in certain modules (namely treemap, heatmap, bubble, and scatter).

### With ES modules
```js
import Highcharts from "highcharts";
import HighchartsBoost from "highcharts/modules/boost";
// Import order is important !
HighchartsBoost(Highcharts);

// Then you can use your Highcharts as usual

```

Configuration Options
---------------------

The main boost configuration is set in the `boost` property in the chart options. See [the API](https://api.highcharts.com/highcharts/boost) for the detailed description of available options.

    {
        boost: {
            useGPUTranslations: true,
            // Chart-level boost when there are more than 5 series in the chart
            seriesThreshold: 5
        },

        title: {
            text: 'Highcharts Boost'
        },

        series: [{
            boostThreshold: 1,  // Boost when there are more than 1
                                // point in the series.
            data: [ [0, 1], [1, 2], [2, 3] ]
        }]
    };

_Configuration for a boosted line chart._

Configuration Data Options
---------------------

In boost mode, [turbo mode](https://api.highcharts.com/highcharts/plotOptions.series.turboThreshold) is always turned on. That means all data points should be configured as an array of numbers (e.g. `[1, 2, 3]`) or a two dimensional array of numbers (e.g. `[ [1, 2], [2, 3], [3, 4] ]`).

Note that when `dataGrouping` is enabled (default in `stockChart`), boost mode will not kick in.

Series boosting versus chart boosting
-------------------------------------

There are two different ways of boosting charts - on a series-by-series level ([series.boostThreshold](https://api.highcharts.com/highcharts/plotOptions.series.boostThreshold)), and on the chart as a whole ([boost.seriesThreshold](https://api.highcharts.com/highcharts/boost.seriesThreshold)).

The former works well in most cases, whereas the latter is meant for charts with large amounts of series (such as monitoring server clusters).

When boosting on the chart level, all boostable series are rendered to the same canvas element, whereas on the series boosting level, each series have their own, final, render target. As such, combination charts that combine both boostable and non-boostable series types should always be boosted on the series-level so that the draw order is as expected.

The two different modes each has their own threshold value. For chart-level boosting, the threshold is the number of series that must be present in the chart for the boost to “kick in” (50 by default). For series-level boosting, the threshold is the number of points in the series that must be present for that particular series to enter boost mode (5,000 by default).

Caveats
-------

The Boost module contains a WebGL renderer that replaces parts of the SVG renderer. Additionally, it bypasses and simplifies some of the resource-hungry aspects of handling big data. As such, certain features are not available for boosted charts. Most of these features deal with interactivity, such as animation support. But there are a few that relate to visuals as well.

* The largest caveat is that rectangles for column and bar charts are always drawn as a single 1 pixel wide line. This will likely not be the desired outcome when zoomed in to the level where each column/bar is visible as an individual entity. Thus, column and bar charts are more suited to series-level boosting.
* The area of area and areaspline series are drawn as 1px columns. This works well with the intended way of using the Boost module, which is that it kicks in when the number of data points crosses the `boostThreshold`. But if the boost threshold is set too low, an area and areaspline charts will look like a column chart. This is a limitation that we are considering fixing. In addition to this, the _line_ itself is not rendered in area and areaspline series.
* Marker shapes, apart from circles, are not supported
* Dash style for lines is not supported
* Stacking, and negative colors are not supported.
* Line width is limited to 1px.

The intended way of using the module, is to set thresholds in such a way that the SVG-renderer “takes over” rendering when zooming in. This approach gives the expected interactivity when the points are less dense, coupled with high performance when the point density is high.

Optimizing tips
---------------

* Set the extremes ([min](https://api.highcharts.com/highcharts/xAxis.min) and [max](https://api.highcharts.com/highcharts/xAxis.max)) explicitly on the `xAxis` and `yAxis` in order for Highcharts to avoid computing the extremes. In a scatter chart with 1M points, this may reduce the rendering time by ~10%.
* If the value increments on both the X and Y axis aren't small, consider setting [useGPUTranslations](https://api.highcharts.com/highcharts/boost.useGPUTranslations) to true. If you do this and the increments are small (e.g. datetime axis with small time increments) it may cause rendering issues due to floating point rounding errors, so this should be considered case by case.


Getting timing information
--------------------------

The Boost module has built-in timing measurements for seeing how different aspects of the boost renderer perform. `console.time` and `console.endTime` are used to probe execution time. The result is outputted in the developer console.

There are five different probes that can be activated:

*   WebGL initialization (`timeSetup`)
*   Series processing (`timeSeriesProcessing`)
*   K-d tree processing (`timeKDTree`)
*   Buffer copy (`timeBufferCopy`)
*   Rendering (`timeRendering`)

All of the above settings are booleans set in the `debug` object on the `boost` property.

Note that the K-d tree is build async, which means that it will not lock up the UI thread in the browser while in progress. It also happens after the chart is rendered. Because of this, there is a small delay after the chart is rendered before the hover tooltips are activated.

Samples
-------

*   [Area chart](https://highcharts.com/samples/highcharts/boost/area) – 500,000 points
*   [Stacked area chart](https://highcharts.com/samples/highcharts/boost/area-stacked) – 50,000 points
*   [Area range chart](https://highcharts.com/samples/highcharts/boost/arearange) – 500,000 points
*   [Bubble chart](https://highcharts.com/samples/highcharts/boost/bubble) - 50,000 points
*   [Column chart](https://highcharts.com/samples/highcharts/boost/column) – 500,000 points
*   [Heatmap](https://highcharts.com/samples/highcharts/boost/heatmap)
*   [Line chart](https://highcharts.com/samples/highcharts/boost/line) – 500,000 points
*   [Series-heavy line chart](https://highcharts.com/samples/highcharts/boost/line-series-heavy) - 600 series, 600,000 points
*   [Series-heavy stock chart](https://highcharts.com/samples/highcharts/boost/line-series-heavy-stock) \- 600 series, 72,000 points
*   [Dynamic series-heavy stock chart](https://highcharts.com/samples/highcharts/boost/line-series-heavy-dynamic) - 600 series, 12,000 initial points; adds 1 point to all series every second
*   [Scatter chart](https://highcharts.com/samples/highcharts/boost/scatter) – 1,000,000 points
*   [Treemap](https://highcharts.com/samples/highcharts/boost/treemap)
