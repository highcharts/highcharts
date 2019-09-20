Grouping tasks in a hierarchy
===

Split bigger tasks up in subtasks or group resources together if they belong to the same parent task. Use the [`parent`](https://api.highcharts.com/gantt/series.gantt.data.parent) property of a data point (i.e. the sub task) which value points to the [`id`](https://api.highcharts.com/highcharts/series.area.data.id) of the parent task. The duration of the parent task will then span all sub tasks.

_Example of defining subtasks and grouping them with one parent task._

<iframe src="https://jsfiddle.net/r0c7Lksu/embedded/result,js/?username=gvaartjes" id="JSFEMB_18012" width="100%" height="400" frameborder="0" sandbox="allow-modals allow-forms allow-scripts allow-same-origin allow-popups allow-top-navigation-by-user-activation" allow="camera *; encrypted-media *;" allow="fullscreen"></iframe>

Gantt charts have a vertical axis of type [`treegrid`](https://api.highcharts.com/gantt/yAxis.type) by default. Notice in the above example how that results automatically in collapsable subtasks. Set the parent task's data point with [`collapsed: true`](https://api.highcharts.com/gantt/series.gantt.data.collapsed) to render the task collapsed from the start.

Group tasks vertically
----------------------

For grouping tasks in a Gantt chart on horizontal tracks, use a vertical [`category`](https://api.highcharts.com/highcharts/xAxis.categories) axis. This type of Gantt chart is often used to visualize resource allocation or availability schedules.

Code example for setting a category axis

    
    yAxis: {
        categories: ['Resource 1', 'Resource 2', 'Resource 3']   
      } 

_See example below for grouping tasks vertically in horizontal tracks_

<iframe src="https://jsfiddle.net/ku37ctxv/embedded/result,js/?username=gvaartjes" id="JSFEMB_18012" width="100%" height="400" frameborder="0" sandbox="allow-modals allow-forms allow-scripts allow-same-origin allow-popups allow-top-navigation-by-user-activation" allow="camera *; encrypted-media *;" allow="fullscreen"></iframe>
