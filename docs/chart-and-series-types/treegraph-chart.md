Treegraph chart
===
A Tree graph is a way of visualizing a [tree](https://www.highcharts.com/docs/chart-concepts/dataviz-glossary#tree-data-structure) or hierarchy data structure. The best examples of a tree data structure are:

* genealogy trees
* directories in computer science
* decision trees

Our tree representation is an oriented rooted tree. This means that the direction of the connections matter, and there is one node in each set of data that does not have a parent (is the root of the tree). In contrast to treemap and sunburst, this series type does not require the `value` property, because each point position is based solely on its relation to other nodes in the tree.

In order to use this series type, you need to load the `modules/treemap.js` and `modules/treegraph.js` modules.

<iframe style="width: 100%; height: 700px; border: none;" src="https://www.highcharts.com/samples/embed/highcharts/demo/treegraph-chart" allow="fullscreen"></iframe>

### Data structure

The data is structured as a [tree](https://www.highcharts.com/docs/chart-concepts/dataviz-glossary#tree-data-structure), where each point represents a node. Each node can have its own children.  The tree automatically has one node at the top representing the root node. If a point has an undefined parent, or the parent is not matching any `id`, the parent will be automatically set to the root node. There may be multiple nodes without a parent, and they will be positioned as separate trees.

The following is an example of how the tree is built in Highcharts:

```js
data: [{
    name: 'I have children',
    id: 'id-1'
}, {
    name: 'I am a child',
    parent: 'id-1'
}, {
    name: 'I am a smaller child',
    parent: 'id-1'
}]
```

### Algorithms

Algorithms decide the positioning of the points. Currently there is one algorithm available, which is the [Walker](https://link.springer.com/chapter/10.1007/3-540-36151-0_32) algorithm for calculating the nodes' positions in the tree graph.

API options
-----------

### Links

In contrast to treemap series, the connections between the nodes are represented as links.  The links are generated from the options of the child. The shape of the link is the same as in the organization chart, and the same options apply.  To apply general options to all links, you can define the link options like this:

```js
series: [{
    type: 'treegraph',
    link: {
        type: 'curved',
        lineWidth: 3
    },
    data: [{
        name: 'I have children',
        id: 'id-1'
    }, {
        name: 'I am a child',
        parent: 'id-1'
    }, {
        name: 'I am a smaller child',
        parent: 'id-1'
    }]
}]
```

To change the configuration of a specific link, you have to specify the link object in the point configuration, like this:

```js
data: [{
    name: 'parent',
    id: 'id-1'
}, {
    name: 'child',
    parent: 'id-1',
    link: {
        type: 'curved',
        lineWidth: 5
    }
}]
```

This setting will take effect on the link that goes **to** the given node.

### Collapse Feature
The nodes' default behavior on click is to toggle the collapsed/expanded state. When clicking any node (which has children) the visibility of all child nodes and links will be hidden. This allows hiding any sub-trees and makes the data easier to read. When clicking on the same node again, all nodes and links will be visible again. You can test this feature on any demo, since this is a default behavior.

### Options

For an overview over the options for the treegraph, see
the [API](https://api.highcharts.com/highcharts/plotOptions.treegraph).

Dendrogram
----------
A dendrogram is a specialized treegraph used for clustering. The critical part
of a dendrogram is that the branch lengths are meaningful. They represent
similarity or distance. The closer two branches join, the more similar the items
are.

In Highcharts, we accommodate the similarity concept by giving each point (node)
an `x` value that is plotted against the x-axis. This way we control the x
position of each node, and thereby the branch length encoding similarity. In a
treegraph chart the x-axis is hidden by default, so typically for the dendrogram
we want to set `xAxis.visible` to `true`.

In the example below, we set up the typical taxonomy dendrogram. The x-axis is
given in millions years ago, indirectly the similarity of items in terms of time
since the last common ancestor.

Some techniques to note:
* We set the `marker.radius` to 0 for all nodes, effectively hiding the marker for
nodes and focusing on the lines encoding the links.
* We use two separate data label configurations, each with conditional
formatting to distinguish labels of the leaf nodes from the branching nodes. The
label for the branching nodes is used only to display the time of the split.

<iframe style="width: 100%; height: 700px; border: none;" src="https://www.highcharts.com/samples/embed/highcharts/demo/dendrogram" allow="fullscreen"></iframe>


More demos
----------

*   [Phylogenetic Treegraph](https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/highcharts/demo/treegraph-chart)
*   [Treegraph chart with different link types](https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/highcharts/series-treegraph/link-types)
*   [Treegraph chart with text path on dataLabels for links](https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/highcharts/series-treegraph/link-text-path)
*   [Treegraph chart with different node level for nodes](https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/highcharts/series-treegraph/node-level)
*   [Inverted treegraph](https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/highcharts/demo/treegraph-inverted)
*   [Programming language tree](https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/highcharts/series-treegraph/programming-languages)
