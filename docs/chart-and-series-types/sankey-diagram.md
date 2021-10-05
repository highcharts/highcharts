Sankey diagram
===

A Sankey diagram is a visualization that depicts a flow from one set of data to another. The sets of data are represented as nodes and the flow between them as links. The width of a connecting link between two nodes is proportional to the flow quantity.

_For more detailed samples and documentation, check the [API.](https://api.highcharts.com/highcharts/series.sankey)_

<iframe style="width: 100%; height: 485px; border: none;" src=https://www.highcharts.com/samples/highcharts/css/sankey allow="fullscreen"></iframe>

Links
--------------

A Sankey diagram consists of two types of data: nodes and links. In Highcharts, you define the links in the `data` array of a `series.sankey` object, where each link has three parameters `from`, `to`, and `weight`. In Highcharts, you only need to define the links; the nodes will be generated dynamically. The code below shows how to define the links from the previous demo.

    series: [{
        type: 'sankey',
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
    }]

Nodes
-----

The nodes are generated so that the total weight going in and/or out of a node is visualized. Nodes are instances of [Point](https://api.highcharts.com/class-reference/Highcharts.Point) and are available from the `series.nodes` array. You can adjust the width of the nodes with the `nodeWidth` option, and padding between them with the `nodePadding` option.

In addition to auto-generated properties, custom properties such as `color`, `colorIndex`, and `name` can be set by adding the [nodes](https://api.highcharts.com/highcharts/series.sankey.nodes) array to the `series.sankey` object and linking the nodes by id.

    series: [{
        type: 'sankey',
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
        nodes: [{
            id: 'Oil',
            colorIndex: 0
        }, {
            id: 'Natural Gas',
            colorIndex: 1
        }, {
            id: 'Coal',
            colorIndex: 2
        }, {
            id: 'Renewable',
            colorIndex: 3
        }, {
            id: 'Nuclear',
            colorIndex: 4
        }, {
            id: 'R&C',
            name: 'Residential & Commercial'
        }],
    }]

More examples
-----

This jsfiddle [demo](https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/highcharts/plotoptions/sankey-inverted/) shows how to invert a Sankey diagram.
