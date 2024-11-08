Highcharts.chart('container', {
    chart: {
        type: 'xrange'
    },
    title: {
        text: 'Highcharts X-range series'
    },
    xAxis: {
        type: 'datetime'
    },
    yAxis: {
        title: '',
        categories: ['Prototyping', 'Development', 'Testing'],
        reversed: true,
        staticScale: 50
    },
    plotOptions: {
        series: {
            dataLabels: {
                enabled: true
            }
        }
    },
    series: [{
        name: 'Project 1',
        data: [{
            x: '2024-12-01',
            x2: '2024-12-02',
            partialFill: 0.95,
            y: 0
        }, {
            x: '2024-12-02',
            x2: '2024-12-05',
            partialFill: 0.5,
            y: 1
        }, {
            x: '2024-12-08',
            x2: '2024-12-09',
            partialFill: 0.15,
            y: 2
        }, {
            x: '2024-12-09',
            x2: '2024-12-19',
            partialFill: {
                amount: 0.3,
                fill: '#fa0'
            },
            y: 1
        }, {
            x: '2024-12-10',
            x2: '2024-12-23',
            y: 2
        }]
    }]

});
