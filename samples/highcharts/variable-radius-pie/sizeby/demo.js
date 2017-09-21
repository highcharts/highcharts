Highcharts.chart('container', {
    chart: {
        type: 'variablepie'
    },
    title: {
        text: 'Example of sizeBy option'
    },
    series: [{
        size: '50%',
        innerSize: '20%',
        center: ['25%', '50%'],
        name: 'size by radius',
        sizeBy: 'radius',
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
    },{
        size: '50%',
        innerSize: '20%',
        center: ['75%', '50%'],
        sizeBy: 'area',
        name: 'size by area',
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
