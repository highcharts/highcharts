Pie dataLabels alignment
===

Highcharts 7 introduces 3 new options for working with data labels: `dataLabels.alignTo`, `dataLabels.connectorShape` and `dataLabels.crookDistance`.

*   `dataLabels.alignTo` allows aligning the connectors so that they all end in the same x position, or align data labels so that they touch the edges of the plot area.
*   `dataLabels.connectorShape` gives the ability to define the shape of the connector. The user can select one of the predefined shapes or create their own algorithm for generating the connector path.
*   `dataLabels.crookDistance` is a helper parameter for connectorShape option.

Installation
------------

No additional file is needed - new functionalities are implemented in `highcharts.js` file

Specific description of new options
-----------------------------------

### dataLabels.alignTo

Alignment method for data labels. Possible values are:

*   `connectors`: each label touches the nearest vertical edge of the plot area.
*   `plotEdges`: the ends of the connectors have the same x position and the widest label of each half (left & right) touches the nearest vertical edge of the plot area.

**Demo with connectors**


    dataLabels: {
        alignTo: 'connectors'
    }


<iframe style="width: 100%; height: 450px; border: none;" src=https://www.highcharts.com/samples/embed/highcharts/plotoptions/pie-datalabels-alignto-connectors allow="fullscreen"></iframe>

**Demo with plotEdges**


    dataLabels: {
        alignTo: 'plotEdges'
    }


<iframe style="width: 100%; height: 450px; border: none;" src=https://www.highcharts.com/samples/embed/highcharts/plotoptions/pie-datalabels-alignto-plotedges allow="fullscreen"></iframe>

### dataLabels.connectorShape

Specifies the method that is used to generate the connector path. Highcharts provides 3 built-in connector shapes (for aesthetic purposes `alignTo` is set to `plotEdges` for all below examples):

**fixedOffset (default):**


    dataLabels: {
        connectorShape: 'fixedOffset'
    }


<iframe width="100%" height="550" style="null" src=https://www.highcharts.com/samples/embed/highcharts/coloraxis/coloraxis-with-pie allow="fullscreen"></iframe>

**straight:**


    dataLabels: {
        connectorShape: 'straight',
        crookDistance: '70%'
    }


**crookedLine**

This option can be used with the `crookDistance` parameter. It defines how far from the vertical plot edge the connector path should be crooked. Using `crookedLine` makes the most sense (in most cases) when `alignTo` is set.


    dataLabels: {
        connectorShape: 'crookedLine',
        crookDistance: '70%'
    }


<iframe style="width: 100%; height: 450px; border: none;" src=https://www.highcharts.com/samples/embed/highcharts/plotoptions/pie-datalabels-crookdistance allow="fullscreen"></iframe>

Users can provide their own method by passing a callback function instead of a String. Three arguments are passed to the callback:

1.  **An object** that holds the label’s coordinates (`x` & `y` properties) and how the label is located in relation to the pie (`alignment` property). `alignment` can by one of the following: `left` (pie on the left side of the data label), `right` (pie on the right side of the data label) or `center` (data label overlaps the pie).
2.  **An object** that holds the connector’s position. Its `touchingSliceAt` property holds the position of where the connector touches the slice.
3.  **Data label options**: the function has to return an SVG path definition in array form.

```js
connectorShape: function(labelPosition, connectorPosition, options) {
  var connectorPadding = options.connectorPadding,
    touchingSliceAt = connectorPosition.touchingSliceAt,
    series = this.series,
    plotWidth = series.chart.plotWidth,
    plotLeft = series.chart.plotLeft,
    alignment = labelPosition.alignment,
    stepDistance = 150, // in px - distance between the step and vertical border of the plot area
    stepX = alignment === 'left' ? plotLeft + plotWidth - stepDistance : plotLeft + stepDistance;

  return ['M',
    labelPosition.x + (alignment === 'left' ? 1 : -1) *
    connectorPadding,
    labelPosition.y,
    'L',
    stepX,
    labelPosition.y,
    'L',
    stepX,
    touchingSliceAt.y,
    'L',
    touchingSliceAt.x,
    touchingSliceAt.y
  ];
}
```

<iframe style="width: 100%; height: 450px; border: none;" src=https://www.highcharts.com/samples/embed/highcharts/plotoptions/pie-datalabels-connectorshape-function allow="fullscreen"></iframe>

API documents
-------------

Here are the API documents for more information

*   [plotOptions.pie.dataLabels.connectorShape](https://api.highcharts.com/highcharts/plotOptions.pie.dataLabels.connectorShape)
*   [plotOptions.pie.dataLabels.alignTo](https://api.highcharts.com/highcharts/plotOptions.pie.dataLabels.alignTo)
*   [plotOptions.pie.dataLabels.crookDistance](https://api.highcharts.com/highcharts/plotOptions.pie.dataLabels.crookDistance)
