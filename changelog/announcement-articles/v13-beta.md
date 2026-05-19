# Announcing Highcharts v13 Beta

_Disclaimer: This is a draft document - v13 Beta is not yet released._

Highcharts v13 is now available as a public beta, and we would love for you to
try it before the final release lands in early June.

This release is about making charts easier to configure, easier to brand and
harder to make look accidental. Some of the changes are big architectural
pieces, like the new `palette` option, DataTable-based chart data and
experimental autoloading of modules. Others are design and UX improvements that
make everyday charts feel more polished: better gauges, more readable data
labels, smarter datetime labels and smoother visual details throughout.

The beta is the right time to test your existing charts, try the new APIs and
tell us where the edges still feel sharp. The sections below walk through the
highlights and link to the relevant docs and live demos.

The beta release is available on npm:
* Either do `npm install highcharts@beta`
* Or to load the script bundles directly, use jsdelivr:
  * `https://cdn.jsdelivr.net/npm/highcharts@beta/highcharts.js`
  * `https://cdn.jsdelivr.net/npm/highcharts@beta/modules/stock.js`
  * `https://cdn.jsdelivr.net/npm/highcharts@beta/modules/accessibility.js`
  * etc...

## Palette

Highcharts v13 introduces a new `palette` option: a small but important shift in how chart styling is organized. Instead of treating colors as a collection of separate settings scattered across series, labels, backgrounds and UI states, v13 gives you a central color system for the chart.

The palette defines the data colors, plus separate light and dark mode values for the chart background, neutral colors and highlight colors. Highcharts then exposes these as CSS variables and uses them throughout the default design. In practice, this makes branding easier, dark mode cleaner and large chart libraries less repetitive to maintain.

```js
Highcharts.setOptions({
    palette: {
        colors: [
            '#e32412',
            '#fadb8b',
            '#2364b9',
            '#059649'
        ],
        light: {
            backgroundColor: '#f6f5f4',
            highlightColor: '#e32412'
        },
        dark: {
            backgroundColor: '#1b1918',
            highlightColor: '#fadb8b'
        }
    }
});
```

The `colors` array is still where your main series and point colors live, but now it belongs to a wider theme layer. You can define one shared set, then override individual colors for light or dark mode with `palette.light.colors` and `palette.dark.colors`. The `colorScheme` option can be set to `'light'`, `'dark'`, `'light dark'` or `'inherit'`, so charts can follow system preference, inherit from the page, or be pinned to a specific mode.

A nice side effect is that chart-specific styling can now refer back to the palette instead of duplicating color values:

```js
title: {
    style: {
        color: 'var(--highcharts-neutral-color-60)'
    }
}
```

For teams managing dashboards, this is the kind of change that looks modest in
one chart and very welcome in chart number 200. Designers get a clearer
contract, developers get fewer one-off color overrides, and users get charts
that adapt more naturally to light and dark environments.

The new palette layer replaces the former Adaptive theme.

Relevant links:

