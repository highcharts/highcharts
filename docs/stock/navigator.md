Navigator
================

The navigator is a small chart below the main chart area, displaying a view of the entire dataset. Its built-in functionality allows zooming in and out on the dataset as well as panning across it. By default, navigator is connected with the scrollbar, but both of them can be enabled and disabled separately. The default series type for navigator is `areaspline`, but that can be easily changed via [`navigator.series.type`](https://api.highcharts.com/highstock/navigator.series.type).

![navigator.png](navigator.png)

Navigator, just like any other chart, apart from the series datasets, contains [`xAxis`](https://api.highcharts.com/highstock/navigator.xAxis) and [`yAxis`](https://api.highcharts.com/highstock/navigator.yAxis). Therefore all of the Axis options apply to the navigator as well.
```js
navigator: {
    xAxis: {...},
    yAxis: {...}
}
```

The navigator is enabled by default for the first series in all Highcharts Stock charts. To configure which series are shown in the navigator, use the [`series.showInNavigator`](https://api.highcharts.com/highstock/plotOptions.series.showInNavigator) option.

<iframe style="width: 100%; height: 600px; border: none;" src=https://www.highcharts.com/samples/embed/stock/navigator/show-in-navigator-interactive allow="fullscreen"></iframe>

```js
series: {
    showInNavigator: true
}
```

To configure the options for the navigator series, you can set per-series options on [`series.navigatorOptions`](https://api.highcharts.com/highstock/plotOptions.series.navigatorOptions) and options for all navigator series on [`navigator.series`](https://api.highcharts.com/highstock/navigator.series).

Each part of the navigator, like handles, masks, navigator axes, outline, etc. can be individually styled and modified.

<iframe style="width: 100%; height: 660px; border: none;" src=https://www.highcharts.com/samples/embed/stock/navigator/styling-interactive allow="fullscreen"></iframe>

```js
navigator: {
    maskInside: false,
    maskFill: "rgba(102,133,194,0.3)"
}
```

Inverted charts allow users to display the navigator on the [opposite](https://api.highcharts.com/highstock/navigator.opposite) side of the chart.

```js
navigator: {
    opposite: true
}
```

For more information on navigator options see the [API reference](https://api.highcharts.com/highstock/navigator).

Navigator also comes as a [Standalone navigator](https://www.highcharts.com/docs/stock/standalone-navigator) component to help with synchronizing multiple charts.