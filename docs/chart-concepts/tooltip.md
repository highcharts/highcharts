Tooltip
=======

The tooltip appears when hovering over a point in a series. By default the tooltip shows the values of the point and the name of the series. For the full set of options available for the tooltip, see [the API reference](https://api.highcharts.com/highcharts/tooltip).

![tooltip.png](tooltip.png)

Appearance
----------

 The following code example shows the most common appearance options for tooltip:

```javascript
tooltip: {
    backgroundColor: '#FCFFC5',
    borderColor: 'black',
    borderRadius: 10,
    borderWidth: 3
}
```

The background color can also be set to a gradient, see [an example](https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/main/samples/highcharts/tooltip/backgroundcolor-gradient/). Text properties can be set using the [style](https://api.highcharts.com/highcharts/tooltip.style) option.

Alternatively, the tooltip can be styled with CSS by enabling [styled mode](https://www.highcharts.com/docs/chart-design-and-style/style-by-css):

```css
.highcharts-tooltip-box {
    fill: #FCFFC5;
    stroke: black;
    stroke-width: 3;
}
```

**Note:** Since the tooltip content is rendered as SVG by default, you have to specify SVG properties such as `fill` and `stroke` in CSS.

Tooltip formatting
------------------

The tooltip's content is rendered from a subset of HTML that can be altered in a number of ways, all in all giving the implementer full control over the content. In addition to options on the [tooltip](https://api.highcharts.com/highcharts/tooltip) configuration object, you can set the options for how each series should be represented in the tooltip by [series.tooltip](https://api.highcharts.com/highcharts/plotOptions.series.tooltip). 

*   The header part of the tooltip can be altered using the [tooltip.headerFormat](https://api.highcharts.com/highcharts/tooltip.headerFormat). In a shared tooltip, the first series' headerFormat is used.
*   The listing of each series is given in the [tooltip.pointFormat](https://api.highcharts.com/highcharts/tooltip.pointFormat) option, or an individual pointFormat for each series. 
*   The footer part can be set in the [tooltip.footerFormat](https://api.highcharts.com/highcharts/tooltip.footerFormat) option.
*   All the options above can be overridden by the [tooltip.formatter](https://api.highcharts.com/highcharts/tooltip.formatter) callback for programmatic control.

By default the tooltip only allows a subset of HTML because the HTML is parsed and rendered using SVG. By setting the [useHTML](https://api.highcharts.com/highcharts/tooltip.useHTML) option to true, the renderer switches to full HTML, which allows for instance table layouts or images inside the tooltip.

```js
tooltip: {
    formatter: function() {
        return 'The value for <b>' + this.x + '</b> is <b>' + this.y + '</b>, in series '+ this.series.name;
    }
}
```

For more info about formatting see [Labels and string formatting](https://www.highcharts.com/docs/chart-concepts/labels-and-string-formatting)

Crosshairs
----------

Crosshairs display a line connecting the points with their corresponding axis. Crosshairs are disabled by default in Highcharts, but enabled by default in Highcharts Stock. See the full set of options for [crosshairs](https://api.highcharts.com/highcharts/xAxis.crosshair).

![crosshairs.png](crosshairs.png)

Crosshairs can be enabled for the x-axis, y-axis or both:

```js
// Enable for x-axis
xAxis: {
    crosshair: true
}

// Enable for y-axis
yAxis: {
    crosshair: true
}
```
