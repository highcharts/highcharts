Treegraph chart
===
A Tree graph is a way of visualizing the tree data structure. About this data structure you can read more [Here](https://en.wikipedia.org/wiki/Tree_(data_structure)). The best examples of a tree data structure are: <ul>
<li>a genealogy tree </li>
<li>directories in computer science</li>
<li>decision tree</li>
</ul>
Our tree representation is a oriented rooted tree, which means, that direction of the connections matter, and there is one node in each set of data, which does not have a parent (is a root of the tree).
In contrast to treemap and sunburst, this series type does not require the value property, because each point position is based solely on its relation with other nodes in the tree.

In order to use this series type, you need to load the `modules/treemap.js` and `modules/treegraph.js` modules.

<iframe style="width: 100%; height: 700px; border: none;" src=https://www.highcharts.com/samples/embed/highcharts/demo/treegraph-chart allow="fullscreen"></iframe>

### Data structure

The data is structured as a [Tree](https://en.wikipedia.org/wiki/Tree_(data_structure)), where each point represents a node. Each node can have its own children.  The tree automatically has one node at the top representing the root node. If a point has an undefined parent, or the parent is not matching any id, the parent will be automatically set to the root node. There can be multiple nodes without parent, and they will be positioned as seperate trees.

The following is an example of how the tree is built in Highcharts:


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

### Algorithms

Algorithms decide on posiitoning of the points. Currently there is only 1 algorithm available, which is [Walker](http://dirk.jivas.de/papers/buchheim02improving.pdf) algorithm for calculating the nodes position in the tree graph.

API options
-----------

### Links

In contrast to treemap series, the connections between the nodes are represented as links.  The links are generated from the options of the child. The shape of the link is the same as in the organization chart, and the same options apply.  To apply the general options to all links, you can define the link options like this:

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

To change the configuraiton of the specific link, you have to specify the link object in the point configuration, like this:

    data: [{
        name: 'parent',
        id: 'id-1
    }, {
        name: 'child',
        parent: 'id-1',
        link: {
            type: 'curved',
            lineWidth: 5
        }
    }]

This option will take effect on a link, which goes **to** the given node.

### Options

For an overview over the options for the treegraph, see the [API](https://api.highcharts.com/highcharts/plotOptions.treegraph).



### Mode demos

*   [Treegraph chart with different link types](https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/highcharts/series-treegraph/link-types)
*   [Treegraph chart with text path on dataLabels for links](https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/highcharts/series-treegraph/link-text-path)
*   [Treegraph chart with different node level for nodes](https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/highcharts/series-treegraph/node-level)
*   [Treegraph chart with reversed order of nodes](https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/highcharts/series-treegraph/reversed)
