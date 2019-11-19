Boost module
===

Boost is a stripped-down renderer-in-a-module for Highcharts and Highstock. It bypasses some of the standard Highcharts features (such as animation), and focuses on pushing as many points as possible as quickly as possible.

This document will guide you through your first steps with the Highcharts boost module.

Including boost in your project
-------------------------------

The boost module is a “renderer-in-a-module”. Including [modules/boost.js](https://code.highcharts.com/modules/boost.js) will, by default, activate boost for all series that support it (line series, column, bar, treemap, heatmap, scatter, bubble, area).

If needed, boost can be disabled on a chart-by-chart basis by setting `boost.enabled` to `false` in the chart configuration.

**Note**: Boost should be the last module included. This is because it overrides both standard Highcharts functionality, and functionality in certain modules (namely treemap, heatmap, bubble, and scatter).

Configuration Options
---------------------

The main boost configuration is set in the `boost property in the chart options.`

|Option|Description|
|--- |--- |
|boost.enabled|If set to true, boost is enabled for the chart. Defaults to true.|
|boost.useGPUTranslations|Perform value to pixel translations in the shader, rather than on the GPU. This may have adverse effects on some datasets (especially those where floating point precision may be an issue, such as timestamps with small intervals).|
|boost.usePreallocated|If set to true, a native Float32Array buffer will be used directly for adding series points to the internal vertex buffers. This speeds up series processing significantly. It’s well-suited for bubble, scatter, column, and bar charts.|
|boost.allowForce|If set to true, the whole chart will be boosted if all of its series are supported by the boost module, and if at least one series crosses its boost threshold.|
|boost.useAlpha|Enable or disable alpha blending (opacity). Defaults to true.|
|boost.debug|An object containing options for enabling timing information, and debug output.|
|boost.debug.timeSetup|Enable output of how long the WebGL setup took.|
|boost.debug.timeSeriesProcessing|Enable output of how how long the series processing took.|
|boost.debug.timeBufferCopy|Enable output of how long the copy of the render target to the SVG-embeddable image took.|
|boost.debug.timeKDTree|Enable output of how long it took to build the K-d tree.|
|boost.debug.showSkipSummary|Enable output of how many points where culled away by the proximity culler. The proximity culler skips a point if the last point drawn was closer than 1 pixel along both X and Y to the current point.|
|boost.seriesThreshold|A number that specifies how many series the chart must contain before it enters boost mode. Defaults to 50.|
|series|plotOptions.series.boostThreshold|The number of points that needs to be in the series for the boost to kick in. Defaults to 5000.|
    
    {
        boost: {
            useGPUTranslations: true
        },
    
        title: {
            text: 'Highcharts Boost'
        },
    
        series: [{
    	      boostThreshold: 1,  // Boost when there are more than 1
                                // point in the chart.
            data: [ [0, 1], [1, 2], [2, 3] ]
        }]
    };
    

_Configuration for a boosted line chart._

Configuration Data Options
---------------------

In boost mode, [turbo mode](https://api.highcharts.com/highcharts/plotOptions.series.turboThreshold) is always turned on. That means all data points should be configured as an array of numbers (e.g. `[1, 2, 3]`) or a two dimensional array of numbers (e.g. `[ [1, 2], [2, 3], [3, 4] ]`).

Series boosting versus chart boosting
-------------------------------------

There are two different ways of boosting charts - on a series-by-series level (`series.boostThreshold`), and on the chart as a whole (`boost.seriesThreshold`).

The former works well in most cases, whereas the latter is meant for charts with large amounts of series (such as monitoring server clusters).

When boosting on the chart level, all boostable series are rendered to the same target, whereas on the series boosting level, each series have their own, final, render target. As such, combination charts that combine both boostable and non-boostable series types should always be boosted on the series-level so that the draw order is as expected.

The two different modes each has their own threshold value. For chart-level boosting, the threshold is the number of series that must be present in the chart for the boost to “kick in”. For series-level boosting, the threshold is the number of points in the series that must be present for that particular series to enter boost mode.

Caveats
-------

The boost module is a stripped down version of the SVG renderer. As such, certain features are not available for boosted charts. Most of these features deals with interactivity, such as animation support. But there are a few that relates to visuals as well.

The largest caveat is that rectangles for column and bar charts are always drawn as a single 1 pixel wide line. This will likely not be the desired outcome when zoomed in to the level where each column/bar is visible as an individual entity. Thus, column and bar charts are more suited to series-level boosting.

In addition to that, area lines are not drawn, and marker shapes, apart from circles, are not supported. It also not possible to set dash style for lines. Zones, stacking, and negative colors are also not supported.

The intended way of using the module, is to set thresholds in such a way that the SVG-renderer “takes over” rendering when zooming in. This approach gives the expected interactivity when the points are less dense, coupled with high performance when the point density is high.

Getting timing information
--------------------------

The boost module has built-in timing measurements for seeing how different aspects of the boost renderer perform. `console.time` and `console.endTime` are used to probe execution time. The result is outputted in the developer console.

There are five different probes that can be activated:

*   WebGL initialization (`timeSetup`)
*   Series processing (`timeSeriesProcessing`)
*   K-d tree processing (`timeKDTree`)
*   Buffer copy (`timeBufferCopy`)

All of the above settings are booleans set in the `debug` object on the `boost` property.

Note that the K-d tree is build async, which means that it will not lock up the UI thread in the browser while in progress. It also happens after the chart is rendered. Because of this, there is a small delay after the chart is rendered before the hover tooltips are activated.

Samples
-------

*   [Area chart](https://jsfiddle.net/gh/get/jquery/1.7.2/highslide-software/highcharts.com/tree/master/samples/highcharts/boost/area/) – 500,000 points
*   [Stacked area chart](https://jsfiddle.net/gh/get/jquery/1.7.2/highslide-software/highcharts.com/tree/master/samples/highcharts/boost/area-stacked) – 50,000 points
*   [Area range chart](https://jsfiddle.net/gh/get/jquery/1.7.2/highslide-software/highcharts.com/tree/master/samples/highcharts/boost/arearange) – 500,000 points
*   [Bubble chart](https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/highcharts/boost/bubble/) - 50,000 points
*   [Column chart](https://jsfiddle.net/gh/get/jquery/1.7.2/highslide-software/highcharts.com/tree/master/samples/highcharts/boost/column) – 500,000 points
*   [Heatmap](https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/highcharts/boost/heatmap/)
*   [Line chart](https://jsfiddle.net/gh/get/jquery/1.7.2/highslide-software/highcharts.com/tree/master/samples/highcharts/boost/line/) – 500,000 points
*   [Series-heavy line chart](https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/highcharts/boost/line-series-heavy/) - 600 series, 600,000 points
*   [Series-heavy stock chart](https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/highcharts/boost/line-series-heavy-stock/) \- 600 series, 72,000 points
*   [Dynamic series-heavy stock chart](https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/highcharts/boost/line-series-heavy-dynamic/) - 600 series, 12,000 initial points; adds 1 point to all series every second
*   [Scatter chart](https://jsfiddle.net/gh/get/jquery/1.7.2/highslide-software/highcharts.com/tree/master/samples/highcharts/boost/scatter) – 1,000,000 points
*   [Treemap](https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/highcharts/boost/treemap/)
