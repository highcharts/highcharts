(function (H) {
    var defined = H.defined,
        each = H.each,
        Point = H.Point;


    H.seriesType('sankey', 'column', {
        colorByPoint: true,
        dataLabels: {
            enabled: true,
            backgroundColor: 'none', // enable padding
            crop: false,
            defer: false,
            formatter: function () {
                return this.point.isNode && this.point.id;
            },
            inside: true
        },
        linkOpacity: 0.5,
        nodeWidth: 20,
        nodePadding: 10,
        showInLegend: false,
        states: {
            hover: {
                linkOpacity: 1
            }
        },
        tooltip: {
            followPointer: true,
            headerFormat:
                '<span style="font-size: 0.85em">{series.name}</span><br/>',
            pointFormatter: function () {
                if (this.isNode) {
                    return this.id + ': ' + this.node.sum();
                }
                return this.from + ' \u2192 ' + this.to +
                    ': <b>' + this.weight + '</b>';
            }
        }

    }, {
        isCartesian: false,
        forceDL: true,
        /**
         * Create a single node that holds information on incoming and outgoing
         * links.
         */
        createNode: function (id) {
            var node = [];
            node.id = id;
            node.linksTo = [];
            node.linksFrom = [];
            /**
             * Return the largest sum of either the incoming or outgoing links.
             */
            node.sum = function () {
                var sumTo = 0,
                    sumFrom = 0;
                each(node.linksTo, function (link) {
                    sumTo += link.weight;
                });
                each(node.linksFrom, function (link) {
                    sumFrom += link.weight;
                });
                return Math.max(sumTo, sumFrom);
            };
            /**
             * Get the offset in weight values of a point/link.
             */
            node.offset = function (point, coll) {
                var offset = 0;
                for (var i = 0; i < node[coll].length; i++) {
                    if (node[coll][i] === point) {
                        return offset;
                    }
                    offset += node[coll][i].weight;
                }
            };

            node.point = (new Point()).init(this, { isNode: true, id: id });
            node.point.node = node;
            this.points.push(node.point);

            return node;
        },

        /**
         * Create a node column.
         */
        createNodeColumn: function () {
            var chart = this.chart,
                column = [],
                nodePadding = this.options.nodePadding;

            column.sum = function () {
                var sum = 0;
                each(this, function (node) {
                    sum += node.sum();
                });
                return sum;
            };
            /**
             * Get the offset in pixels of a node inside the column.
             */
            column.offset = function (node, factor) {
                var offset = 0;
                for (var i = 0; i < column.length; i++) {
                    if (column[i] === node) {
                        return offset;
                    }
                    offset += column[i].sum() * factor + nodePadding;
                }
            };

            /**
             * Get the column height in pixels.
             */
            column.top = function (factor) {
                var height = 0;
                for (var i = 0; i < column.length; i++) {
                    if (i > 0) {
                        height += nodePadding;
                    }
                    height += column[i].sum() * factor;
                }
                return (chart.plotHeight - height) / 2;
            };

            return column;
        },

        /**
         * Create node columns by analyzing the nodes and the relations between
         * incoming and outgoing links.
         */
        createNodeColumns: function (nodes) {
            var columns = [];
            for (var id in nodes) {
                if (nodes.hasOwnProperty(id)) {
                    var node = nodes[id],
                        fromColumn = 0,
                        i,
                        point;

                    // No links to this node, place it left
                    if (node.linksTo.length === 0) {
                        node.column = 0;

                    // There are incoming links, place it to the right of the
                    // highest order column that links to this one.
                    } else {
                        for (i = 0; i < node.linksTo.length; i++) {
                            point = node.linksTo[0];
                            if (point.fromNode.column > fromColumn) {
                                fromColumn = point.fromNode.column;
                            }
                        }
                        node.column = fromColumn + 1;
                    }

                    if (!columns[node.column]) {
                        columns[node.column] = this.createNodeColumn();
                    }

                    columns[node.column].push(node);

                }
            }
            return columns;
        },

        /**
         * Return the presentational attributes.
         */
        pointAttribs: function (point, state) {

            var opacity = this.options.linkOpacity;

            if (state) {
                opacity = this.options.states[state].linkOpacity || opacity;
            }

            return {
                fill: point.isNode ?
                    point.color :
                    H.color(point.color).setOpacity(opacity).get()
            };
        },

        /**
         * Run pre-translation by generating the nodeColumns.
         */
        translate: function () {
            this.generatePoints();
            this.colorCounter = 0;

            var nodes = {};

            each(this.points, function (point) {
                if (defined(point.from)) {
                    if (!nodes[point.from]) {
                        nodes[point.from] = this.createNode(point.from);
                    }
                    nodes[point.from].linksFrom.push(point);
                    point.fromNode = nodes[point.from];
                }
                if (defined(point.to)) {
                    if (!nodes[point.to]) {
                        nodes[point.to] = this.createNode(point.to);
                    }
                    nodes[point.to].linksTo.push(point);
                    point.toNode = nodes[point.to];
                }

            }, this);

            this.nodeColumns = this.createNodeColumns(nodes);

            var chart = this.chart,
                options = this.options,
                left = 0,
                nodeWidth = options.nodeWidth,
                nodeColumns = this.nodeColumns,
                colDistance = (chart.plotWidth - nodeWidth) /
                    (nodeColumns.length - 1),
                curvy = colDistance / 3,
                factor = Infinity;

            // Find out how much space is needed. Base it on the translation
            // factor of the most spaceous column.
            each(this.nodeColumns, function (column) {
                var height = chart.plotHeight -
                    (column.length - 1) * options.nodePadding;

                factor = Math.min(factor, height / column.sum());
            });

            each(this.nodeColumns, function (column) {
                each(column, function (node) {
                    var height = node.sum() * factor,
                        fromNodeTop = column.top(factor) +
                            column.offset(node, factor),
                        nodePoint = node.point;

                    // Draw the node
                    if (!nodePoint.graphic) {
                        nodePoint.shapeType = 'rect';
                        nodePoint.shapeArgs = {
                            x: left,
                            y: fromNodeTop,
                            width: nodeWidth,
                            height: height
                        };
                        // Pass test in drawPoints
                        nodePoint.y = nodePoint.plotY = 1;
                    }

                    // Draw the links from this node
                    each(node.linksFrom, function (point) {
                        var linkHeight = point.weight * factor,
                            fromLinkTop = node.offset(point, 'linksFrom') *
                                factor,
                            fromY = fromNodeTop + fromLinkTop,
                            toNode = point.toNode,
                            toColTop = nodeColumns[toNode.column].top(factor),
                            toY = toColTop + toNode.offset(point, 'linksTo') *
                                factor + nodeColumns[toNode.column].offset(
                                    toNode,
                                    factor
                                ),
                            right = toNode.column * colDistance;

                        point.shapeType = 'path';
                        point.shapeArgs = {
                            d: [
                                'M', left + nodeWidth, fromY,
                                'C', left + nodeWidth + curvy, fromY,
                                right - curvy, toY,
                                right, toY,
                                'L', right, toY + linkHeight,
                                'C', right - curvy, toY + linkHeight,
                                left + nodeWidth + curvy, fromY + linkHeight,
                                left + nodeWidth, fromY + linkHeight,
                                'z'
                            ]
                        };
                        // Pass test in drawPoints
                        point.y = point.plotY = 1;

                        point.color = nodePoint.color;
                    });
                });
                left += colDistance;

            }, this);
        },
        animate: function () {}
    });
}(Highcharts));


