Highcharts.chart('container', {

    title: {
        text: 'Highcharts Sankey diagram'
    },

    subtitle: {
        text: 'The energy efficiency of an electric motor'
    },

    series: [{
        keys: ['from', 'to', 'weight'],
        data: [{
            from: 'total',
            to: 'Useful kinetic energy',
            weight: 56,
            outgoing: true
        }, {
            from: 'total',
            to: 'Heat loss',
            weight: 27,
            outgoing: true
        }, {
            from: 'total',
            to: 'Sound loss',
            weight: 17,
            outgoing: true
        }],
        dataLabels: {
            nodeFormat: '{point.name}: {point.sum}%',
            padding: 20,
            style: {
                fontSize: '1.5em'
            }
        },
        nodes: [{
            id: 'total',
            name: 'Total energy required'
        }],
        type: 'sankey',
        name: 'Energy of an electric motor',
        linkOpacity: 1,
        nodePadding: 30,
        curveFactor: 0.5
    }]

});
