# Ajax loaded data, clickable points
The most efficient way to add data to a chart is by using the [Highcharts data module](https://www.highcharts.com/docs/working-with-data/data-module),

#### Tip
Use the [click event feature](https://api.highcharts.com/highcharts/series%3Cline%3E.point.events.click) to handle a click event, in this case; the event is to show display more information on a window.
Another nice feature it the [shared tooltip](https://api.highcharts.com/highcharts/tooltip.shared), which allows viewing the points of both series on the same tooltip.