(function (H) {
    var defined = H.defined,
        each = H.each;
    H.seriesType('sankey', 'pie', {
        nodeWidth: 20,
        nodePadding: 10,
        tooltip: {
            headerFormat:
                '<span style="font-size: 0.85em">{series.name}</span><br/>',
            pointFormat: '{point.from} => {point.to}: <b>{point.weight}</b>'
        }

    }, {
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

            return node;
        },

        /**
         * Create a node column.
         */
        createNodeColumn: function () {
            var column = [],
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
                        fromColumn = 0;

                    // No links to this node, place it left
                    if (node.linksTo.length === 0) {
                        node.column = 0;

                    // There are incoming links, place it to the right of the
                    // highest order column that links to this one.
                    } else {
                        each(node.linksTo, function (point) {
                            if (point.fromNode.column > fromColumn) {
                                fromColumn = point.fromNode.column;
                            }
                        });
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
         * Run pre-translation by generating the nodeColumns.
         */
        translate: function () {
            this.generatePoints();

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

        },

        /**
         * Draw the points (links) and the nodes.
         */
        drawPoints: function () {

            var chart = this.chart,
                series = this,
                options = this.options,
                left = 0,
                columnLength = 0,
                columnSum = 0,
                colors = chart.options.colors,
                nodeWidth = options.nodeWidth,
                nodeColumns = this.nodeColumns,
                colDistance = (chart.plotWidth - nodeWidth) /
                    (nodeColumns.length - 1),
                curvy = colDistance / 3;

            // Find out how much space is needed
            each(this.nodeColumns, function (column) {
                columnLength = Math.max(column.length, columnLength);
                columnSum = Math.max(column.sum(), columnSum);
            });

            // And translate that
            var totalHeight = chart.plotHeight -
                    (columnLength - 1) * options.nodePadding,
                factor = totalHeight / columnSum;

            each(this.nodeColumns, function (column) {
                each(column, function (node) {
                    var height = node.sum() * factor,
                        fromNodeTop = column.offset(node, factor),
                        color = colors[
                            ++series.colorCounter % colors.length
                        ];

                    // Draw the node
                    chart.renderer.rect(left, fromNodeTop, nodeWidth, height)
                        .attr({
                            fill: color
                        })
                        .add(series.group);

                    // Draw the links from this node
                    each(node.linksFrom, function (point) {
                        var linkHeight = point.weight * factor,
                            fromLinkTop = node.offset(point, 'linksFrom') *
                                factor,
                            fromY = fromNodeTop + fromLinkTop,
                            toNode = point.toNode,
                            toY = toNode.offset(point, 'linksTo') * factor +
                                nodeColumns[toNode.column].offset(
                                    toNode,
                                    factor
                                ),
                            right = toNode.column * colDistance;


                        if (!point.graphic) {
                            point.graphic = chart.renderer
                                .path()
                                .add(series.group);
                        }
                        point.graphic.attr({
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
                            ],
                            fill: Highcharts.color(color).setOpacity(0.5).get()
                        });
                    });
                });
                left += colDistance;

            }, this);
        },
        drawDataLabels: function () {

        },
        animate: function () {},
        pointAttribs: function () {}
    }, {
        haloPath: function () {
            return ['M', 0, 0];
        }
    });
}(Highcharts));


Highcharts.chart('container', {

    title: {
        text: 'Highcharts Sankey study'
    },

    series: [{
        data: [{
            from: 'A',
            to: 'X',
            weight: 5
        }, {
            from: 'A',
            to: 'Y',
            weight: 7
        }, {
            from: 'A',
            to: 'Z',
            weight: 6
        }, {
            from: 'B',
            to: 'X',
            weight: 2
        }, {
            from: 'B',
            to: 'Y',
            weight: 9
        }, {
            from: 'B',
            to: 'Z',
            weight: 4
        }],
        type: 'sankey'
    }]

});
