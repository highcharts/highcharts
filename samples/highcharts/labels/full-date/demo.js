Highcharts.chart('container', {

    tooltip: {
        pointFormat: 'Value: {point.y:,.1f} mm'
    },

    xAxis: {
        type: 'datetime',
        labels: {
            format: '{value:%Y-%m-%d}',
            rotation: 45,
            align: 'left'
        }
    },

    series: [{
        data: [1029.9, 1071.5, 1106.4, 1129.2, 1144.0, 1176.0, 1135.6, 1148.5,
            1216.4, 1194.1, 1095.6, 1054.4],
        pointStart: Date.UTC(2013, 0, 1),
        pointInterval: 24 * 36e5
    }]

});
