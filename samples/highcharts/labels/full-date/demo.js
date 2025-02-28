Highcharts.chart('container', {

    title: {
        text: 'Date labels'
    },

    tooltip: {
        pointFormat: 'Value: {point.y:,.1f} mm'
    },

    xAxis: [{
        type: 'datetime',
        labels: {
            format: '{value:%Y-%m-%d}',
            rotation: 45,
            align: 'left'
        },
        title: {
            text: 'ISO date format'
        }
    }, {
        type: 'datetime',
        labels: {
            format: '{value:%[Ymd]}',
            rotation: 45,
            align: 'right'
        },
        linkedTo: 0,
        opposite: true,
        title: {
            text: 'Locale-aware date format'
        }
    }],

    series: [{
        data: [
            1029.9, 1071.5, 1106.4, 1129.2, 1144.0, 1176.0, 1135.6, 1148.5,
            1216.4, 1194.1, 1095.6, 1054.4
        ],
        pointStart: '2013-01-01',
        pointInterval: 24 * 36e5,
        showInLegend: false
    }]

});
