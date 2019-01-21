document.addEventListener('DOMContentLoaded', function () {

    var datasets = {
        topdown: {
            data: [
                ['CEO', 'CTO', 1],
                ['CEO', 'CPO', 1],
                ['CEO', 'CSO', 1],
                ['CEO', 'CMO', 1],
                ['CTO', 'Dev1', 1],
                ['CTO', 'Dev2', 1]
            ]
        },
        mafia: {
            data: [
                ['Boss', 'Consigliere', 1],
                ['Boss', 'Underboss', 1],
                ['Underboss', 'Caporegime1', 1],
                ['Underboss', 'Caporegime2', 1],
                ['Underboss', 'Caporegime3', 1],
                ['Caporegime1', 'Soldiers1', 1],
                ['Caporegime2', 'Soldiers2', 1],
                ['Caporegime3', 'Soldiers3', 1]
            ],
            nodes: [{
                id: 'Consigliere',
                column: 0
            }, {
                id: 'Caporegime1',
                name: 'Caporegime'
            }, {
                id: 'Caporegime2',
                name: 'Caporegime'
            }, {
                id: 'Caporegime3',
                name: 'Caporegime'
            }, {
                id: 'Soldiers1',
                name: 'Soldiers',
                color: '#eeeeee'
            }, {
                id: 'Soldiers2',
                name: 'Soldiers',
                color: '#eeeeee'
            }, {
                id: 'Soldiers3',
                name: 'Soldiers',
                color: '#eeeeee'
            }]
        }
    };

    var dataset = datasets.mafia;
    Highcharts.chart('container', {

        title: {
            text: 'Highcharts Org Chart POC'
        },

        series: [{
            keys: ['from', 'to', 'weight'],
            data: dataset.data,
            nodes: dataset.nodes,
            type: 'orgchart',
            name: 'Highcharts Org Chart POC'
        }]

    });
});

(function (H) {

    var base = H.seriesTypes.sankey.prototype;
    H.seriesType(
        'orgchart',
        'sankey',
        {
            nodeWidth: 50,

            // @todo: Use palette
            linkColor: '#666666',
            linkLineWidth: 1
        },
        {
            inverted: true,
            pointAttribs: function (point, state) {
                var attribs = base.pointAttribs.call(this, point, state);

                if (!point.isNode) {
                    attribs.stroke = this.options.linkColor;
                    attribs['stroke-width'] = this.options.linkLineWidth;
                    delete attribs.fill;
                }
                return attribs;
            },
            createNode: function (id) {
                var node = base.createNode
                    .call(this, id);

                // All nodes in an org chart are equal width
                node.getSum = function () {
                    return 1;
                };

                return node;

            },
            translate: function () {
                var inverted = this.chart.inverted;

                base.translate.call(this);

                this.nodeColumns.forEach(function (column) {
                    column.forEach(function (node) {
                        // Draw the links from this node
                        node.linksFrom.forEach(function (link) {

                            var toNode = link.toNode,
                                x1 = node.shapeArgs.x + node.shapeArgs.width,
                                y1 = node.shapeArgs.y + node.shapeArgs.height / 2,
                                x2 = toNode.shapeArgs.x,
                                y2 = toNode.shapeArgs.y + toNode.shapeArgs.height / 2;

                            if (inverted) {
                                x1 -= node.shapeArgs.width;
                                x2 += toNode.shapeArgs.width;
                            }

                            link.shapeArgs = {
                                d: [
                                    'M', x1, y1,
                                    'L', (x1 + x2) / 2, y1,
                                    (x1 + x2) / 2, y2,
                                    x2, y2
                                ]
                            };

                        });

                    });
                });
            }
        }

    );

}(Highcharts));