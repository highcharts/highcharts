
Highcharts.chart('container', {
    chart: {
        plotBorderWidth: 1
    },
    title: {
        text: 'endOnTick is true by default'
    },
    subtitle: {
        text: 'yAxis is rounded up to next tick and stops at 250'
    },
    xAxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    },
    yAxis: {
        //endOnTick: false
    },
    series: [{
        data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]
    }]
});