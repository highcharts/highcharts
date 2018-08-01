TestTemplate.register('highcharts/column', Highcharts.chart, {

    chart: {
        type: 'column'
    },

    title: {
        text: 'template/highcharts/column'
    },

    series: [{
        data: [1, 3, 2]
    }]

});
