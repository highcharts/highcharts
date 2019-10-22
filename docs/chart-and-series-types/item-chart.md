Item Chart
===

An item chart in Highcharts is a series type where the values are represented as individual dots or symbols, so that for example a quantity of ten is represented by ten dots. This is similar to a dot chart, except that in the dot chart, the items are rendered on X and Y axis, while in the item chart, they are laid out sequentially.

The item chart is used for infographics, typically for a low number of individual items within a low number of groups. The most common use case is a parliament, and other use cases may be the distribution of a feature within a group of persons, or percentages represented by a count rather than a scalar value.

<iframe style="width: 100%; height: 760px; border: none;" src=https://www.highcharts.com/samples/embed/highcharts/series-item/dynamic allow="fullscreen"></iframe>

Circular layout
---------------

Item charts can be laid out either as a rectangle or a circle. The circular layout is enabled by setting a [startAngle](https://api.highcharts.com/highcharts/plotOptions.item.startAngle) and an [endAngle](https://api.highcharts.com/highcharts/plotOptions.item.endAngle). To achieve the typical parliament hemisphere, set the `startAngle` to -100 and the `endAngle` to 100. Then, as the default center is in the middle of the plot area and the default size is that the full circle will fill out the plot area, we can adjust the `size` and `center`. These options provide a reasonable fit for the parliament:

    
    // Circular options
    center: ['50%', '88%'],
    size: '170%',
    startAngle: -100,
    endAngle: 100

Also part of the circular layout is the [innerSize](https://api.highcharts.com/highcharts/plotOptions.item.innerSize) and [rows](https://api.highcharts.com/highcharts/plotOptions.item.rows) settings. If the `innerSize` is 0, the circle will be filled with dots, while in the typical parliament view we would like the center of the semi-circle to be clear. So the default `innerSize` is 40%. In some cases we also want to set a fixed number of rows in order to reflect the real-world parliament. In this case we can set the `rows` option, which will take precedence over the `innerSize`.

Rectangular layout
------------------

When the angles are not given, the layout will be rectangular, and the [layout](https://api.highcharts.com/highcharts/plotOptions.item.layout) option can be set either to `horizontal` or `vertical`.

Symbols
-------

When used as an infographic, we would typically use custom symbols to denote the type of data, for example a count of men vs women. This is done in the [marker](https://api.highcharts.com/highcharts/plotOptions.item.marker.symbol) options. See the [live demo at jsFiddle](https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/highcharts/series-item/symbols).

API options
-----------

For the full set of available options, see the [API](https://api.highcharts.com/highcharts/plotOptions.item).
