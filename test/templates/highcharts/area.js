TestTemplate.register('highcharts/area', Highcharts.chart, {

    chart: {
        type: 'area'
    },

    title: {
        text: 'template/highcharts/area'
    },

    series: [{
        type: 'area',
        data: [1, 3, 2]
    }]

});
