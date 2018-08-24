TestTemplate.register('highcharts/scatter', Highcharts.chart, {

    chart: {
        type: 'scatter'
    },

    title: {
        text: 'template/highcharts/scatter'
    },

    xAxis: {
        min: 1,
        max: 4
    },

    yAxis: {
        min: 1,
        max: 4
    },

    series: [{
        data: [[2, 2], [2, 3], [3, 2], [3, 3]]
    }]

});
