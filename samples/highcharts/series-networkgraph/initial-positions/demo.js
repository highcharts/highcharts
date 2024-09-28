Highcharts.chart('container', {
    chart: {
        type: 'networkgraph',
        plotBorderWidth: 1
    },
    title: {
        text: 'Networkgraph with random initial positions'
    },
    plotOptions: {
        networkgraph: {
            keys: ['from', 'to']
        }
    },
    series: [{
        layoutAlgorithm: {
            enableSimulation: true,
            initialPositions: function () {
                const chart = this.series[0].chart,
                    width = chart.plotWidth,
                    height = chart.plotHeight;

                this.nodes.forEach(function (node) {
                    // If initial positions were set previously, use that
                    // positions. Otherwise use random position:
                    node.plotX = node.plotX === undefined ?
                        Math.random() * width : node.plotX;
                    node.plotY = node.plotY === undefined ?
                        Math.random() * height : node.plotY;
                });
            }
        },
        name: 'K8',
        data: [
            ['A', 'B'],
            ['A', 'C'],
            ['A', 'D'],
            ['A', 'E'],
            ['A', 'F'],
            ['A', 'G'],

            ['B', 'C'],
            ['B', 'D'],
            ['B', 'E'],
            ['B', 'F'],
            ['B', 'G'],

            ['C', 'D'],
            ['C', 'E'],
            ['C', 'F'],
            ['C', 'G'],

            ['D', 'E'],
            ['D', 'F'],
            ['D', 'G'],

            ['E', 'F'],
            ['E', 'G'],

            ['F', 'G']
        ]
    }]
});
