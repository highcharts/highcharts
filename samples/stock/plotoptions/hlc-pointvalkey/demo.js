Highcharts.chart('container', {
    chart: {
        type: 'hlc'
    },

    title: {
        text: 'Possible values for pointValKey'
    },

    plotOptions: {
        series: {
            dataLabels: {
                enabled: true,
                borderRadius: 5,
                backgroundColor: '#bada5555',
                borderWidth: 1,
                borderColor: '#AAA',
                format: '{point.series.name}',
                padding: 5
            },
            grouping: false
        }
    },

    xAxis: {
        categories: ['on high', 'on low', 'on close (default)']
    },

    series: [{
        name: 'high',
        pointValKey: 'high',
        data: [{
            x: 1,
            high: 50,
            low: 10,
            close: 30
        }]
    }, {
        name: 'low',
        pointValKey: 'low',
        data: [{
            x: 2,
            high: 50,
            low: 10,
            close: 30
        }]
    }, {
        name: 'close',
        pointValKey: 'close', // default
        data: [{
            x: 3,
            high: 50,
            low: 10,
            close: 30
        }]
    }]
});
