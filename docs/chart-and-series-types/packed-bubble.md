Packed bubble
===

A bubble chart requires three dimensions of data; the x-value and y-value to position the bubble along the value axes and a third value for its volume. Packed Bubble charts have a simpler data structure, a flat, one-dimensional array with volumes is sufficient. The bubble’s x/y position is automatically calculated using an algorithm that packs the bubbles in a cluster. The series data point configuration has support for setting colors and label values. Drag’n drop feature was also added to give the user a chance to quickly move one bubble between series and then check how their relations will change.

Get started
-----------

Packed Bubble chart are part of the [highcharts-more](https://code.highcharts.com/highcharts-more.js) package, make sure this is loaded in your webpage or added as a dependency to your project. The `chart.type()` property of this chart is set with `packedbubble`.

The configuration of `packedbubble` differs little from other series types like scatter and bubble charts, and many other settings have defaults for responsiveness, tooltip, colors, legends, etc. A few lines of code are needed to get started with Packed Bubble.

Here is an [example](https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/highcharts/blog/packed-bubble-basic) of a packed bubble chart in its simplest form:

    Highcharts.chart('container', {
        chart: {
            type: 'packedbubble'
        },
        series: [{
            data: [50, 12, 33, 45, 60] // sizes of the bubble
        }]
    });

Data format
-----------

In the above example, the series data for Packed Bubble takes a one-dimensional array of values, but can also take data point properties for `color()` and `name()`.

Here is an example of how to set the data for a packed bubble with 3 series and different data formats:


    Highcharts.chart('container', {
        chart: {
            type: 'packedbubble',
        },
        series: [{
            name: 'Coffee', // Coffee series
            data: [{
                // name property is used for the datalabel
                // value property is used for the volume of the bubble
                value: 12,
                name: 'Bert'
            }, {
                value: 5,
                name: 'John'
            }, {
                value: 10,
                name: 'Sandra'
            }, {
                value: 7,
                name: 'Cecile'
            }]
        }, {
            name: 'Energy drinks', // Energy drinks series
            data: [{
                value: 10,
                name: 'Tristan'
            }]
        }, {
            name: 'Tea', // Tea series
            data: [5, 6, 8, {
                value: 10,
                name: 'Mustapha',
                color: 'pink'
            }]
        }]
    });

Notice in the code above, that the Tea data series is set with one dimensional array, except for the last point, which is set with values for volume, name and a color.

<iframe width="100%" height="710" style="null" src=https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/highcharts/blog/packed-bubble-simple-demo/embedded/result allow="fullscreen"></iframe>

<iframe style="width: 100%; height: 860px; border: none;" src=https://www.highcharts.com/samples/embed/highcharts/demo/packed-bubble allow="fullscreen"></iframe>

Bubble sizes
------------

Packed Bubble charts with a dataset of either many small or large values need some tweaking of the options to control the size of the bubbles displayed. The minimum and maximum size of bubbles is configured by two parameters: minSize and maxSize Bubbles will automatically size between the minSize and maxSize to reflect the volume of each bubble. Can be either pixels (when no unit is given), or a percentage of the smallest one of the plot width and height.

Here is an example of setting min and max size for bubbles:


    Highcharts.chart('container', {
        chart: {
            type: 'packedbubble'
        },
        plotOptions: {
            packedbubble: {
                minSize: 15,
                maxSize: 300
            }
        },
        series: [{
            data: [1, 75, 112, 180, 20, 3000]
        }]
    });

<iframe width="100%" height="500" style="null" src=https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/highcharts/blog/packed-bubble-basic/embedded/result allow="fullscreen"></iframe>

----------------------------------------------

### ALGORITHMS

The layout algorithm is configured using [series.layoutAlgorithm](https://api.highcharts.com/highcharts/series.packedbubble.layoutAlgorithm) options when the `useSimulation` param is enabled.

The `series.layoutAlgorithm` are includes options to change the speed, padding, initial bubbles positions and more.

```js
layoutAlgorithm: {
    gravitationalConstant: 0.05,
    splitSeries: true,
    seriesInteraction: false,
    dragBetweenSeries: true,
    parentNodeLimit: true
}
```

### SPLIT

Whether to split series into individual groups or to mix all series together.


```js
plotOptions: {
    packedbubble: {
        layoutAlgorithm: {
            splitSeries: true
        }
    }
}
```

<iframe style="width: 100%; height: 860px; border: none;" src=https://www.highcharts.com/samples/embed/highcharts/demo/packed-bubble-split allow="fullscreen"></iframe>

### SIMULATION

[The simulation](https://api.highcharts.com/highcharts/series.packedbubble.useSimulation) can be disabled or enabled, which has an influence on adding options to the series graph based on the used layout. All parameters reflect in both animation and the final position of bubbles.

```js
plotOptions: {
    packedbubble: {
        useSimulation: true
    }
}
plotOptions: {
    packedbubble: {
        useSimulation: false
    }
}
```

<iframe style="width: 100%; height: 860px; border: none;" src=https://www.highcharts.com/samples/embed/highcharts/series-packedbubble/spiral allow="fullscreen"></iframe>

### DRAG AND DROP

Flag to determine if nodes are draggable or not. Available for graph with useSimulation set to true only.

```js
plotOptions: {
    packedbubble: {
        Draggable: true
    }
}
```

The option [dragBetweenSeries: true](https://api.highcharts.com/highcharts/series.packedbubble.layoutAlgoritm.dragBetweenSeries) is declared in layoutAlgorithm params and allows the user to drag and drop points between series, for changing point related series.

```js
layoutAlgorithm: {
    splitSeries: true,
    dragBetweenSeries: true
}
```

Use Cases
---------

### Use Case 1

1. Force-approach algorithm.

<iframe style="width: 100%; height: 860px; border: none;" src=https://www.highcharts.com/samples/embed/highcharts/demo/packed-bubble allow="fullscreen"></iframe>

2. Configuration

```js
plotOptions: {
    packedbubble: {
        useSimulation: true,
        layoutAlgorithm: {
            splitSeries: false
        }
    }
}
```

### Use Case 2

1. Force-approach algorithm with split series.

<iframe style="width: 100%; height: 860px; border: none;" src=https://www.highcharts.com/samples/embed/highcharts/demo/packed-bubble-split allow="fullscreen"></iframe>

2. Configuration:

```js
plotOptions: {
    packedbubble: {
        useSimulation: true,
        layoutAlgorithm: {
            splitSeries: true,
            seriesInteraction: false,
            dragBetweenSeries: true,
            parentNodeLimit: true
        }
    }
}
```

### Use Case 3

1. 7.0. Spiral packing - simple, fast alternative of the packed bubble, that may be used for more complicated data sets:

<iframe style="width: 100%; height: 860px; border: none;" src=https://www.highcharts.com/samples/embed/highcharts/series-packedbubble/spiral allow="fullscreen"></iframe>
