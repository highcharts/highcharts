# Ajax loaded data, clickable points
The most efficient way to add data to a chart is by using the [Highcharts data module](https://www.highcharts.com/docs/working-with-data/data-module), as all the heavy and time-consuming parsing process is taking care of by the data module. 

#### Tip
Use the [click event feature](http://api.highcharts.com/highcharts/series%3Cline%3E.point.events.click) to handle a click event, in this case; the event is to show display more information on a window.
Another nice feature it the [shared tooltip](http://api.highcharts.com/highcharts/tooltip.shared), which allows visualizing the points of both series on the same tooltip.