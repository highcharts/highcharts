TestTemplate.register('highcharts/scatter', Highcharts.chart, {

    chart: {
        type: 'scatter'
    },

    title: {
        text: 'template/highcharts/scatter'
    },

    xAxis: {
        min: 0,
        max: 3
    },

    yAxis: {
        min: 0,
        max: 3
    },

    series: [{
        data: [[1, 1], [1, 2], [2, 1], [2, 2]]
    }]

});
