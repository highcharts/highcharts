Highcharts.chart('container', {

    title: {
        text: 'Highcharts Sankey diagram'
    },

    subtitle: {
        text: 'Node and link data labels'
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
        name: 'Flow',
        dataLabels: {
            format: '<span style="font-weight: normal; font-size: 16px">' +
                '{point.fromNode.name} \u2192 {point.toNode.name}: {point.weight}' +
                '</span>',
            nodeFormat: '{point.name}'
        }
    }]

});
