// Initial position of each node as a fraction (0–1) of the plot area.
// With all forces off, these become the final, fixed positions.
const positions = {
    A: { x: 0.5, y: 0.1 },
    B: { x: 0.15, y: 0.4 },
    C: { x: 0.85, y: 0.4 },
    D: { x: 0.25, y: 0.85 },
    E: { x: 0.55, y: 0.6 },
    F: { x: 0.85, y: 0.85 }
};

Highcharts.chart('container', {
    chart: {
        type: 'networkgraph'
    },

    title: {
        text: 'Simple network graph'
    },

    plotOptions: {
        networkgraph: {
            layoutAlgorithm: {
                enableSimulation: false,
                // Gravity turned off: nodes are not pulled toward the center.
                gravitationalConstant: 0,
                // Attraction (along links) and repulsion (between nodes)
                // turned off: both forces return zero.
                attractiveForce: function () {
                    return 0;
                },
                repulsiveForce: function () {
                    return 0;
                },
                // Place each node at its own starting position.
                initialPositions: function () {
                    const box = this.box;
                    this.nodes.forEach(function (node) {
                        const pos = positions[node.id] || { x: 0.5, y: 0.5 };
                        node.plotX = node.prevX = pos.x * box.width;
                        node.plotY = node.prevY = pos.y * box.height;
                        node.dispX = 0;
                        node.dispY = 0;
                    });
                }
            }
        }
    },

    series: [{
        name: 'Connections',
        keys: ['from', 'to'],
        data: [
            ['A', 'B'],
            ['A', 'C'],
            ['A', 'D'],
            ['B', 'C'],
            ['C', 'D'],
            ['D', 'E'],
            ['E', 'F'],
            ['F', 'A']
        ],
        dataLabels: {
            enabled: true,
            linkFormat: ''
        }
    }]
});
