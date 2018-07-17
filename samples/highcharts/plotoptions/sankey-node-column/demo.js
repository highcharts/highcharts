Highcharts.chart('container', {

    title: {
        text: 'Highcharts Sankey diagram'
    },

    subtitle: {
        text: 'Node column and offset options'
    },

    series: [{
        keys: ['from', 'to', 'weight'],
        data: [
            ['China', 'EU', 94],
            ['China', 'US', 53],
            ['US', 'EU', 29]

        ],
        nodes: [{
            id: 'US',
            offset: 130
        }, {
            id: 'EU',
            column: 2
        }],
        type: 'sankey',
        name: 'Flow'
    }]

});
