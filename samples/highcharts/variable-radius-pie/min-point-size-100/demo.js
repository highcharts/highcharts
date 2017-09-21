Highcharts.chart('container', {
    chart: {
        type: 'variablepie'
    },
    title: {
        text: 'minPointSize set to 100'
    },
    series: [{
        minPointSize: 100,
        innerSize: '20%',
        data: [{
            y: 505370,
            z: 1
        }, {
            y: 551500,
            z: 2
        }, {
            y: 312685,
            z: 1
        }, {
            y: 78867,
            z: 3
        }, {
            y: 301340,
            z: 4
        }, {
            y: 41277,
            z: 5
        }, {
            y: 357022,
            z: 5
        }]
    }]
});
