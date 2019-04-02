function generateDisconnectedGraphs(length) {
    var data = [];

    // Some noisy data
    while (length--) {
        data.push([
            length,
            Math.sin(length).toFixed(2)
        ], [
            length,
            Math.cos(length).toFixed(2)
        ]);
    }

    return data;
}

Highcharts.chart('container', {
    chart: {
        type: 'networkgraph',
        plotBorderWidth: 1
    },
    title: {
        text: 'Disconnected graphs'
    },
    plotOptions: {
        networkgraph: {
            keys: ['from', 'to'],
            layoutAlgorithm: {
                enableSimulation: true,
                integration: 'verlet'
            }
        }
    },

    series: [{
        data: generateDisconnectedGraphs(100)
    }]
});
