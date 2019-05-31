Highcharts.chart('container', {
    chart: {
        type: 'waterfall'
    },
    title: {
        text: 'Stack labels in waterfall chart'
    },
    tooltip: {
        shared: true
    },
    xAxis: {
        categories: ['0', '1', '2', '1. Intermediate Sum', '4', '5',  '2. Intermediate Sum', '7', 'Sum']
    },
    yAxis: {
        tickPixelInterval: 30,
        stackLabels: {
            enabled: true,
            crop: false
        }
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
        }, 20, -10, {
            isIntermediateSum: true
        }, 10, {
            isSum: true
        }]
    }, {
        data: [-20, -10, -20, {
            isIntermediateSum: true
        }, 10, 20, {
            isIntermediateSum: true
        }, -20, {
            isSum: true
        }]
    }, {
        data: [-20, 10, 10,  {
            isIntermediateSum: true
        }, 30, -20, {
            isIntermediateSum: true
        }, -10, {
            isSum: true
        }]
    }]
});