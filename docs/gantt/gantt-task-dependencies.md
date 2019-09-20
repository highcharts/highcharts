Dependencies between tasks
===

Visualizing the work breakdown structure of a project involves also describing the dependencies between tasks. They indicate when a task should start or end. Highcharts Gantt uses the [`dependency`](https://api.highcharts.com/gantt/series.gantt.data.dependency) property on the data point for determining relations between dependant tasks and draws arrows between them. Note that the [`dependency`](https://api.highcharts.com/gantt/series.gantt.data.dependency) property also takes an `Array<String|Object>` in case of multiple dependencies.

_Code example of defining dependencies_

<iframe src="https://jsfiddle.net/q4p2zhm0/embedded/result,js/?username=gvaartjes" id="JSFEMB_18012" width="100%" height="400" frameborder="0" sandbox="allow-modals allow-forms allow-scripts allow-same-origin allow-popups allow-top-navigation-by-user-activation" allow="camera *; encrypted-media *;" allow="fullscreen"></iframe>

Customize dependency connectors
-------------------------------

The default for drawing dependencies between tasks in Highcharts Gantt is with arrows. The connectors are customizable through the object specified for the [`pathfinder`](https://api.highcharts.com/gantt/pathfinder) property. Configure here for example other type of start- or end markers instead of arrows, change the line color or the dash pattern of the connector. How the connector path is drawn from task to task is determined by algorithm specified for the [`pathfinder.type`](https://api.highcharts.com/gantt/pathfinder.type) option. The default algorithm of Highcharts Gantt, is `simpleConnect`, which finds a path between tasks using right angles only. Other available algorithms are _straight_ and _fastAvoid_. It is possible to define custom algorithms by adding them to the `Highcharts.Pathfinder.prototype.algorithms` object after the chart has been created.

The pathfinder property is also available on data series, see [`series.pathfinder`](https://api.highcharts.com/gantt/series.gantt.pathfinder). This allows for specifying custom connectors per data series.

_See code example for configuring dependencies_

<iframe src="https://jsfiddle.net/t4h8L1xr/embedded/result,js/?username=gvaartjes" id="JSFEMB_18012" width="100%" height="400" frameborder="0" sandbox="allow-modals allow-forms allow-scripts allow-same-origin allow-popups allow-top-navigation-by-user-activation" allow="camera *; encrypted-media *;" allow="fullscreen"></iframe>

A single dependency is composed by setting the [`dependency`](https://api.highcharts.com/gantt/series.gantt.data.dependency) property on a data point (task) to an object. This object has defined pathfinder options allowing for configuration of a singular dependency

_See example below, where the color and endmarker are defined on the successor task_

<iframe src="https://jsfiddle.net/kvp67ec2/embedded/result,js/?username=gvaartjes" id="JSFEMB_18012" width="100%" height="400" frameborder="0" sandbox="allow-modals allow-forms allow-scripts allow-same-origin allow-popups allow-top-navigation-by-user-activation" allow="camera *; encrypted-media *;" allow="fullscreen"></iframe>
