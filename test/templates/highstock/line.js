TestTemplate.register('highstock/line', Highcharts.stockChart, {

    chart: {
        type: 'line'
    },

    title: {
        text: 'template/highstock/line'
    },

    series: [{
        data: [1, 3, 2]
    }]

});
