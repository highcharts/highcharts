var chart = Highcharts.chart('container', {
    series: [{
        type: 'venn',
        data: [
            { sets: ['A'], value: 24 },
            { sets: ['B'], value: 12 },
            { sets: ['C'], value: 12 },
            { sets: ['A', 'C'], value: 6 },
            { sets: ['B', 'C'], value: 1 }
        ]
    }]
});
