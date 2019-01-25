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
            translateLink: function (point) {

                var fromNode = point.fromNode,
                    toNode = point.toNode,
                    crisp = Math.round(this.options.linkLineWidth) % 2 / 2,
                    x1 = Math.floor(
                        fromNode.shapeArgs.x + fromNode.shapeArgs.width
                    ) + crisp,
                    y1 = Math.floor(
                        fromNode.shapeArgs.y + fromNode.shapeArgs.height / 2
                    ) + crisp,
                    x2 = Math.floor(toNode.shapeArgs.x) + crisp,
                    y2 = Math.floor(toNode.shapeArgs.y + toNode.shapeArgs.height / 2) + crisp;

                if (this.chart.inverted) {
                    x1 -= fromNode.shapeArgs.width;
                    x2 += toNode.shapeArgs.width;
                }

                point.plotY = 1;
                point.shapeType = 'path';
                point.shapeArgs = {
                    d: [
                        'M', x1, y1,
                        'L', (x1 + x2) / 2, y1,
                        (x1 + x2) / 2, y2,
                        x2, y2
                    ]
                };
            }
        }

    );

}(Highcharts));

var datasets = {
    topdown: {
        data: [
            ['CEO', 'CTO'],
            ['CEO', 'CPO'],
            ['CEO', 'CSO'],
            ['CEO', 'CMO'],
            ['CTO', 'Dev1'],
            ['CTO', 'Dev2']
        ]
    },
    mafia: {
        data: [
            ['Boss', 'Consigliere'],
            ['Boss', 'Underboss'],
            ['Underboss', 'Caporegime1'],
            ['Underboss', 'Caporegime2'],
            ['Underboss', 'Caporegime3'],
            ['Caporegime1', 'Soldiers1'],
            ['Caporegime2', 'Soldiers2'],
            ['Caporegime3', 'Soldiers3']
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
        keys: ['from', 'to'],
        data: dataset.data,
        nodes: dataset.nodes,
        type: 'orgchart',
        name: 'Highcharts Org Chart POC'
    }]

});