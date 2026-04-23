Angular gauges
==============

Angular gauges — also known as dial or speedometer charts — are a popular choice for dashboards because they instantly convey a single value within a range. Highcharts implements gauges as a dedicated series type built on the same series, points, and axis model as the rest of the library, so everything you already know about dynamic updates, events, and formatting applies here too.

This tutorial walks through building a gauge from scratch, then progressively adds the features most commonly needed in real-world applications.

A bare-bones gauge
-----------------

The minimum viable gauge sets `chart.type` to `'gauge'` and provides one data point. Gauges have no x-axis — the y-axis carries the value and is rendered as a circular arc.

```js
Highcharts.chart('container', {
    chart: {
        type: 'gauge'
    },
    series: [{
        name: 'Speed',
        data: [80]
    }]
});
```

That is enough to render a working gauge using all defaults. From here, every subsequent section refines a specific aspect of the chart.

Configuring the value axis
--------------------------

Without explicit `min` and `max` on the `yAxis`, Highcharts infers the range from the data, which is rarely what you want for a gauge. Set the extremes explicitly so the visual range reflects the instrument's full scale:

```js
yAxis: {
    min: 0,
    max: 200
}
```

### Plot bands as target zones

Most real-world gauges communicate context, not just a raw value. Plot bands
divide the arc into color-coded zones — for example green for safe, yellow for caution,
red for danger — giving readers an immediate visual reference without needing to
read the tick labels:

```js
yAxis: {
    min: 0,
    max: 200,
    plotBands: [{
        from: 0,
        to: 120,
        color: '#55BF3B' // green
    }, {
        from: 120,
        to: 160,
        color: '#DDDF0D' // yellow
    }, {
        from: 160,
        to: 200,
        color: '#DF5353' // red
    }]
}
```

The result is a simple and functional gauge:

<iframe style="width: 100%; height: 470px; border: none;" src="https://www.highcharts.com/samples/embed/highcharts/series-gauge/simple-gauge" allow="fullscreen"></iframe>

The layout of the pane
----------------------

The `pane` object controls the circular canvas shared by all gauges and polar charts in the same chart. The key sizing properties are:

