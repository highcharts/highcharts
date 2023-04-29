Highcharts.chart('container', {

    _chart: {
        marginTop: 50,
        marginBottom: 50,
        marginLeft: 50,
        marginRight: 50
    },

    title: {
        text: 'Centered axes'
    },

    xAxis: {
        gridLineWidth: 1,
        min: -5,
        max: 5,
        tickInterval: 1,
        lineColor: 'black',
        offset: '-50%',
        labels: {
            reserveSpace: false
        }
    },
    yAxis: {
        min: -5,
        max: 5,
        tickInterval: 1,
        lineWidth: 1,
        lineColor: 'black',
        offset: '-50%',
        labels: {
            reserveSpace: false
        },
        title: {
            text: null
        }
    },

    series: [{
        data: [
            [-3, 3],
            [-2, 2],
            [-1, 1],
            [0, 0],
            [1, 1],
            [2, 2],
            [3, 3]

        ]
    }]

});