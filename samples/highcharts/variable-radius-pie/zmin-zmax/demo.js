Highcharts.chart('container', {
    chart: {
        type: 'variablepie'
    },
    title: {
        text: 'Series limited by both zMin and zMax.'
    },
    series: [{
        minPointSize: 100,
        innerSize: '20%',
        zMin: 5,
        zMax: 10,
        data: [{
            y: 505370,
            z: 1
        }, {
            y: 551500,
            z: 2
        }, {
            y: 312685,
            z: 4
        }, {
            y: 78867,
            z: 8
        }, {
            y: 301340,
            z: 9
        }, {
            y: 41277,
            z: 21
        }, {
            y: 357022,
            z: 22
        }]
    }]
});
