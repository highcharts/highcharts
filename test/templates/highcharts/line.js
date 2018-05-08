TestTemplate.register('highcharts/line', Highcharts.chart, {

    chart: {
        type: 'line'
    },

    title: {
        text: 'template/highcharts/line'
    },

    series: [{
        data: [1, 3, 2]
    }]

});
