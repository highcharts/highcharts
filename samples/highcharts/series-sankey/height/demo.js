Highcharts.chart('container', {
    title: {
        text: 'Highcharts Sankey Diagram'
    },
    subtitle: {
        text: 'Custom height option for each node.'
    },
    series: [{
        keys: ['from', 'to', 'weight'],
        nodes: [{
            id: 'Electricity & Heat',
            color: '#ffa500',
            offset: -50,
            height: 40
        }, {
            id: 'Residential',
            color: '#74ffe7',
            column: 2,
            offset: 20,
            height: 30
        }, {
            id: 'Commercial',
            color: '#8cff74',
            column: 2,
            offset: 50,
            height: 25
        }, {
            id: 'Industrial',
            color: '#ff8da1',
            column: 2,
            offset: 50,
            height: 50
        }, {
            id: 'Transportation',
            color: '#f4c0ff',
            column: 2,
            height: 105
        }, {
            id: 'Rejected Energy',
            color: '#e6e6e6',
            column: 3,
            offset: -10,
            height: 60
        }, {
            id: 'Energy Services',
            color: '#F9E79F',
            column: 3,
            height: 60
        }, {
            id: 'Petroleum',
            color: '#989898',
            offset: -1
        }],
        data: [
            ['Petroleum', 'Electricity & Heat', 9.21],
            ['Electricity & Heat', 'Residential', 4.7],
            ['Electricity & Heat', 'Commercial', 4.6],
            ['Electricity & Heat', 'Industrial', 3.23],
            ['Petroleum', 'Industrial', 8.38],
            ['Electricity & Heat', 'Transportation', 0.03],
            ['Petroleum', 'Transportation', 25.9],
            ['Residential', 'Rejected Energy', 3.75],
            ['Commercial', 'Rejected Energy', 3.15],
            ['Industrial', 'Rejected Energy', 12.9],
            ['Transportation', 'Rejected Energy', 22.2],
            ['Residential', 'Energy Services', 6.97],
            ['Commercial', 'Energy Services', 5.84],
            ['Industrial', 'Energy Services', 12.4],
            ['Transportation', 'Energy Services', 5.91]
        ],
        type: 'sankey',
        name: 'Sankey demo series'
    }],
    tooltip: {
        headerFormat: null,
        pointFormat: '{point.fromNode.name} \u2192 {point.toNode.name}: ' +
            '{point.weight:.2f} quads',
        nodeFormat: '{point.name}: {point.sum:.2f} quads'
    }
});
