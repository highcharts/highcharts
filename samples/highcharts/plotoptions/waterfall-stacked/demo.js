Highcharts.chart('container', {
    chart: {
        type: 'waterfall'
    },
    title: {
        text: 'Highcharts stacked waterfall'
    },
    plotOptions: {
        series: {
            stacking: 'normal'
        }
    },
    series: [{
        data: [20, 10, {
            isIntermediateSum: true
        }, -15, 30, {
            isSum: true
        }]
    }, {
        data: [20, 50, {
            isIntermediateSum: true
        }, -25, 10, {
            isSum: true
        }],
        lineWidth: 0
    }, {
        data: [5, 10, {
            isIntermediateSum: true
        }, -5, 10, {
            isSum: true
        }],
        lineWidth: 0
    }]
});
