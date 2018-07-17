// Highcharts 4.1.1, Issue 3856
// shared tooltip not working for polar chart

Highcharts.chart('container', {
    chart: {
        polar: true
    },
    title: {
        text: 'Highcharts Polar Chart'
    },
    pane: {
        startAngle: 0,
        endAngle: 360
    },
    xAxis: {
        tickInterval: 45,
        min: 0,
        max: 360
    },
    yAxis: {
        min: 0
    },
    plotOptions: {
        series: {
            animation: false,
            pointStart: 0,
            pointInterval: 45
        },
        column: {
            pointPadding: 0,
            groupPadding: 0
        }
    },
    tooltip: {
        shared: true
    },
    series: [{
        type: 'line',
        name: 'Line1',
        data: [8, 8, 8, 8, 8, 8, 8, 8]
    }, {
        type: 'line',
        name: 'Line2',
        data: [4, 4, 4, 4, 4, 4, 4, 4]
    }]
}, function (chart) {

    chart.tooltip.refresh([chart.series[0].data[7], chart.series[1].data[7]]);

});
