Organization chart
===

An organization chart (org chart) is a diagram that portrays the structure of an organization and the relationships and relative ranks of its parts and positions.

<iframe style="width: 100%; height: 700px; border: none;" src=https://www.highcharts.com/samples/embed/highcharts/demo/organization-chart allow="fullscreen"></iframe>

Options structure
-----------------

In Highcharts, the organization chart resembles the sankey chart in the way it is built `around nodes and links`. The nodes of an org chart are the positions or persons, while the links are the lines showing the relations between them. The `data` structure of the options defines the links.

In the `nodes` array of the series, each node is identified by an `id` referring to the id in the link. Additional properties like `title`, `description` and `image` may be set in the individual node options.

Data labels
-----------

Each person or position is represented by a card or label. This card is actually the node's data label, and is subject to the [dataLabel options](https://api.highcharts.com/highcharts/plotOptions.organization.dataLabels) of the series. In org charts, the dataLabel's `useHTML` option is set to true by default, because we want to leverage layout capabilities that are more complicated to achieve using SVG alone.

The actual HTML rendered inside the chart is determined by `dataLabels.nodeFormat` or `dataLabels.nodeFormatter`. The default `nodeFormatter` output depends on whether there is an `image` setting on the node, and produces a layout based on flex boxes in order to get positioning and alignment right. See the [example of overriding the nodeFormatter](https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/highcharts/series-organization/datalabels-nodeformatter/).

Levels
------

In an org chart typically, we may want to define specific styling for all nodes on a specific level, for example having all C-level positions in the same color. For this, we can use the [[levels option](https://api.highcharts.com/highcharts/plotOptions.organization.levels) and set the properties there. An example can be seen in the main demo above.

API options
-----------

For the full set of available options, [see the API](https://api.highcharts.com/highcharts/series.organization).
