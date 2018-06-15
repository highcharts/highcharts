TestTemplate.register('highcharts/columnrange', Highcharts.chart, {

    chart: {
        type: 'columnrange'
    },

    title: {
        text: 'template/highcharts/columnrange'
    },

    series: [{
        data: [[0, 1], [2, 3], [1, 2]]
    }]

});
