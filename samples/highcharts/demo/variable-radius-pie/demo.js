Highcharts.chart('container', {
    chart: {
        type: 'variablepie'
    },
    title: {
        text: 'Variable - Radius Pie'
    },
    series: [{
        minPointSize: 10,
        innerSize: '20%',
        data: [{
            y: 3,
            z: 5
        }, {
            y: 2,
            z: 10
        }, {
            y: 2,
            z: 20
        }, {
            y: 4,
            z: 4
        }, {
            y: 3,
            z: 3
        }, {
            y: 2,
            z: 2
        }, {
            y: 5,
            z: 5
        }, {
            y: 3,
            z: 3
        }, {
            y: 4,
            z: 4
        }]
    }]
});