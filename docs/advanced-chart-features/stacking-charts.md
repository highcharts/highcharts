Stacking charts
===============

Column and area type series can be set to stack on top of each other instead of overlapping. Most of the series support two available options, `"normal"` stacking and `"percentage"` stacking. Normal stacking stacks the data series on top of each other in order. Percent stacking fills the plot area and draws each point of data with a relative percentage to all the points in the same category.

Two series supports additional types of stacking:
- `"overlap"` in waterfall, allowing negative and positive values to overlap each other
- `"stream"` in streamgraph, where stacking is displaced around the central x axis

Here is an example of `"normal"` stacking:

<iframe style="width: 100%; height: 450px; border: none;" src=https://www.highcharts.com/samples/embed/highcharts/demo/area-stacked allow="fullscreen"></iframe>

Here is an example of `"percent"` stacking:

<iframe style="width: 100%; height: 450px; border: none;" src=https://www.highcharts.com/samples/embed/highcharts/demo/area-stacked-percent allow="fullscreen"></iframe>

Here is an example of `"overlap"` stacking in waterfall:

<iframe style="width: 100%; height: 450px; border: none;" src=https://www.highcharts.com/samples/embed/highcharts/plotoptions/series-waterfall-with-overlap-stacking allow="fullscreen"></iframe>

Here is an example of `"stream"` stacking in streamgraph:

<iframe style="width: 100%; height: 450px; border: none;" src=https://www.highcharts.com/samples/embed/highcharts/demo/streamgraph allow="fullscreen"></iframe>


