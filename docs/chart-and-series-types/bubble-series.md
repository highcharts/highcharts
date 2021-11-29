Bubble series
=============

A bubble series renders bubbles, which radius are proportional to a `z` value, on given `x` and `y` positions. It is an extended form of a [scatter series](https://www.highcharts.com/docs/chart-and-series-types/scatter-chart).

<iframe style="width: 100%; height: 480px; border: none;" src="https://www.highcharts.com/samples/embed/highcharts/demo/bubble" allow="fullscreen"></iframe>

Bubble series features
----------------------

Like the scatter series, the bubble series also accepts data points with `x` and `y` values. But in addition, it accepts the third dimension, `z`, that dictates the size of the bubble. There are two modes for how the size is calculated. When [sizeBy](https://api.highcharts.com/highcharts/series.bubble.sizeBy) is `area`, the `z` value is proportional to the area, and when set to `width`, it is proportional to the diameter.

<iframe style="width: 100%; height: 480px; border: none;" src="https://www.highcharts.com/samples/embed/highcharts/plotoptions/bubble-sizeby" allow="fullscreen"></iframe>


Bubble sizes
------------

The actual size of the bubbles is also controlled by other options:
* The [minSize](https://api.highcharts.com/highcharts/series.bubble.minSize) and [maxSize](https://api.highcharts.com/highcharts/series.bubble.minSize) options determine the size span of the rendered bubbles. They can be set as percentages (of the chart area) or as absolute pixel values.
* The [zMin](https://api.highcharts.com/highcharts/series.bubble.zMin) and [zMax](https://api.highcharts.com/highcharts/series.bubble.zMax) options determine how the sizes should be computed relative to the actual z value.
* The [sizeByAbsoluteValue](https://api.highcharts.com/highcharts/series.bubble.sizeByAbsoluteValue) determine how the size should handle crossing of the [zThreshold](https://api.highcharts.com/highcharts/series.bubble.zThreshold), usually the zero plane.

Bubble Legend
-------------
Bubble series supports a special type of representation in the legend through the [bubble legend](https://www.highcharts.com/docs/chart-concepts/bubble-legend) module.

Symbols and shapes
------------------
In addition to the default circle shape that has given name to the bubble series, other symbols can also be used. The symbols can be predefined shapes, or images loaded by a URL.

<iframe style="width: 100%; height: 480px; border: none;" src="https://www.highcharts.com/samples/embed/highcharts/plotoptions/bubble-symbol" allow="fullscreen"></iframe>

Color axis
----------
While the bubble series by default renders three dimensional data through the `x`, `y` and `z` options, it is also add a fourth dimension through a custom color key. The default color key for the bubble series is `z`, but that can be changed to for example `colorValue`. In that case, a series configuration may look like this:

```js
series: [{
    colorKey: 'colorValue',
    data: [{
        x: 0,
        y: 81,
        z: 63,
        colorValue: 4
    }, {
        x: 98,
        y: 5,
        z: 89,
        colorValue: 32
    }, {
        x: 51,
        y: 50,
        z: 73,
        colorValue: 9
    }]
}]
```

In the following example, a color axis is added and the `x` value is used for color key.

<iframe style="width: 100%; height: 480px; border: none;" src="https://www.highcharts.com/samples/embed/highcharts/coloraxis/changed-default-color-key" allow="fullscreen"></iframe>

API Reference
-------------
For an overview of the bubble series options see the [API reference](https://api.highcharts.com/highcharts/plotOptions.bubble).

