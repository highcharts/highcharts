
// THE CHART
Highcharts.stockChart('container', {
    chart: {
        type: 'line'
    },
    title: {
        text: 'Grid axis with navigator'
    },

    xAxis: [{
        id: 'bottom-datetime-axis',
        grid: true,
        opposite: true,
        type: 'datetime'
    }, {
        grid: true,
        type: 'datetime',
        opposite: true,
        labels: {
            style: {
                fontSize: '15px'
            }
        },
        linkedTo: 0,
        tickPixelInterval: 200
    }],
    series: [{
        name: 'Project 1',
        xAxis: 0,
        data: usdeur
    }]
});
