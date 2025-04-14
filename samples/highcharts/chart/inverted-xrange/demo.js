Highcharts.chart('container', {
    chart: {
        type: 'xrange',
        inverted: true
    },
    title: {
        text: 'Highcharts X-range'
    },
    xAxis: {
        type: 'datetime'
    },
    yAxis: {
        title: '',
        categories: ['Prototyping', 'Development', 'Testing']
    },
    series: [{
        name: 'Project 1',
        borderRadius: 5,
        data: [{
            x: '2014-12-01',
            x2: '2014-12-02',
            y: 0
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
        }]
    }]

});