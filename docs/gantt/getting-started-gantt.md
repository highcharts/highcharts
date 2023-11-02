Getting started with Gantt
===

Gantt chart visualizes the work breakdown structure for projects. It illustrates the time intervals of the project tasks and their dependencies. The breakdown of the project is described in tasks which are listed on the vertical axis where the duration of the tasks is offset against the horizontal axis.

Find demos of Gantt charts [here](https://highcharts.com/gantt/demo) to quickly get an overview of Highcharts Gantt’s capabilities.

Get started
-----------

Load Highcharts Gantt as a standalone library when there is no need for other Highcharts dependencies.

_Example of loading Highcharts Gantt into a webpage_

    
    <script src="https://code.highcharts.com/gantt/highcharts-gantt.js"></script> 

Load Highcharts Gantt as a module when a project needs both Highcharts and Gantt loaded at the same time. Place the script tag or import statement after loading the main library, Highcharts or Highcharts Stock.

_Example of loading both libraries in a webpage_

    
    <script src="https://code.highcharts.com/highcharts.js"></script>
    <script src="https://code.highcharts.com/gantt/modules/gantt.js"></script> 

For alternative loading and bundling patterns, for UMD, AMD, CommonJS or ES6 modules, find more information [here](https://github.com/highcharts/highcharts/blob/master/readme.md). Highcharts Gantt follows the same patterns as described for Highcharts.

Constructor
-----------

Run the `ganttChart` constructor for initializing a Gantt chart visualization. The constructor takes two required parameters and a third optional parameter.

    
    Highcharts.ganttChart('container', {
        title: { .. },
        // other configuration options
    }, myCallback); 

1.  `id:` The `id` of the HTML element used for rendering the chart.
2.  `config`: An object with configuration options for defining the Gantt chart.
3.  `callback`: Optional, a callback for getting a handle on the chart, after rendering.

[See also explained here in Gantt API](https://api.highcharts.com/class-reference/Highcharts#.chart/)

Simple example
--------------

_See below the simple live example of a Gantt chart_

<iframe src=https://www.highcharts.com/samples/embed/gantt/gantt/simple-gantt-chart id="JSFEMB_18012" width="100%" height="400" frameborder="0" sandbox="allow-modals allow-forms allow-scripts allow-same-origin allow-popups allow-top-navigation-by-user-activation" allow="camera *; encrypted-media *;" allow="fullscreen"></iframe>