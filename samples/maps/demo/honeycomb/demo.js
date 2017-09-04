Highcharts.chart('container', {
    chart: {
        type: 'honeycomb'
    },

    title: {
        text: 'Honeycomb demo'
    },

    xAxis: {
        visible: false
    },

    yAxis: {
        gridLineWidth: 0,
        visible: false
    },

    plotOptions: {
        series: {
            dataLabels: {
                enabled: true,
                color: '#000000'
            },
            borderWidth: 1,
            pointPadding: 2
        }
    },

    series: [{
        data: [
            [0, 1, 1],
            [1, 3, 1],
            [2, 2, 1],
            [3, 0, 1],
            [4, 2, 1],
            [0, 2, 1],
            [1, 4, 1],
            [2, 4, 1],
            [3, 2, 1]
        ]
    }, {
        data: [
            [0, 3, 1],
            [1, 0, 1],
            [2, 0, 1],
            [3, 1, 1],
            [4, 1, 1],
            [0, 4, 1],
            [1, 2, 1],
            [2, 3, 1],
            [4, 0, 1]
        ]
    }, {
        data: [
            [0, 5, 1],
            [1, 6, 1],
            [2, 5, 1],
            [3, 6, 1],
            [4, 5, 1],
            [5, 0, 1],
            [6, 2, 1],
            [5, 4, 1],
            [6, 5, 1],
            [3, 4, 1],
            [4, 4, 1]
        ]
    }, {
        data: [
            [0, 6, 1],
            [1, 5, 1],
            [2, 6, 1],
            [3, 5, 1],
            [4, 6, 1],
            [5, 3, 1],
            [6, 1, 1],
            [6, 3, 1]
        ]
    }]
});
