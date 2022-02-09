Treegraph chart
===
A Tree graph is a way of visualizing the tree data structure. In mathematics, the tree is a data structure, represents hierarchical structure in a graphical form. The best examples of a tree data structure are: <ul>
<li>a genealogy tree </li>
<li>directories in computer science</li>
<li>decision tree</li>
</ul>
Our tree representation is a oriented rooted tree, which means, that direction of the connections matter, and there is one node, which does not have a parent (is a root of the tree).

In order to use it, you need to load the `modules/treegraph.js` module.


<iframe style="width: 100%; height: 700px; border: none;" src=https://www.highcharts.com/samples/embed/highcharts/demo/treegraph-chart allow="fullscreen"></iframe>

Options structure
-----------------

In Highcharts, the treegraph chart resembles the sankey chart in the way it is built `around nodes and links` with only one restriction: Each point have to have a single parent (a link that directs to it).

The nodes of a treegraph chart are the positions or persons, while the links are the lines showing the relations between them. The `data` structure of the options defines the links.

In the `nodes` array of the series, each node is identified by an `id` refering to the id in the link. Additional properties like `title`, `description` and some marker options may be set in the individual node options.

Levels
------

In an org chart typically, we may want to define specific styling for all nodes on a specific level, for example having all C-level positions in the same color. For this, we can use the [[levels option](https://api.highcharts.com/highcharts/plotOptions.organization.levels) and set the properties there. An example can be seen in the main demo above.

API options
-----------

For the full set of available options, [see the API](https://api.highcharts.com/highcharts/series.organization).
