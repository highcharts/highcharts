Highcharts.chart('container', {
    chart: {
        type: 'variablepie'
    },
    title: {
        text: 'Example of minPointSize and maxPointSize.'
    },
    series: [{
        minPointSize: 2,
        maxPointSize: 200,
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