Highcharts.chart('container', {

    title: {
        text: 'Highcharts Sankey study'
    },

    series: [{
        keys: ['from', 'to', 'weight'],
        data: [
            ['Brazil', 'Portugal', 5 ],
            ['Brazil', 'France', 1 ],
            ['Brazil', 'Spain', 1 ],
            ['Brazil', 'England', 1 ],
            ['Canada', 'Portugal', 1 ],
            ['Canada', 'France', 5 ],
            ['Canada', 'England', 1 ],
            ['Mexico', 'Portugal', 1 ],
            ['Mexico', 'France', 1 ],
            ['Mexico', 'Spain', 5 ],
            ['Mexico', 'England', 1 ],
            ['USA', 'Portugal', 1 ],
            ['USA', 'France', 1 ],
            ['USA', 'Spain', 1 ],
            ['USA', 'England', 5 ],
            ['Portugal', 'Angola', 2 ],
            ['Portugal', 'Senegal', 1 ],
            ['Portugal', 'Morocco', 1 ],
            ['Portugal', 'South Africa', 3 ],
            ['France', 'Angola', 1 ],
            ['France', 'Senegal', 3 ],
            ['France', 'Mali', 3 ],
            ['France', 'Morocco', 3 ],
            ['France', 'South Africa', 1 ],
            ['Spain', 'Senegal', 1 ],
            ['Spain', 'Morocco', 3 ],
            ['Spain', 'South Africa', 1 ],
            ['England', 'Angola', 1 ],
            ['England', 'Senegal', 1 ],
            ['England', 'Morocco', 2 ],
            ['England', 'South Africa', 7 ],
            ['South Africa', 'China', 5 ],
            ['South Africa', 'India', 1 ],
            ['South Africa', 'Japan', 3 ],
            ['Angola', 'China', 5 ],
            ['Angola', 'India', 1 ],
            ['Angola', 'Japan', 3 ],
            ['Senegal', 'China', 5 ],
            ['Senegal', 'India', 1 ],
            ['Senegal', 'Japan', 3 ],
            ['Mali', 'China', 5 ],
            ['Mali', 'India', 1 ],
            ['Mali', 'Japan', 3 ],
            ['Morocco', 'China', 5 ],
            ['Morocco', 'India', 1 ],
            ['Morocco', 'Japan', 3 ]
        ],
        type: 'sankey',
        name: 'Sankey demo series'
    }]

});
