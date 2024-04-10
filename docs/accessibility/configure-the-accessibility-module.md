Advanced accessibility configuration
===

The Accessibility module is highly configurable. While the goal of the module is to provide the most accessible charts possible out of the box, it can sometimes be advantageous or necessary to make changes to the configuration.

The most important configuration for the module is the text description. Read more about [configuring the chart description](https://www.highcharts.com/docs/accessibility/accessibility-module#describing-your-chart) here. 


Configuration of screen reader behavior
---------------------------------------

Any text exposed to a screen reader in Highcharts can be configured. The most common configurations are outlined below, but for a complete overview, please refer to the [Accessibility API options](https://api.highcharts.com/highcharts/accessibility) and the [Accessibility language options](https://api.highcharts.com/highcharts/lang.accessibility). Note that several individual chart elements also have configurable accessibility options, including [series](https://api.highcharts.com/highcharts/series.line.accessibility), [legend](https://api.highcharts.com/highcharts/legend.accessibility), and the chart [exporting menu](https://api.highcharts.com/highcharts/exporting.accessibility).

To configure the information text that is exposed to screen readers before the chart, refer to the [`accessibility.screenReaderSection.beforeChartFormat`](https://api.highcharts.com/highcharts/accessibility.screenReaderSection.beforeChartFormat) option. The format string is used to generate basic HTML with the information text. If more detailed control is required, the [`accessibility.screenReaderSection.beforeChartFormatter`](https://api.highcharts.com/highcharts/accessibility.screenReaderSection.beforeChartFormatter) option allows for specifying a function to return the HTML string, receiving the chart as an argument.

To configure what screen readers read out for individual data points, see the [`accessibility.point.valueDescriptionFormat`](https://api.highcharts.com/highcharts/accessibility.point.valueDescriptionFormat) option. Example:

```js
Highcharts.chart('container', {
    accessibility: {
        point: {
            valueDescriptionFormat: '{index}. {point.name}, {point.y}.'
        }
    },
    // ...
});
```

If more detailed control is required, the [`accessibility.point.descriptionFormatter`](https://api.highcharts.com/highcharts/accessibility.point.descriptionFormatter) option allows for specifying a function to return the entire description of the point, receiving the point as an argument.

Options are also available for specifying value prefixes and suffixes. Example:

```js
Highcharts.chart('container', {
    accessibility: {
        point: {
            valueSuffix: '%'
        }
    },
    // ...
});
```

Note that you can also provide additional text descriptions for individual points and series using [`point.accessibility.description`](https://api.highcharts.com/highcharts/series.line.data.accessibility.description) and [`series.accessibility.description`](https://api.highcharts.com/highcharts/series.line.accessibility.description). This description is by default added to the existing description of the point/series, and can be useful to highlight points of interest.

*Compatibility note:* Some of the options above, such as `valueDescriptionFormat`, were not available until Highcharts v8.0.0. Prior versions should use `accessibility.pointDescriptionFormatter` and `accessibility.seriesDescriptionFormatter` functions, corresponding to the current `accessibility.point.descriptionFormatter` and `accessibility.series.descriptionFormatter` options.


Large data series
-----------------

Be aware that for charts with a large number of data points, individual data points are not by default exposed to screen reader users. This can be configured with the [`accessibility.series.pointDescriptionEnabledThreshold`](https://api.highcharts.com/highcharts/accessibility.series.pointDescriptionEnabledThreshold) option. It is possible to set a similar [threshold for keyboard navigation](https://api.highcharts.com/highcharts/accessibility.keyboardNavigation.seriesNavigation.pointNavigationEnabledThreshold), but this is disabled by default.

It is also always possible to expose a data series as a group only - without exposing the individual data points - by using the [`series.accessibility.exposeAsGroupOnly`](https://api.highcharts.com/highcharts/series.line.accessibility.exposeAsGroupOnly) option.

For large data series, [sonification](https://www.highcharts.com/docs/sonification/getting-started) can be a great tool for making trends and patterns more accessible to screen reader users.

Axis configuration
------------------

Highcharts will by default describe a chart's axes and their ranges to screen reader users. The axes will by default be described by their titles, but this title can be overridden by setting the [`axis.accessibility.description`](https://api.highcharts.com/highcharts/xAxis.accessibility.description) option. The overall description format can be set in the various axis `lang.accessibility` options, see for example [`lang.accessibility.axis.xAxisDescriptionSingular`](https://api.highcharts.com/highcharts/lang.accessibility.axis.xAxisDescriptionSingular).

The range description for an axis can be overridden by setting the [`axis.accessibility.rangeDescription`](https://api.highcharts.com/highcharts/xAxis.accessibility.rangeDescription) option.


See [demos using the Accessibility module](https://www.highcharts.com/demo#accessible-charts).
