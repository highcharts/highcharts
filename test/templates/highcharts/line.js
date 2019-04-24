TestTemplate.register('highcharts/line', Highcharts.chart, {

    chart: {
        type: 'line'
    },

    title: {
        text: 'template/highcharts/line'
    },

    series: [{
        type: 'line',
        data: [1, 3, 2]
    }]

});