*   **[`size`](https://api.highcharts.com/highcharts/pane.size)** — Diameter of the pane as a percentage of the smaller plot
    dimension, or a fixed pixel value. Defaults to `undefined`, which means a
    best fit inside the plot area considering the geometry of the pane and labels.

*   **[`innerSize`](https://api.highcharts.com/highcharts/pane.innerSize)** — Creates a hollow center, turning the gauge into a ring or donut shape. Accepts a pixel value or a percentage of the pane size.
*   **[`center`](https://api.highcharts.com/highcharts/pane.center)** — `[x, y]` position of the pane center. Defaults to
    `undefined`, meaning the best fit.

```js
pane: {
    size: '80%',
    innerSize: '60%',
    center: ['50%', '50%']
}
```

By default, a `background` consisting of a circular shape is drawn behind the arc. You can replace or extend the `pane.background` array with any number of circular layers, each accepting `outerRadius`, `innerRadius`, `backgroundColor`, `borderWidth`, and `shape` options.

### Start and end angle

A full-circle gauge sweeps from 0° to 360°. The more common half-circle speedometer layout uses:

```js
pane: {
    startAngle: -90,
    endAngle: 90
}
```

Angles are measured clockwise from the top (12 o'clock = 0°). A compact
three-quarter arc — popular for dashboard KPIs — uses `-135` to `135`. For a
small adjustment indicator you might use `-30` to `30`. The Highcharts default
are `-120` to `120`.

Placing ticks and grid lines
----------------------------

Tick marks and grid lines on the `yAxis` help readers estimate values between labeled positions. Several options are available:

*   **[`tickPixelInterval`](https://api.highcharts.com/highcharts/yAxis.tickPixelInterval)** — Approximate pixel spacing between major ticks; Highcharts picks a round increment that fits. Use this instead of a fixed [`tickAmount`](https://api.highcharts.com/highcharts/yAxis.tickAmount) when you want the labels to land on clean numbers.
*   **[`minorTicks`](https://api.highcharts.com/highcharts/yAxis.minorTicks)** — Set to `true` to add minor tick marks between major ticks.
*   **[`tickPosition`](https://api.highcharts.com/highcharts/yAxis.tickPosition)**
    — `'inside'` (default for radial axes) places ticks inside the arc; `'outside'` places them
    outside.
*   **[`gridLineWidth`](https://api.highcharts.com/highcharts/yAxis.gridLineWidth)** and **[`gridLineColor`](https://api.highcharts.com/highcharts/yAxis.gridLineColor)** — The radial grid lines that
    cross the pane arc. On a gauge with colored plot bands, setting `gridLineWidth: 2`
    with `gridLineColor` matching the background color creates visual dividers
    inside the pane:

<iframe style="width: 100%; height: 600px; border: none;" src="https://www.highcharts.com/samples/embed/highcharts/yaxis/radial-gridline" allow="fullscreen"></iframe>


For a cleaner arc-only look, disable ticks and grid lines altogether:

```js
yAxis: {
    tickWidth: 0,
    minorTicks: false,
    gridLineWidth: 0
}
```

Configuring the dial and pivot
------------------------------

The needle of a `gauge` series is called the **dial**. Its center point is called the **pivot**. Both are configured under `plotOptions.gauge` (or directly on the series). The full set of options is documented in the API:

*   [plotOptions.gauge.dial](https://api.highcharts.com/highcharts/plotOptions.gauge.dial) — controls the shape, size, and color of the needle, including `radius`, `baseWidth`, `topWidth`, `baseLength`, `rearLength`, and fill/stroke styling.
*   [plotOptions.gauge.pivot](https://api.highcharts.com/highcharts/plotOptions.gauge.pivot) — controls the center circle, including `radius`, `backgroundColor`, `borderColor`, and `borderWidth`.

For a completely custom shape, [`dial.path`](https://api.highcharts.com/highcharts/plotOptions.gauge.dial.path) accepts an SVG path command array, letting you design any needle geometry.

Here is an example with a wide, short dial and a prominent pivot with the data
label rendered inside it:

<iframe style="width: 100%; height: 400px; border: none;" src="https://www.highcharts.com/samples/embed/highcharts/plotoptions/gauge-pivot" allow="fullscreen"></iframe>

A gauge can also have multiple pivots, either as separate series or as points
within the same series. Check out our [clock gauge](https://www.highcharts.com/demo/gauge-clock) for a demonstration.

Solid gauges
------------

The `solidgauge` series type replaces the needle with a solid arc that grows from the minimum angle toward the current value — similar to a progress bar bent into a circle. It is well-suited for KPI displays and percentage-based metrics.

```js
chart: {
    type: 'solidgauge'
}
```

Because there is no needle, a visible `innerSize` on the `pane` is almost always set so the arc has a clear track to fill:

```js
pane: {
    startAngle: -90,
    endAngle: 90,
    innerSize: '60%'
}
```

### Color mapping with minColor, maxColor, and stops

The solid gauge inherits color-by-value from the color axis API. The simplest approach is to define two endpoint colors and let Highcharts interpolate the arc color linearly as the value moves from `min` to `max`:

```js
yAxis: {
    min: 0,
    max: 200,
    minColor: '#55BF3B',  // color at min value
    maxColor: '#DF5353'   // color at max value
}
```

For finer control — for example to match the green/yellow/red zones of the regular gauge — use `yAxis.stops`, an array of `[position, color]` pairs where the position is a fraction between 0 and 1:

```js
yAxis: {
    min: 0,
    max: 200,
    stops: [
        [0.1, '#55BF3B'],  // green up to ~20
        [0.5, '#DDDF0D'],  // yellow around midpoint
        [0.9, '#DF5353']   // red at the high end
    ]
}
```

The `stops` property takes precedence over `minColor`/`maxColor` when both are set.

<iframe style="width: 100%; height: 470px; border: none;" src="https://www.highcharts.com/samples/embed/highcharts/demo/gauge-solid" allow="fullscreen"></iframe>


### Overriding size per point — the activity gauge

When multiple `solidgauge` points share a single pane, a concentric ring layout requires each ring to occupy a different radial band. Rather than using multiple panes, you can set `radius` and `innerRadius` on the individual data points, which takes precedence over the pane-level `innerSize`:

```js
series: [{
    name: 'Conversion',
    data: [{
        y: 80,
        radius: '100%',
        innerRadius: '78%'
    }]
}, {
    name: 'Engagement',
    data: [{
        y: 65,
        radius: '77%',
        innerRadius: '55%'
    }]
}, {
    name: 'Retention',
    data: [{
        y: 50,
        radius: '54%',
        innerRadius: '32%'
    }]
}]
```

The pane `background` array can provide matching track rings for the unfilled portion:

<iframe style="width: 100%; height: 500px; border: none;" src="https://www.highcharts.com/samples/embed/highcharts/demo/gauge-multiple-kpi" allow="fullscreen"></iframe>

### Combining solid gauges with a regular gauge

A regular `gauge` series and a `solidgauge` series can share the same chart and the same `pane`, creating a layout where a dial needle overlays an arc fill. The solid gauge typically uses a ring-style pane while the regular gauge dial extends to the outer edge:

```js
yAxis: {
    min: 0,
    max: 100,
    stops: [
        [0.3, '#55BF3B'],
        [0.7, '#DDDF0D'],
        [0.9, '#DF5353']
    ]
},

series: [{
    type: 'solidgauge',
    name: 'Target',
    data: [60],
    dataLabels: {
        // Avoid collision with the gauge pivot
        enabled: false
    }
}, {
    type: 'gauge',
    name: 'Current',
    data: [70]
}]
```
View the [live demo](https://www.highcharts.com/samples/highcharts/series-gauge/solidgauge-combo).

API and examples
---------------
For more options and examples see the [pane API
reference](https://api.highcharts.com/highcharts/pane), the [gauge API
reference](https://api.highcharts.com/highcharts/plotOptions.gauge) and the
[solidgauge API
reference](https://api.highcharts.com/highcharts/plotOptions.solidgauge).

Worth checking out:
*   [Speedometer with dual axes](https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/highcharts/demo/gauge-dual)
*   [Simple gauge with rounded plot bands](https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/highcharts/xaxis/plotbands-gauge-borderradius)
