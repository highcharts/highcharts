Gantt task configuration
===

The bars in the Gantt chart are showing the full duration of a task which are calculated from the [`start`](https://api.highcharts.com/gantt/series.gantt.data.start) and [`end`](https://api.highcharts.com/gantt/series.gantt.data.end) data point properties.

Milestone
---------

Turn a task into a Milestone when completion of the task is critical, before the progress on other tasks can continue. In a way, this will schedule the project in intervals and allows for checking the health of a project at a glance.

Set the [`milestone`](https://api.highcharts.com/gantt/series.gantt.data.milestone) property to `true` for turning a task into a milestone.

_See milestone example below, one of the data points in the series has the milestone property set to true_

<iframe src="https://jsfiddle.net/fu3q8e4c/embedded/result,js/" id="JSFEMB_18012" width="100%" height="400" frameborder="0" sandbox="allow-modals allow-forms allow-scripts allow-same-origin allow-popups allow-top-navigation-by-user-activation" allow="camera *; encrypted-media *;" allow="fullscreen"></iframe>

Progress bar
------------

Use a progress bar to get a quick overview of the percent complete of a task. Turn a regular task into a progress bar by setting the [`completed`](https://api.highcharts.com/gantt/series.gantt.data.completed) property on the [`series.data`](https://api.highcharts.com/gantt/series.gantt.data) point. This property takes an object with the options `fill` and `amount` for setting the contrast color  and the amount percentage completed. The [`completed`](https://api.highcharts.com/gantt/series.gantt.data.completed) property can also be set directly with a decimal value between 0 and 1. Then it sets the `amount` property and applies the `fill` color by selecting a natural contrast color automatically.

_See example below, for demonstrating progress bars_

<iframe style="width: 100%; height: 549px;" src=https://www.highcharts.com/samples/embed/gantt/demo/progress-indicator allow="fullscreen"></iframe>
