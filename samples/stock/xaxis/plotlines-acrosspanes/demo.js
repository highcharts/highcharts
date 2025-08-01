Highcharts.stockChart('container', {
    plotOptions: {
        series: {
            pointStart: '2025-07-30',
            pointIntervalUnit: 'day'
        }
    },
    series: [{
        data: [1, 3, 2, 4, 3]
    }, {
        data: [4, 2, 3, 1, 3],
        yAxis: 1,
        xAxis: 1
    }],
    yAxis: [{
        height: '48%',
        lineWidth: 1
    }, {
        height: '48%',
        lineWidth: 1,
        top: '52%'
    }],
    xAxis: [{
        tickLength: 0,
        lineWidth: 1,
        labels: {
            enabled: false
        },
        plotLines: [{
            value: '2025-07-31',
            width: 1,
            color: '#000000',
            acrossPanes: false,
            label: {
                text: 'Top pane'
            }
        }, {
            value: '2025-08-01',
            width: 1,
            color: '#000000',
            label: {
                text: 'Both panes'
            }
        }],
        height: '48%'
    }, {
        top: '52%',
        height: '48%',
        plotLines: [{
            value: '2025-08-02',
            width: 1,
            color: '#000000',
            acrossPanes: false,
            label: {
                text: 'Bottom pane'
            }
        }]
    }]
});
