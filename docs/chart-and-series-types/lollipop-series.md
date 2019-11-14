Lollipop chart
===

A lollipop plot is basically a bar plot, but with `line` and a `dot` instead of a bar. It shows the relationship between a category and a value. On the Y axis, the value is represented by the `center of a dot` - not by the top/bottom edge (or right/left for inverted chart) what is commonly mistaken.

Using the Lollipop series is useful when you have several bars of the same height, especially when the values are ~90% of range - it avoids the Moiré effect and the chart is not such visually aggressive.

Getting started
---------------

Lollipop series requires loading the Highcharts and all `highcharts-more`, `dumbbell.js` and `lollipop.js` modules.

Here is an example for loading lollipop modules into a webpage:

```html
<script src="https://code.highcharts.com/highcharts.js"></script>
<script src="https://code.highcharts.com/highcharts-more.js"></script>
<script src="https://code.highcharts.com/modules/dumbbell.js"></script>
<script src="https://code.highcharts.com/modules/lollipop.js"></script>
```

_The demo below represents a simple lollipop plot_

<iframe width="100%" height="470" style="null" src=https://www.highcharts.com/samples/embed/highcharts/demo/lollipop allow="fullscreen"></iframe>

Vertical lollipop chart
-----------------------

To display a vertical lollipops, set `chart.inverted` to `true`.

<iframe style="width: 100%; height: 450px; border: none;" src=https://www.highcharts.com/samples/embed/highcharts/series-lollipop/inverted-lollipop allow="fullscreen"></iframe>

Configuring options
-------------------

The dot can be customized as every other marker in Highcharts, among the others:
*   **fillColor** `series.marker.fillColor` - color for the dot.
*   **radius** `series.marker.radius` - size of the dot.

The connector line can be customized by:
*   **connectorColor** `series.connectorColor` - color for the connector line.
*   **connectorWidth** `series.connectorWidth` - width of the connector line.