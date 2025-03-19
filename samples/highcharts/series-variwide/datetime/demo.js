Highcharts.chart('container', {
    title: {
        text: 'Highcharts variwide series on a datetime axis'
    },
    xAxis: {
        type: 'datetime',
        min: '2018-09-21 08:49',
        max: '2018-09-21 09:10'
    },
    yAxis: [{
        type: 'datetime',
        gridLineWidth: 0,
        title: {
            text: 'Lap'
        },
        labels: {
            format: '{value:%M:%S}'
        }
    }],
    series: [{
        name: 'Lap',
        type: 'variwide',
        data: [{
            x: '2018-09-21 08:50',
            y: 3.45 * 60000,
            z: 5 * 60000
        }, {
            x: '2018-09-21 08:55',
            y: 3.25 * 60000,
            z: 10 * 60000,
            color: 'rgba(0, 255, 0, 0.2)'
        }, {
            x: '2018-09-21 09:05',
            y: 3.05 * 60000,
            z: 4 * 60000
        }],
        tooltip: {
            pointFormat: 'Pace: {point.y:%M:%S} min/km<br>Lap time: ' +
                '{point.z:%M:%S} min'
        },
        borderColor: 'black',
        color: 'rgba(0, 0, 255, 0.2)',
        pointRange: 0
    }]
});