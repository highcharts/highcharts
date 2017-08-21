Highcharts.chart('container', {
    chart: {
        type: 'xrange'
    },
    title: {
        text: 'Highcharts X-range'
    },
    xAxis: {
        type: 'datetime',
        min: Date.UTC(2014, 11, 3)
    },
    yAxis: {
        title: '',
        categories: ['Prototyping', 'Development', 'Testing'],
        reversed: true
    },
    series: [{
        name: 'Project 1',
        // pointPadding: 0,
        // groupPadding: 0,
        borderRadius: 5,
        pointWidth: 10,
        data: [{
            x: Date.UTC(2014, 11, 1),
            x2: Date.UTC(2014, 11, 2),
            y: 0
        }, {
            x: Date.UTC(2014, 11, 2),
            x2: Date.UTC(2014, 11, 5),
            y: 1
        }, {
            x: Date.UTC(2014, 11, 8),
            x2: Date.UTC(2014, 11, 9),
            y: 2
        }, {
            x: Date.UTC(2014, 11, 9),
            x2: Date.UTC(2014, 11, 19),
            y: 1
        }, {
            x: Date.UTC(2014, 11, 10),
            x2: Date.UTC(2014, 11, 23),
            y: 2
        }]
    }]

});