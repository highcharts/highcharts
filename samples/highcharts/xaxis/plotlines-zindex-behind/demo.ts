Highcharts.chart('container', {
    title: {
        text: 'Demo of <em>xAxis.plotLines.zIndex</em>'
    },
    subtitle: {
        text: `<em>zIndex: 0</em> → behind the grid lines<br>
            <em>zIndex: 4</em> → in front of the line graph<br>
            <em>zIndex: 9</em> → in front of the tooltip`
    },
    xAxis: {
        plotLines: [{
            color: '#44ee44',
            value: '2026-06-15',
            width: 5
        }],
        type: 'datetime'
    },
    yAxis: {
        gridLineWidth: 5
    },
    plotOptions: {
        series: {
            lineWidth: 5,
            pointIntervalUnit: 'month',
            pointStart: '2026-01-01'
        }
    },
    series: [{
        data: [
            29.9, 71.5, 106.4, 129.2, 144, 176, 135.6, 148.5, 216.4, 194.1,
            95.6, 54.4
        ]
    }]
});
