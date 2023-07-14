Highcharts.chart('container', {
    series: [{
        type: 'venn',
        name: 'Venn series basic',
        // Series data
        data: [{
            name: 'Apples',
            sets: ['A'],
            value: 2
        }, {
            name: 'Bananas',
            sets: ['B'],
            value: 2
        }, {
            name: 'Fruits',
            sets: ['A', 'B'],
            value: 1
        }]
    }]
});
