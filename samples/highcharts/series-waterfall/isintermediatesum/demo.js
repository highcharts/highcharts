Highcharts.chart('container', {
    chart: {
        type: 'waterfall'
    },
    title: {
        text: 'Waterfall isIntermediateSum (#2227)'
    },
    xAxis: {
        type: 'category'
    },
    legend: {
        enabled: false
    },
    series: [{
        data: [{
            //x: 0,
            name: 'Value 1',
            y: 1
        }, {
            //x: 1,
            name: 'Value 2',
            y: 1
        }, {
            //x: 2,
            name: 'Intermediate 1',
            isIntermediateSum: true
        }, {
            //x: 3,
            name: 'Value 3',
            y: 1
        }, {
            //x: 4,
            name: 'Value 4',
            y: 1
        }, {
            //x: 5,
            name: 'Intermediate 2',
            isIntermediateSum: true
        }, {
            //x: 6,
            name: 'Val 5',
            y: 1
        }, {
            //x: 7,
            name: 'Total Sum',
            isSum: true
        }]

    }]
});
