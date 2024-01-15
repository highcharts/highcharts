Highcharts.chart('container', {

    title: {
        text: 'Node distance demo'
    },

    subtitle: {
        text: '<em>nodeDistance: 100%</em> means equal to node width'
    },

    series: [{
        type: 'sankey',
        keys: ['from', 'to', 'weight'],
        nodeWidth: 'auto',
        nodeDistance: '100%',
        data: [{
            from: 'A',
            to: 'B',
            weight: 0.3
        }, {
            from: 'A',
            to: 'C',
            weight: 0.5
        }, {
            from: 'B',
            to: 'D',
            weight: 0.3
        }, {
            from: 'C',
            to: 'D',
            weight: 0.3
        }]
    }]

});
