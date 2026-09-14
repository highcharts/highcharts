Sankey diagram
===

A Sankey diagram is a type of flow diagram, in which the width of the link between two nodes is shown proportionally to the flow quantity.

_For more detailed samples and documentation check the [API.](https://api.highcharts.com/highcharts/plotOptions.sankey)_

<iframe style="width: 100%; height: 485px; border: none;" src="https://www.highcharts.com/samples/embed/highcharts/demo/sankey-diagram" allow="fullscreen"></iframe>

Data structure
--------------

A Sankey diagram consists of two types of data. The nodes are the boxes that the items or other measures flow between. The links are the bands visualizing the flow itself. In Highcharts, only the values of the links need to be defined; the nodes will be generated dynamically. Each link has three parameters `from`, `to` and `weight`.


    keys: ['from', 'to', 'weight'],
    data: [
             ['Oil', 'Transportation', 94],
             ['Natural Gas', 'Transportation', 3],
             ['Coal', 'Transportation', 0],
             ['Renewable', 'Transportation', 0],
             ['Nuclear', 'Transportation', 3],

             ['Oil', 'Industrial', 41],
             ['Natural Gas', 'Industrial', 40],
             ['Coal', 'Industrial', 7],
             ['Renewable', 'Industrial', 11],
             ['Nuclear', 'Industrial', 0],

             ['Oil', 'Residential & Commercial', 17],
             ['Natural Gas', 'Residential & Commercial', 76],
             ['Coal', 'Residential & Commercial', 1],
             ['Renewable', 'Residential & Commercial', 7],
             ['Nuclear', 'Residential & Commercial', 0],

             ['Oil', 'Electric Power', 1],
             ['Natural Gas', 'Electric Power', 18],
             ['Coal', 'Electric Power', 48],
             ['Renewable', 'Electric Power', 11],
             ['Nuclear', 'Electric Power', 22]
    ],


Nodes
-----

The nodes are generated so that the total weight going in or out of a node is visualized. Nodes are instances of [Point](https://api.highcharts.com/class-reference/Highcharts.Point) and are available from the `series.nodes` array. The width of the nodes can be set with the `nodeWidth` option, and padding between them with `nodePadding`.

In addition to auto-generated properties, custom properties such as `color` or `colorIndex` can be set by adding an array, [nodes](https://api.highcharts.com/highcharts/series.sankey.nodes), to the series options and linking the nodes by id; the following jsfiddle [demo](https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/highcharts/plotoptions/sankey-inverted/) illustrates this concept.

Circular dependencies
---------------------

Links may flow back to an earlier node, forming a cycle. A link that closes a cycle is drawn as a band wrapping around the diagram, running in a lane along the top or the bottom of the plot area. Each such link gets a lane of its own, so two of them never overlap, and they are shared out between the two sides to keep the diagram balanced. A link where `from` and `to` refer to the same node is drawn as a loop around that node instead.

When a cycle contains more than one link, the link that closes it during traversal is the one drawn as the wrapping band, which for a simple cycle is the one appearing last in the data. The order of the data therefore decides which flow reads as the "return" flow. The turn radius of the wrapping bands follows the [curveFactor](https://api.highcharts.com/highcharts/series.sankey.curveFactor) option; a self-link turns on the node width instead, so its loop keeps a hole to place the label in.

<iframe style="width: 100%; height: 485px; border: none;" src="https://www.highcharts.com/samples/embed/highcharts/series-sankey/circular-dependencies" allow="fullscreen"></iframe>
