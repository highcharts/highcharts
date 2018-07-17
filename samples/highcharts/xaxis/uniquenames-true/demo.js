
Highcharts.chart('container', {
    chart: {
        type: 'column'
    },
    title: {
        text: 'X axis uniqueNames = true'
    },
    xAxis: {
        type: 'category'
    },
    series: [{
        colorByPoint: true,
        data: [{
            name: 'Q1',
            y: 3
        }, {
            name: 'Q2',
            y: 6
        }, {
            name: 'Q3',
            y: 9
        }, {
            name: 'Q4',
            y: 2
        }, {
            name: 'Q1',
            y: 2
        }, {
            name: 'Q2',
            y: 3
        }, {
            name: 'Q3',
            y: 6
        }, {
            name: 'Q4',
            y: 7
        }],
        showInLegend: false
    }]
});