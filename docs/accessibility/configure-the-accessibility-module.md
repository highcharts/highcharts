Configuring the accessibility module
===

The Accessibility module is highly configurable. While the goal of the module is to provide the most accessible charts possible out of the box, it can sometimes be advantageous to make changes to the configuration.

The most important setting for the module is the [`accessibility.description`](https://api.highcharts.com/highcharts/accessibility.description) option. This option sets a description of the chart and makes it available to screen reader users. Providing a good description of the chart can save screen reader users a lot of time. It is however generally recommended to make this description available to all users if possible, e.g. in text around the chart. This can help make it clear to all users what the chart is meant to convey.

It is also sometimes advantageous to configure the text that is picked up by screen readers for individual data points or series. These can be configured with [`accessibility.pointDescriptionFormatter`](https://api.highcharts.com/highcharts/accessibility.pointDescriptionFormatter) and [`accessibility.seriesDescriptionFormatter`](https://api.highcharts.com/highcharts/accessibility.seriesDescriptionFormatter). Note that you can also provide additional text descriptions for points and series using [`point.accessibility.description`](https://api.highcharts.com/highcharts/series.line.data.accessibility.description) and [`series.accessibility.description`](https://api.highcharts.com/highcharts/series.line.accessibility.description). This can be useful to highlight points of interest.

See [accessibility options in the API](https://api.highcharts.com/highcharts/accessibility) for more options. Note that several individual chart elements also have configurable accessibility options, including [series](https://api.highcharts.com/highcharts/series.line.accessibility), [legend](https://api.highcharts.com/highcharts/legend.accessibility), and the chart [exporting menu](https://api.highcharts.com/highcharts/exporting.accessibility). The text that is exposed to screen readers can also be configured and internationalized using the [lang options](https://api.highcharts.com/highcharts/lang.accessibility)

See [demos using the Accessibility module](https://www.highcharts.com/demo#accessible-charts).
