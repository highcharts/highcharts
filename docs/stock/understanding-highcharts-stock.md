Understanding Highcharts Stock
===

Highcharts Stock is based on Highcharts, meaning it has all the core functionality of Highcharts, plus some additional features.

![understanding_highstock.png](understanding_highstock.png)

Highcharts Stock also supports various financial series types.

<iframe style="width: 100%; height: 550px; border: none;" src=https://highcharts.github.io/highcharts-utils/samples/#gh/352ea24215ec4f79bb50ead0152430087bc3551e/sample/stock/interactive-docs/series-type allow="fullscreen"></iframe>

```js
chart.series[0].update({
    type: 'candlestick'
});
```

See [Update series method](https://api.highcharts.com/class-reference/Highcharts.Series#update) and [series API options](https://api.highcharts.com/highstock/series).

Navigator and scrollbar
---------

Allows you to fine tune the range of the chart which is displayed and scroll through it.

See [Navigator](https://highcharts.com/docs/stock/navigator) for more information.

<iframe style="width: 100%; height: 640px; border: none;" src=https://highcharts.github.io/highcharts-utils/samples/#gh/352ea24215ec4f79bb50ead0152430087bc3551e/sample/stock/interactive-docs/navigator allow="fullscreen"></iframe>

```js
chart.update({
    navigator: {
        enabled: true,
        height: 100
    },
    scrollbar: {
        enabled: false
    }
});
```
Navigator and scrollbar does not have its own update method, use [Chart update](https://api.highcharts.com/class-reference/Highcharts.Chart#update) instead. See [navigator API options](https://api.highcharts.com/highstock/navigator).


Range selector
--------------

Allows you to quickly select a range to be shown on the chart or specify the exact interval to be shown.

<iframe style="width: 100%; height: 600px; border: none;" src=https://highcharts.github.io/highcharts-utils/samples/#gh/352ea24215ec4f79bb50ead0152430087bc3551e/sample/stock/interactive-docs/range-selector allow="fullscreen"></iframe>

See [Range selector](https://highcharts.com/docs/stock/range-selector) for more information.

```js
chart.update({
    rangeSelector: {
        enabled: true,
    }
});
```

Range selector does not have its own update method, use [Chart update](https://api.highcharts.com/class-reference/Highcharts.Chart#update) instead. See [range selector API options](https://api.highcharts.com/highstock/rangeSelector).

Crosshair
---------

Shows a line following the tooltip of a chart to better read results of the axes. This functionality can be found in the [axis API](https://api.highcharts.com/highstock/xAxis.crosshair) options. Crosshairs can also be used in Highcharts, but are not enabled by default.

<iframe style="width: 100%; height: 600px; border: none;" src=https://highcharts.github.io/highcharts-utils/samples/#gh/352ea24215ec4f79bb50ead0152430087bc3551e/sample/stock/interactive-docs/crosshair allow="fullscreen"></iframe>

```js
chart.xAxis[0].update({
    crosshair: {
        snap: false
    }
});
```

Crosshair is an axis property, therefore update it via [Axis update](https://api.highcharts.com/class-reference/Highcharts.Axis#update). See [axis API options](https://api.highcharts.com/highstock/xAxis.crosshair).

Data grouping
---------

Changes granularity of the data depending on the zoom level, data density and user options.

<iframe style="width: 100%; height: 600px; border: none;" src=https://highcharts.github.io/highcharts-utils/samples/#gh/352ea24215ec4f79bb50ead0152430087bc3551e/sample/stock/interactive-docs/range-selector allow="fullscreen"></iframe>

See [Data grouping](https://www.highcharts.com/docs/stock/data-grouping) for more information.

```js
chart.series[0].update({
    dataGrouping: {
        groupAll: true,
    }
});
```

Data grouping is a series property, therefore update it via [Series update](https://api.highcharts.com/class-reference/Highcharts.Series#update). See [data grouping API options](https://api.highcharts.com/highstock/series.line.dataGrouping).
