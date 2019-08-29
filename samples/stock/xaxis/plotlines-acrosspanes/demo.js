Highcharts.stockChart('container', {
    series: [{
        data: [1, 2, 3, 4]
    }, {
        data: [1, 2, 3, 4],
        yAxis: 1,
        xAxis: 1
    }],
    yAxis: [{
        height: '50%'
    }, {
        height: '50%',
        top: '50%'
    }],
    xAxis: [{
        tickLength: 0,
        lineWidth: 1,
        labels: {
            enabled: false
        },
        plotLines: [{
            value: 0.75,
            width: 1,
            color: '#000000',
            acrossPanes: false,
            label: {
                text: 'Top pane'
            }
        }, {
            value: 1.5,
            width: 1,
            color: '#000000',
            label: {
                text: 'Both panes'
            }
        }],
        height: '50%'
    }, {
        top: '50%',
        height: '50%',
        plotLines: [{
            value: 2.25,
            width: 1,
            color: '#000000',
            acrossPanes: false,
            label: {
                text: 'Bottom pane'
            }
        }]
    }]
});
