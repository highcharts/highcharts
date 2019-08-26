TestTemplate.register('highcharts/bar', Highcharts.chart, {

    chart: {
        type: 'bar'
    },

    title: {
        text: 'template/highcharts/bar'
    },

    series: [{
        type: 'bar',
        data: [1, 3, 2]
    }]

});
