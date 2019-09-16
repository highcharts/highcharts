Gantt axis grid
===

Both vertical and horizontal axis of a Gantt Chart are rendered with the [`Axis.grid`](https://api.highcharts.com/gantt/xAxis.grid) option enabled by default, which turns axis ticks into table cells.

Horizontal axis
---------------

The default settings for Gantt renders a dual [`datetime`](https://api.highcharts.com/gantt/xAxis.type) horizontal axis on the top of the chart. The [`tickInterval`](https://api.highcharts.com/gantt/xAxis.tickInterval) for the bottom horizontal axis is automatically determined, by the distribution of the series data points and available screen size. Respectively, the top axis is then assigned a higher date time interval. E.g. days-week, weeks-months, months-years. This logic is helpful when displaying Gantt charts on different devices. Highcharts Gantt automatically adapts and finds the right distribution of axis ticks based upon the screen size available.

_Test the automatic date interval logic of the horizontal axis in the below example, by dragging the navigators handlebars._

<iframe width="320" height="840" style="width: 100%; height:549px" src="https://www.highcharts.com/samples/embed/gantt/demo/with-navigation"></iframe>

If the min and maximum width of the chart is set, there is more control over the number of ticks displayed in the Gantt chart. This would allow for further customization of the [`labels`](https://api.highcharts.com/gantt/xAxis.labels) and [`tickInterval`](https://api.highcharts.com/gantt/xAxis.tickInterval) properties on axis.

_See example below for setting tickIntervals per Axis grid._

    
    xAxis: [{
        labels: {
          format: '{value:%w}' // day of the week
        },
        grid: { // default setting
          enabled: true 
        }
        tickInterval: 1000 * 60 * 60 * 24, // Day
      }, {
        labels: {
          format: '{value:%W}'
        },
        tickInterval: 1000 * 60 * 60 * 24 * 7 // week
      }], 

_See live code example for setting tickInterval per Axis grid_

<iframe src="https://jsfiddle.net/acdqskyb/embedded/result,js/?username=gvaartjes" id="JSFEMB_18012" width="100%" height="450" frameborder="0" sandbox="allow-modals allow-forms allow-scripts allow-same-origin allow-popups allow-top-navigation-by-user-activation" allow="camera *; encrypted-media *;"></iframe>

Vertical Axis
-------------

In a Gantt chart it is common to display a table on the left side of the chart to display task information, like task name, assignee and duration. Creating the table along the vertical axis, needs a `category` [`axis.type`](https://api.highcharts.com/gantt/yAxis.type). The tasks will be lined up and mapped to the table after setting the [`point.y`](https://api.highcharts.com/gantt/series.gantt.data.y) value for each data point (task).

_Example of defining a table along the vertical axis with Axis.grid option_

<iframe src="https://jsfiddle.net/4g7ekw65/embedded/result,js/?username=gvaartjes" id="JSFEMB_18012" width="100%" height="450" frameborder="0" sandbox="allow-modals allow-forms allow-scripts allow-same-origin allow-popups allow-top-navigation-by-user-activation" allow="camera *; encrypted-media *;"></iframe>
