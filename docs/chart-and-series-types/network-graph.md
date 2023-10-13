Network graph
===

Network graph (force directed graph) is a mathematical structure (graph) to show relations between points in an aesthetically-pleasing way. The graph visualizes how subjects are interconnected with each other. Entities are displayed as nodes and the relationship between them are displayed with lines. The graph is force directed by assigning a weight (force) from the node edges and the other interconnected nodes get assigned a weighted factor. The graph simulates the weight as forces in a physical system, where the forces have impact on the nodes and find the best position on the chart’s plotting area. The Network Graph has various use case such as display relations between people, roads, companies, and products.

Getting started
---------------

Add `modules/networkgraph.js` after you have included Highcharts.

_Example of loading both files in a webpage_

```html
<script src="https://code.highcharts.com/highcharts.js"></script>
<script src="https://code.highcharts.com/modules/networkgraph.js"></script> 
```

Data format
-----------

The Network Graph needs a data format that builds up an array of links, where each link is specified by a `start` and an `end` node.

```js
series: [{
    data: [
        {from: 'A', to: 'B'},
        {from: 'A', to: 'C'},
        {from: 'A', to: 'D'},
        {from: 'A', to: 'E'},
        {from: 'A', to: 'F'},
        {from: 'A', to: 'G'},

        {from: 'B', to: 'C'},
        ...
    ]
}]
```
    

_See simple Network Graph demo_

<iframe style="width: 100%; height: 515px; border: none;" src=https://www.highcharts.com/samples/embed/highcharts/series-networkgraph/initial-positions allow="fullscreen"></iframe>

> _See a Network Graph with a more complex data structure. Notice: You don't have to specify the `from:` and `to:` property for each point when you define the `keys:` option for `plotOptions.networkgraph.keys`_

<iframe style="width: 100%; height: 860px; border: none;" src=https://www.highcharts.com/samples/embed/highcharts/demo/network-graph allow="fullscreen"></iframe>

Algorithm options
-----------------

Forces and the algorithm are configured using `series.layoutAlgorithm` options:

*   **attractiveForce** `series.layoutAlgorithm.attractiveForce` - function that returns the force between two connected nodes.
*   **enableSimulation** `series.layoutAlgorithm.enableSimulation` - enables/disables simulation.
*   **friction** `series.layoutAlgorithm.friction` - friction to show smooth animation of nodes translations.
*   **gravitationalConstant** `series.layoutAlgorithm.gravitationalConstant` - constant for barycenter forces applied on nodes.
*   **maxIterations** `series.layoutAlgorithm.maxIterations` - max number of iterations that algorithm will be running.
*   **initialPositions** `series.layoutAlgorithm.initialPositions` - algorithm for initial placement of nodes (can be one of predefined or a custom function).
*   **repulsiveForce** `series.layoutAlgorithm.repulsiveForce` - function that returns the force between two nodes.
*   **type** `series.layoutAlgorithm.type` - only `reingold-fruchterman` available at this moment.

Since version 7.1 additional configuration options are available:

*   **approximation** - when rendering a huge number of nodes, recommended to approximate repulsive forces to decrease complexity from O(N^2) to O(N log N).
*   **theta** - used in Barnes-Hut approximation to determine when the force on nodes should be approximated or calculated directly.
*   **integration** - forces integration type. Changes how force is applied on nodes changing the animation too. Note that different integrations have different default `attractiveForce` and `repulsiveForce` options.
*   **maxSpeed** - max speed that node can have in one iteration, preventing small and disconnected nodes to run too fast. Verlet integration only

_See the demo below, for a network graph with custom algorithm options applied_

<iframe style="width: 100%; height: 515px; border: none;" src=https://www.highcharts.com/samples/embed/highcharts/series-networkgraph/forces allow="fullscreen"></iframe>

Link configuration options
--------------------------

*   **link** `series.link` - style options for links/connections (`link.width`, `link.color` and `link.dashStyle`).
*   **draggable** `series.draggable` - enables/disables drag&drop for nodes.

Node Configuration Options
--------------------------

Nodes are generated automatically from `series.data` connections. Nodes are instances of [Highcharts.Point](https://api.highcharts.com/class-reference/Highcharts.Point) and are available from the `series.nodes` array.

In addition to auto-generated properties, custom properties such as `color` or `colorIndex` can be set by adding an array, `series.nodes`, to the series options and linking nodes by `id`. For example: [data-option](https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/highcharts/series-networkgraph/data-options/)

Datalabels Options
------------------

Since v7.1 dataLabels are available for both, nodes and links, list of new options:

*   **linkFormat** `dataLabels.linkFormat` - format for the dataLabels on links (string).
*   **linkFormatter** `dataLabels.linkFormatter` - formatter for the dataLabels on links (function).
*   **linkTextPath** `dataLabels.linkTextPath` - options for the dataLabels on link if text should be rendered along the link.
*   **textPath** `dataLabels.textPath` - options for the dataLabels on node if text should be rendered around the node.

Use Cases
---------

### Use Case 1

Simple example

```js
{
    chart: {
        type: 'networkgraph'
    },
    series: [{
        data: [
            ['A', 'B'],
            ['B', 'C'],
            ['C', 'A']
        ]
    }]
}
```

Customized length between points and colored links:

```js
{
    chart: {
        type: 'networkgraph'
    },
    plotOptions: {
        networkgraph: {
            layoutAlgorithm: {
                linkLength: 50 // in pixels
            },
            link: {
                color: 'red'
            }
        }
    },
    series: [{
        data: [
            ['A', 'B'],
            ['B', 'C'],
            ['C', 'A']
        ]
    }]
}
```

_See the demo below for a network graph with customized styled links per data series._

<iframe style="width: 100%; height: 515px; border: none;" src=https://www.highcharts.com/samples/embed/highcharts/series-networkgraph/styled-links allow="fullscreen"></iframe>

### Use Case 2

Comparison of both integrations, Euler and Verlet:

<iframe style="width: 100%; height: 515px; border: none;" src=https://www.highcharts.com/samples/embed/highcharts/series-networkgraph/integration-comparison allow="fullscreen"></iframe>

### Use Case 3

dataLabels around the nodes:

<iframe style="width: 100%; height: 565px; border: none;" src=https://www.highcharts.com/samples/embed/highcharts/series-networkgraph/textpath-datalabels allow="fullscreen"></iframe>

### Use Case 4

dataLabels on links:

<iframe style="width: 100%; height: 565px; border: none;" src=https://www.highcharts.com/samples/embed/highcharts/series-networkgraph/link-datalabels allow="fullscreen"></iframe>
