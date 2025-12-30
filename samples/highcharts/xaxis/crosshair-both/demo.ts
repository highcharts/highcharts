Highcharts.chart('container', {
    chart: {
        type: 'line'
    },
    series: [
        {
            data: [
                29.9, 71.5, 106.4, 129.2, 144, 176, 135.6, 148.5, 216.4, 194.1,
                95.6, 54.4
            ]
        }
    ],
    title: {
        text: 'Demo of axis <em>crosshair</em> options'
    },
    xAxis: {
        crosshair: true
    },
    yAxis: {
        crosshair: true
    }
});
