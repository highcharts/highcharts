TestTemplate.register('highcharts/columnrange', Highcharts.chart, {

    chart: {
        type: 'columnrange'
    },

    title: {
        text: 'template/highcharts/columnrange'
    },

    series: [{
        type: 'columnrange',
        data: [[0, 1], [2, 3], [1, 2]]
    }]

});
