Highcharts.chart('container', {
    chart: {
        type: 'variablepie'
    },
    title: {
        text: 'Example of the sizeBy option'
    },
    subtitle: {
        text: 'Left pie - sizeBy = "radius". Right pie - sizeBy = "area"'
    },
    plotOptions: {
        variablepie: {
            dataLabels: {
                enabled: false
            }
        }
    },
    series: [{
        size: '70%',
        innerSize: '20%',
        center: ['25%', '50%'],
        name: 'Size by radius',
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
    }, {
        size: '70%',
        innerSize: '20%',
        center: ['75%', '50%'],
        sizeBy: 'area',
        name: 'Size by area',
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
