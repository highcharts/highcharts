Highcharts.chart('container', {
    chart: {
        type: 'xrange',
        styledMode: true
    },
    title: {
        text: 'Highcharts X-range'
    },
    xAxis: {
        type: 'datetime'
    },
    yAxis: {
        title: {
            text: ''
        },
        categories: ['Prototyping', 'Development', 'Testing'],
        reversed: true
    },
    series: [{
        name: 'Project 1',
        // pointPadding: 0,
        // groupPadding: 0,
        pointWidth: 20,
        data: [{
            x: '2014-11-21',
            x2: '2014-12-02',
            y: 0,
            partialFill: 0.25
        }, {
            x: '2014-12-02',
            x2: '2014-12-05',
            y: 1
        }, {
            x: '2014-12-08',
            x2: '2014-12-09',
            y: 2
        }, {
            x: '2014-12-09',
            x2: '2014-12-19',
            y: 1
        }, {
            x: '2014-12-10',
            x2: '2014-12-23',
            y: 2
        }],
        dataLabels: {
            enabled: true
        }
    }]

});