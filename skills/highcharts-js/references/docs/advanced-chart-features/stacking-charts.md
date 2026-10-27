---
description: >-
  Understand how normal and percent stacking arrange series data, and compare
  examples with the overlap mode for waterfall charts and the stream stacking
  mode used by streamgraph charts.
---

Stacking charts
===============

Column and area type series can be set to stack on top of each other instead of overlapping. Most of the series support two available options, `"normal"` stacking and `"percentage"` stacking. Normal stacking stacks the data series on top of each other in order. Percent stacking fills the plot area and draws each point of data with a relative percentage to all the points in the same category.

Two series supports additional types of stacking:
- `"overlap"` in waterfall, allowing negative and positive values to overlap each other
- `"stream"` in streamgraph, where stacking is displaced around the central x axis

Here is an example of `"normal"` stacking:

[Live demo](https://www.highcharts.com/samples/embed/highcharts/demo/area-stacked)

Here is an example of `"percent"` stacking:

[Live demo](https://www.highcharts.com/samples/embed/highcharts/demo/area-stacked-percent)

Here is an example of `"overlap"` stacking in waterfall:

[Live demo](https://www.highcharts.com/samples/embed/highcharts/plotoptions/series-waterfall-with-overlap-stacking)

Here is an example of `"stream"` stacking in streamgraph:

[Live demo](https://www.highcharts.com/samples/embed/highcharts/demo/streamgraph)
