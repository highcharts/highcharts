const report = document.getElementById('report');

Highcharts.chart('container', {
    xAxis: {
        plotLines: [{ // mark the weekend
            color: 'red',
            width: 2,
            value: '2010-01-04',
            events: {
                click: () => {
                    report.innerHTML = 'click';
                },
                mouseover: () => {
                    report.innerHTML = 'mouseover';
                },
                mouseout: () => {
                    report.innerHTML = 'mouseout';
                }
            }
        }],
        tickInterval: 24 * 3600 * 1000,
        // one day
        type: 'datetime'
    },
    series: [{
        data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4],
        pointStart: '2010-01-01',
        pointInterval: 24 * 3600 * 1000
    }]
});