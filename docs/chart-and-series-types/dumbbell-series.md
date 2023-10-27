Dumbbell chart
===

A dumbbell plot can be used to visualize two different values in time, or to show the difference between two different groups or viewpoints (e.g., one dot for male and another dot for female).

The dumbbell is a variant of the [lollipop plot](https://www.highcharts.com/docs/chart-and-series-types/lollipop-series).

Getting started
---------------

Dumbbell series requires loading the Highcharts and both `highcharts-more`
and `dumbbell.js` modules.

Here is an example for loading dumbbell modules into a webpage:

```html
<script src="https://code.highcharts.com/highcharts.js"></script>
<script src="https://code.highcharts.com/highcharts-more.js"></script>
<script src="https://code.highcharts.com/modules/dumbbell.js"></script>
```

_The demo below represents a change in life expectancy between 1960 and 2018._
<iframe width="100%" height="600" style="null" src=https://www.highcharts.com/samples/embed/highcharts/demo/dumbbell allow="fullscreen"></iframe>

Configuring options
-------------------

The dot can be customized by:
*   **fillColor** `series.marker.fillColor` - color for the upper dot.
*   **lowColor** `series.lowColor` - color for the lower dot.
*   **radius** `series.marker.radius` - size of the dots.

The connector line can be customized by:
*   **connectorColor** `series.connectorColor` - color for the connector line.
*   **connectorWidth** `series.connectorWidth` - width of the connector line.