Highcharts.chart('container', {
    chart: {
        type: 'variablepie'
    },
    title: {
        text: 'zMin set to 5, smaller z values are treated as 5.'
    },
    series: [{
        minPointSize: 100,
        innerSize: '20%',
        zMin: 5,
        data: [{
            y: 505370,
            z: 1
        }, {
            y: 551500,
            z: 2
        }, {
            y: 312685,
            z: 3
        }, {
            y: 78867,
            z: 7
        }, {
            y: 301340,
            z: 8
        }, {
            y: 41277,
            z: 9
        }, {
            y: 357022,
            z: 10
        }]
    }]
});
