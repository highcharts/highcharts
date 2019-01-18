Highcharts.chart('container', {
    chart: {
        type: 'waterfall'
    },
    title: {
        text: 'Highcharts stacked waterfall (normal)'
    },
    tooltip: {
        shared: true
    },
    xAxis: {
        categories: ['0', '1', '2', '1. Intermediate Sum', '4',  '2. Intermediate Sum', '6', 'Sum']
    },
    yAxis: {
        tickInterval: 10
    },
    plotOptions: {
        series: {
            stacking: 'normal',
            lineWidth: 1
        }
    },
    series: [{
        data: [10, 10, 30, {
            isIntermediateSum: true
        }, 20, {
            isIntermediateSum: true
        }, 10, {
            isSum: true
        }]
    }, {
        data: [-20, -10, -20, {
            isIntermediateSum: true
        }, 10, {
            isIntermediateSum: true
        }, -20, {
            isSum: true
        }]
    }, {
        data: [-20, 10, 10,  {
            isIntermediateSum: true
        }, 30, {
            isIntermediateSum: true
        }, -10, {
            isSum: true
        }]
    }]
});
