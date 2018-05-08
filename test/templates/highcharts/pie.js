TestTemplate.register('highcharts/pie', Highcharts.chart, {

    chart: {
        type: 'pie'
    },

    title: {
        text: 'template/highcharts/pie'
    },

    series: [{
        data: [1, 3, 2]
    }]

});
