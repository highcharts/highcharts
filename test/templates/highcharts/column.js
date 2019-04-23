TestTemplate.register('highcharts/column', Highcharts.chart, {

    chart: {
        type: 'column'
    },

    title: {
        text: 'template/highcharts/column'
    },

    series: [{
        type: 'column',
        data: [1, 3, 2]
    }]

});
