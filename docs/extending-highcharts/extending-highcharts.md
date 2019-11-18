Extending Highcharts
====================

Since version 2.3, Highcharts is built in a modular way with extensions in mind. 

*   Major chart concepts correspond to JavaScript prototypes or "classes" which are exposed on the Highcharts namespace and can easily be modified. Examples are `Highcharts.Series`, `Highcharts.Tooltip`, `Highcharts.Chart`, `Highcharts.Axis`, `Highcharts.Legend` etc. Check [full list](https://api.highcharts.com/class-reference/classes.list) of classes.
*   Constructor logic is consequently kept in a method, `init`, to allow overriding the initiation.
*   Events can be added to the instance through framework event binding. If your framework is jQuery, you can for example run  
    `$(chart).bind('load', someFunction);`

    or use Highcharts build-in method:

    `Highcharts.addEvent(chart, 'load', someFunction);`
*   Some, but not all, prototypes and properties are listed at [api.highcharts.com](https://api.highcharts.com/class-reference/classes.list) under Members and Methods. Some prototypes and properties are not listed, which means they may change in future versions as we optimize and adapt the library. We do not discourage using these members, but warn that your plugin should be tested with future versions of Highcharts. These members can be identified by inspecting the Highcharts namespace as well as generated chart objects in developer tools, and by studying the source code of `highcharts.src.js`.

Wrapping up a plugin
--------------------

Highcharts plugins should be wrapped in an anonymous self-executing function in order to prevent variable pollution to the global scope. A good practice is to wrap plugins like this:

```js
(function (H) {
    var localVar,         // local variable
        Series = H.Series; // shortcut to Highcharts prototype
    doSomething();
}(Highcharts));
```

Initializing an extension when the chart initializes
----------------------------------------------------

Events can be added to both a class and an instance. In order to add a general listener to initialize the extension on every chart, a event can be added to the `Chart` class.

```js
H.addEvent(H.Chart, 'load', function(e) {
    var chart = e.target;
    H.addEvent(chart.container, 'click', function(e) {
        e = chart.pointer.normalize(e);
        console.log('Clicked chart at ' + e.chartX + ', ' + e.chartY);
    });
    H.addEvent(chart.xAxis[0], 'afterSetExtremes', function(e) {
        console.log('Set extremes to ' + e.min + ', ' + e.max);
    });
});
```

[Try it live](https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/highcharts/chart/events-load-class/)

Wrapping prototype functions
----------------------------

JavaScript with its dynamic nature is extremely powerful when it comes to altering the behaviour of scripts on the fly. In Highcharts we created a utility called `wrap`, which wraps an existing prototype function ("method") and allows you to add your own code before or after it. 

The wrap function accepts the parent object as the first argument, the name of the function to wrap as the second, and a callback replacement function as the third. The original function is passed as the first argument to the replacement function, and original arguments follow after that.

It's best explained by a code sample:

```js
H.wrap(H.Series.prototype, 'drawGraph', function (proceed) {

    // Before the original function
    console.log("We are about to draw the graph: ", typeof this.graph);

    // Now apply the original function with the original arguments,
    // which are sliced off this function's arguments
    proceed.apply(this, Array.prototype.slice.call(arguments, 1));

    // Add some code after the original function
    console.log("We just finished drawing the graph: ", typeof this.graph);

});
```

[Try it live](https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/highcharts/series/wrap-drawgraph/)

Example extension
-----------------

In this example the client wanted to use markers ("trackballs") on column type series in Highstock. Markers is currently only supported in line type series. To get this functionality, a small plugin can be written.

This plugin will add a trackball to each series in the chart, that does not already support and contain a marker.

To gain this we start with the following code, creating a self-executing function to contain the plugin:

```js
(function (H) {
    // This is a self executing function
    // The global variable Highcharts is passed along with a reference H
}(Highcharts));
```

Afterwards, we need to add extra functionality to the methods `Tooltip.prototype.refresh` and `Tooltip.prototype.hide`. For this, we wrap the methods:

```js
(function (H) {
    H.wrap(H.Tooltip.prototype, 'refresh', function (proceed, points) {
        // When refresh is called, code inside this wrap is executed
    });
}(Highcharts));
```

When refresh is called, we want it to draw a trackball on the current point in each series. If a series already contains a marker this function should be dropped.

```js
H.wrap(H.Tooltip.prototype, 'refresh', function (proceed, points) {

    // Run the original proceed method
    proceed.apply(this, Array.prototype.slice.call(arguments, 1));

    // For each point add or update trackball
    H.each(points, function (point) {
        // Function variables
        var series = point.series,
            chart = series.chart,
            pointX = point.plotX + series.xAxis.pos,
            pointY = H.pick(point.plotClose, point.plotY) + series.yAxis.pos;

        // If trackball functionality does not already exist
        if (!series.options.marker) {
            // If trackball is not defined
            if (!series.trackball) {
                // Creates a new trackball with same color as the series
                series.trackball = chart.renderer.circle(pointX, pointY, 5).attr({
                    fill: series.color,
                    stroke: 'white',
                    'stroke-width': 1,
                    zIndex: 5
                }).add();
            } else {
                // Updates the position of the trackball
                series.trackball.attr({
                    x: pointX,
                    y: pointY
                });
            }
        }
    });
});
```
    

Now the trackball will be displayed, but we also need to hide it when the tooltip is removed. Therefore som extra functionality is also needed in the hide method. A new wrap is added inside the function containing the plugin:

```js
H.wrap(H.Tooltip.prototype, 'hide', function (proceed) {
    var series = this.chart.series;
    // Run original proceed method
    proceed.apply(this);
    // For each series destroy trackball
    H.each(series, function (serie) {
        var trackball = serie.trackball;
        if (trackball) {
            serie.trackball = trackball.destroy();
        }
    });
});
```

That was all, the whole [sample can be viewed in jsFiddle](https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/highcharts/tooltip/trackball-plugin/).