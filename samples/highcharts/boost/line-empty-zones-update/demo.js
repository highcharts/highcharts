Highcharts.chart('container', {
    boost: {
        enabled: true,
        seriesThreshold: 1
    },
    series: [{
        data: [-10, -5, 0, 5, 10, 15, 10, 10, 5, 0, -5],
        zoneAxis: 'x'
    }]
});

Highcharts.charts[0].series[0].update({
    zones: []
});