- [Palette options](https://github.com/highcharts/highcharts/blob/trettan/ts/Core/Color/PaletteDefaults.ts)
- [Branding Highcharts](https://github.com/highcharts/highcharts/blob/trettan/docs/chart-design-and-style/branding.md)
- [Palette options demo](https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/trettan/samples/highcharts/palette/general)
- [Color scheme
  demo](https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/trettan/samples/highcharts/palette/colorscheme)

## DataTable

Highcharts v13 makes tabular data a first-class way to feed charts. Until now,
most charts were configured with `series.data`: convenient for small examples, but less
ideal when your real source is a database table, CSV, API response, or shared
dashboard dataset.

The new `dataTable`, `series.dataTable` and `series.dataMapping` options let you keep the data in columns, then map those columns into chart points.

```js
const dataTable = new Highcharts.DataTable({
    columns: {
        Year: [2020, 2021, 2022, 2023],
        Cost: [11, 13, 12, 14],
        Revenue: [12, 15, 14, 18]
    }
});

Highcharts.chart('container', {
    dataTable,

    plotOptions: {
        series: {
            dataMapping: {
                x: 'Year'
            }
        }
    },

    series: [{
        dataMapping: {
            y: 'Cost'
        }
    }, {
        dataMapping: {
            y: 'Revenue'
        }
    }]
});
```

That small example shows the big idea: one table, multiple series, no repeated arrays. Common mappings, like the x column, can live in `plotOptions.series`, while each series only declares the column that makes it unique.

You can also attach a table directly to a series with `series.dataTable`, pass
either a `Highcharts.DataTable` instance or a configuration object, and use
typed arrays for heavier datasets. If your columns are already named `x`, `y`,
`name` and so on, Highcharts can map them automatically. If not, `dataMapping`
gives you the translator.

For high-volume charts, there is a performance angle too. When used with the Boost module, configuring data through a DataTable with TypedArray columns is about 20% faster than using regular `series.data` in a 500k point chart. Tiny syntax change, very real payoff when dashboards start moving serious amounts of data.

This makes Highcharts fit better into modern data pipelines. Less reshaping, less duplicated data, and cleaner sharing between Charts, Stock, Maps, Gantt and Grid. And when the table changes, the chart can follow the table, which is a much nicer mental model for live dashboards.

Relevant links:

- [Using DataTables with Series](https://github.com/highcharts/highcharts/blob/trettan/docs/working-with-data/using-datatables-in-series.md)
- [Chart-level `dataTable`](https://github.com/highcharts/highcharts/blob/370ef95f78341e0eedaed694b3bd184da7b3d49f/ts/Core/Options.ts#L323-L356)
- [Series-level `dataTable`](https://github.com/highcharts/highcharts/blob/370ef95f78341e0eedaed694b3bd184da7b3d49f/ts/Core/Series/SeriesOptions.ts#L688-L709)
- [`series.dataMapping`](https://github.com/highcharts/highcharts/blob/370ef95f78341e0eedaed694b3bd184da7b3d49f/ts/Core/Series/SeriesOptions.ts#L614-L678)
- [Single chart-level DataTable demo](https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/trettan/samples/highcharts/datatable/chart-datatable-single/)
- [Series-level DataTable demo](https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/trettan/samples/highcharts/datatable/series-datatable/)

## Autoload

Highcharts v13 introduces an experimental autoload feature for cases where the
chart configuration knows more than the implementation does. Instead of manually
remembering to load `highcharts-more.js` for a bubble chart, `modules/exporting`
for exporting, or the right indicator module for a Stock chart, the new
`highcharts-autoload.js` bundle can inspect the chart options and load the
required modules before the chart is created.

That is especially useful when chart options are assembled dynamically: from a
CMS, a chart editor, a saved dashboard configuration, or, yes, even an LLM that
cheerfully suggests a bubble chart without also remembering the module import.
The loader is the patient friend in the room, checking the config and fetching
the missing pieces.

With the ESM build, the setup can look like this:

```js
const { default: Highcharts } = await import(
    'https://code.highcharts.com/esm/highcharts-autoload.js'
);

await Highcharts.chart('container', {
    chart: {
        type: 'bubble'
    },
    exporting: {
        enabled: true
    },
    accessibility: {
        enabled: true
    },
    series: [{
        data: [
            [1, 2, 10],
            [2, 3, 15],
            [3, 1, 8]
        ]
    }]
});
```

In this example, the configuration points to features that normally require
extra files. Autoload resolves those dependencies asynchronously, then creates
the chart. For styled mode and Stock Tools, the loader can also add the required
CSS files in the classic script setup.

Autoload is not meant to replace deliberate bundling in every production app.
If you know exactly which modules your product uses, a regular build still gives
you full control. But for dynamic chart generation, demos, prototypes and
config-driven products, it removes one of the classic sources of "why is this
series type missing?" confusion.

Relevant links:

- [Highcharts Loader API](https://github.com/highcharts/highcharts/blob/370ef95f78341e0eedaed694b3bd184da7b3d49f/ts/Extensions/Autoload/Loader.ts#L151-L181)
- [Installation docs: Autoload modules](https://github.com/highcharts/highcharts/blob/trettan/docs/getting-started/installation.md#autoload-modules)
- [ESM installation docs: Autoload](https://github.com/highcharts/highcharts/blob/trettan/docs/getting-started/installation-with-esm.md#dynamic-imports-from-cdn)
- [UMD autoload demo](https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/trettan/samples/highcharts/global/autoload/)
- [ESM autoload demo](https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/trettan/samples/highcharts/global/autoload-esm/)

## Gorgeous Gauges

Gauges have had a proper glow-up in Highcharts v13. The `gauge` and
`solidgauge` series, together with panes and radial y-axes, now come with more
sensible defaults and a major design facelift. The goal is simple: make a
minimal gauge look good before you start polishing it.

Previously, creating a modern gauge often meant knowing a small bag of tricks:
where to place the pane, how wide the arc should be, how to shape the dial.
In v13, more of that work is handled by the defaults. Panes
fit the plot area more intelligently, gauge labels are positioned with the
circular layout in mind, pane backgrounds use a cleaner arc shape, and the
default dial and pivot look simpler and much closer to what you would actually ship.

That means a useful gauge can start very small:

```js
Highcharts.chart('container', {
    chart: {
        type: 'gauge'
    },
    yAxis: {
        min: 0,
        max: 100
    },
    series: [{
        name: 'Score',
        data: [68]
    }]
});
```

From there, implementers can layer on the parts that carry business meaning:
plot bands for ranges, `pane.innerSize` for a ring layout,
`pane.borderRadius` for rounded arc ends, or a `solidgauge` series for KPI and
progress-style displays.

```js
Highcharts.chart('container', {
    chart: {
        type: 'solidgauge'
    },
    pane: {
        startAngle: -90,
        endAngle: 90,
        innerSize: '60%'
    },
    yAxis: {
        min: 0,
        max: 100,
        stops: [
            [0.1, '#DF5353'],
            [0.5, '#DDDF0D'],
            [0.9, '#55BF3B']
        ]
    },
    series: [{
        name: 'Fuel',
        data: [64]
    }]
});
```

This is also a quiet win for AI-generated charts. Gauges are visually sensitive:
a small configuration mistake can make them look dated, cramped, or just a bit
odd. Better defaults mean chart generators can produce something presentable
from shorter prompts and smaller option objects, while developers still have the
full control surface when they want a custom dashboard instrument.

The best place to see the new range is the Gauge inspiration demo, which shows
twelve separate gauge designs: default gauges, rounded panes, thin rings,
semicircles, solid gauges, concentric KPI rings, threshold gauges, and a custom
dial path. It is basically a mood board, but with runnable chart options.

Relevant links:

- [Gauge inspiration demo](https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/trettan/samples/highcharts/demo/gauge-inspiration)
- [Pane options](https://github.com/highcharts/highcharts/blob/trettan/ts/Extensions/Pane/PaneOptions.ts)
- [Gauge options](https://github.com/highcharts/highcharts/blob/370ef95f78341e0eedaed694b3bd184da7b3d49f/ts/Series/Gauge/GaugeSeries.ts#L115-L435)
- [Solid gauge options](https://github.com/highcharts/highcharts/blob/trettan/ts/Series/SolidGauge/SolidGaugeSeriesOptions.d.ts)

## Boundaries on Datetime Axes

Datetime axes are getting better at saying where you are in time. Highcharts
has long had internal "higher ranks" logic for labels, especially visible in
Highcharts Stock, where an axis showing months might switch to a year label
when the ticks cross into January. In v13, that idea becomes fully configurable
and is extended across time units.

The new boundary formatting lets you define one format for regular ticks and
another for ticks that mark a larger time boundary. For example, a Stock chart
with monthly ticks can show normal labels as `Jan`, `Feb`, `Mar`, while the
first tick of a new year can use a stronger `2026` label.

```js
Highcharts.stockChart('container', {
    xAxis: {
        dateTimeLabelFormats: {
            month: {
                main: '%b'
            },
            year: {
                boundary: '<b>%Y</b>'
            }
        }
    },
    series: [{
        data
    }]
});
```

The same concept works at smaller resolutions too. A chart with minute ticks can
highlight hour boundaries; hourly ticks can highlight day boundaries; daily or
weekly ticks can highlight month boundaries; monthly ticks can highlight year
boundaries. It is still the same helpful "new section starts here" behavior,
but now it is explicit chart configuration rather than a hidden heuristic.

There is also a templating route. Axis labels now get a `boundary` value in
their formatting context, so you can branch directly in `labels.format`:

```js
xAxis: {
    labels: {
        format: `{#if (eq boundary "month")}
            {value:%b <b>%Y</b>}
        {else}
            {value:%e %b}
        {/if}`
    }
}
```

Relevant links:

- [Highcharts boundary labels demo](https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/trettan/samples/highcharts/xaxis/labels-boundary/)
- [Boundary labels with `labels.format`](https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/trettan/samples/highcharts/xaxis/labels-boundary-format/)
- [Highcharts Stock boundary labels demo](https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/trettan/samples/stock/xaxis/labels-boundary/)

## Data Labels Contrast Background

Data labels are only useful if people can read them. Highcharts has long helped
with this by letting `dataLabels.style.color` default to `contrast`, and by
using a contrasting text outline. In v13, there is a calmer alternative:
`dataLabels.backgroundColor` can now be set to `contrast`.

That gives each label a plain, semi-transparent background chosen to contrast
with the label text. The chart remains visible underneath, but the text gets a
stable reading surface. It is especially handy for stacked columns, pies, maps
and other charts where labels sit on top of mixed or changing colors.

```js
Highcharts.chart('container', {
    chart: {
        type: 'column'
    },
    plotOptions: {
        column: {
            stacking: 'normal',
            dataLabels: {
                enabled: true,
                inside: true,
                backgroundColor: 'contrast',
                style: {
                    textOutline: 'none'
                }
            }
        }
    },
    series: [{
        data: [29.9, 71.5, 106.4]
    }, {
        data: [135.6, 148.5, 216.4]
    }]
});
```

The contrast background does not replace text outlines entirely. It gives
implementers another tool: outlines are compact and work well on busy charts,
while a contrast background often feels softer and more dashboard-friendly. You
can use either, or combine them when the chart really needs belt and braces.

The related `dataLabels.distance` option has also been generalized so it applies
to more series types than before. That makes it easier to nudge labels away from
their points, or pull them inward with a negative distance, without reaching for
series-specific workarounds.

```js
plotOptions: {
    pie: {
        dataLabels: {
            backgroundColor: 'contrast',
            distance: '-30%',
            style: {
                textOutline: 'none'
            }
        }
    }
}
```

Small feature, big day-to-day payoff: readable labels with less fiddling.

Relevant links:

- [Contrast background in stacked columns](https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/trettan/samples/highcharts/plotoptions/series-datalabels-background-contrast/)
- [Contrast background in pie](https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/trettan/samples/highcharts/series-pie/datalabels-background-contrast/)
- [Data label background strategies
  demo](https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/trettan/samples/highcharts/plotoptions/series-datalabels-background-options/)

## Other Design and UX Improvements

A few smaller changes in v13 are the kind users may not name, but they will feel. Motion is smoother, legends are clearer, and chart surfaces have a little more polish out of the box.

* **Improved animation on added or removed points**. Points now fade in and out from the correct position in the coordinate system, regardless of whether they are added through `addPoint`, removed through `removePoint`, or updated through other data flows. The result is a smoother impression in dynamic charts, especially column-like series.

* **Improved legend symbols**. Legend symbols now better reflect the actual styling of their series. This makes legends more useful as visual keys, not just labels with decorative marks.

* **Rounded corners for the plot area**. The new rounded plot area option gives
  cartesian charts, maps and other rectangular visualizations a softer frame.
  Elements inside the plot area, including axes, plot bands and grid lines, are
  clipped to match the rounding. Enable it by setting `chart.plotBorderRadius`.

* **Treegrid facelift for Gantt**. The Gantt treegrid has been brought closer to the rest of the grid-axis styling, with updated default colors and a cleaner visual fit.
