Variable radius pie
===

A variable pie chart is a circular chart divided into sectors which are proportional to the quantity or volume they represent. As an addition to the standard pie chart, which requires only one parameter, the variable pie series uses two parameter Y and Z, where Y represents the slice’s volume, and Z represents the slice’s radius.

_For more detailed samples and documentation check the [API.](https://api.highcharts.com/highcharts/plotOptions.variablepie)_

<iframe style="width: 100%; height: 532px; border: none;" src=https://www.highcharts.com/samples/embed/highcharts/demo/variable-radius-pie allow="fullscreen"></iframe>

Click [here](https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/highcharts/demo/variable-radius-pie/) to check the code.

How to create a variable-radius-pie series
------------------------------------------

The variable radius pie series type requires the following module [modules/variablepie.js](https://code.highcharts.com/modules/variable-pie.js).

Here are the steps to create a variable radius pie chart:

1. set the series type to `variablepie`:

```js
chart: {
    type: 'variablepie'
}
```
    

2. Use Y and Z options in the series to display the volume and the radius for each slice:

```js
series: [{
    minPointSize: 100,
    innerSize: '20%',
    data: [{
        y: 505370,
        z: 1
    }, {
        y: 551500,
        z: 2
    }, {
        y: 312685,
        z: 1
    }, {
        y: 78867,
        z: 3
    }, {
        y: 301340,
        z: 4
    }, {
        y: 41277,
        z: 5
    }, {
        y: 357022,
        z: 5
    }]
}]
```

Variable pie series specific options
------------------------------------

*   **zMin**:The minimum possible Z value used for calculating point's radius. If the point's Z value is smaller than zMin, the slice will be drawn according to the zMin value. zMin improves user experience by allowing the visualization of slices with very small Z values.
*   **zMax**: The maximum possible z value used for calculating the point's radius. If the point's Z value is bigger than zMax, the slice will be drawn according to the zMax value. zMax improves user experience by avoiding a huge slice misproportion.
*   **minPointSize**: This option sets the minimum size of any points' radius with a value closes to zero. This option works similar to [minPointLength](https://api.highcharts.com/highcharts/plotOptions.column.minPointLength) in column charts.
*   **maxPointSize**: The maximum size of the points' radius. The radius of a pie slice cannot be bigger than maxPointSize
*   **sizeBy**: This option is related to how the Z value is represented in a pie slice. The pie slice's value can be represented by the area or the radius of the slice. The default, area, corresponds best to the human perception of the size of each pie slice.
