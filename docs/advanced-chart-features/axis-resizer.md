Axis resizer
===

The Resizer module allows the end-user to define which axes can be resized in a multiple-pane Highstock layout. The module allows controlling multiple axes within one config. This feature is very useful, especially when combining multiple technical indicators, where each of them requires a separate axis.

Basic configuration:

    
    yAxis: [{
      height: '50%',
      resize: {
        enabled: true
      }
    }, {
      height: '50%',
      top: '50%'
    }]
    

The configuration above generates a resizer between the first and the second `yAxis`. Now, the end-user can simply resize one `yAxis` to increase its height, and to decrease the second `yAxis`:

![6ozu6lnpu-hguF75ugV5qjjtXqjPAlS2mcO6ddNq78llRGLf0K70OHQYJXWHIlRmMGfJBh8Z_Qm0ZvRkTUkFa4Fk2No0SGScyUXuBA5eW7UWqdynnVCNA2FQiE8_T9OF9Mf4j5tV](https://lh5.googleusercontent.com/6ozu6lnpu-hguF75ugV5qjjtXqjPAlS2mcO6ddNq78llRGLf0K70OHQYJXWHIlRmMGfJBh8Z_Qm0ZvRkTUkFa4Fk2No0SGScyUXuBA5eW7UWqdynnVCNA2FQiE8_T9OF9Mf4j5tV)

<iframe style="width: 100%; height: 416px; border: none;" src=https://www.highcharts.com/samples/embed/stock/demo/candlestick-and-volume allow="fullscreen"></iframe>

Click [here](https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/stock/demo/candlestick-and-volume/) to check the code.

Requirements
------------

To use the axis resizer it is required to include the module `modules/drag-panes.js`, or `js/modules/drag-panes.js` if you are using [**styled** mode](https://highcharts.com/docs/chart-design-and-style/style-by-css).

New options available with this module
--------------------------------------

*   **Axis.maxLength**: Maximal size of a resizable axis. Could be set as a percent of plot area or pixel size.
    
*   **Axis.minLength**: Minimal size of a resizable axis. Could be set as a percent of plot area or pixel size.
    
*   **Axis.resize.enabled**: Enable or disable resize by drag for the axis.
    
*   **Axis.resize.x**: Horizontal offset of the control line.
    
*   **Axis.resize.y**: Vertical offset of the control line.
    
*   **Axis.controlledAxis.next**: Array of axes that should move out of the way of resizing being done for the current axis. By default, the next axis is moved.
    
*   **Axis.controlledAxis.prev**: Array of axes that should move with the current axis while resizing.
    

Styling
-------

In CSS mode, use `highcharts-axis-resizer` class for styling the line. For JS mode, styling is available using the following options:

*   **Axis.resize.cursor**: Cursor style for the control line.
    
*   **Axis.resize.lineWidth**: Width of the control line.
    
*   **Axis.resize.lineDashStyle**: Dash style of the control line.
    
*   **Axis.resize.lineColor**: Color of the control line.
