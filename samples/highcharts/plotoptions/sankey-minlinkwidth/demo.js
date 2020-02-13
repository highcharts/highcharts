Highcharts.chart('container', {

    title: {
        text: 'Highcharts Sankey Diagram'
    },

    series: [{
        keys: ['from', 'to', 'weight'],
        minLinkWidth: 1,
        data: [
            ['Brazil', 'Portugal', 5],
            ['Brazil', 'France', 1],
            ['Canada', 'Portugal', 1],
            ['Canada', 'France', 100000],
            ['Portugal', 'Angola', 2],
            ['Portugal', 'Senegal', 1],
            ['Portugal', 'Morocco', 1],
            ['Portugal', 'South Africa', 3],
            ['France', 'Angola', 1],
            ['France', 'Senegal', 3],
            ['France', 'Mali', 3],
            ['France', 'Morocco', 3],
            ['France', 'South Africa', 1]
        ],
        type: 'sankey',
        name: 'Sankey demo series'
    }]

});
