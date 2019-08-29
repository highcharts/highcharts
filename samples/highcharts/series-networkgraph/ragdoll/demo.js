Highcharts.chart('container', {
    chart: {
        type: 'networkgraph',
        plotBorderWidth: 1
    },
    title: {
        text: 'Compare drag & drop smoothness for small and big nodes'
    },
    plotOptions: {
        networkgraph: {
            layoutAlgorithm: {
                enableSimulation: true
            },
            keys: ['from', 'to']
        }
    },
    series: [{
        marker: {
            radius: 3
        },
        nodes: [{
            id: 'Head',
            marker: {
                radius: 15
            }
        }, {
            id: 'F',
            marker: {
                radius: 5
            }
        }, {
            id: 'H',
            marker: {
                radius: 5
            }
        }, {
            id: 'N',
            marker: {
                radius: 5
            }
        }, {
            id: 'P',
            marker: {
                radius: 5
            }
        }],
        // Body:
        data: [
            // Right leg:
            ['K', 'O'],
            ['O', 'P'],
            // Left leg:
            ['L', 'M'],
            ['M', 'N'],
            // Waist:
            ['I', 'K'],
            ['I', 'L'],
            ['J', 'K'],
            ['J', 'L'],
            ['L', 'K'],
            // Right hand
            ['B', 'D'],
            ['D', 'E'],
            ['E', 'F'],
            // Left hand
            ['B', 'C'],
            ['C', 'G'],
            ['G', 'H'],
            // Torso:
            ['C', 'D'],
            ['C', 'J'],
            ['D', 'I'],
            ['B', 'I'],
            ['B', 'J'],
            ['I', 'J'],
            // Head
            ['A', 'B'],
            ['A', 'C'],
            ['A', 'D'],
            ['Head', 'A']
        ]
    }]
});
