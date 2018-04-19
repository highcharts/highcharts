/* global ChartTemplate, Highcharts */

ChartTemplate.register('stock-line', Highcharts.stockChart, {

    chart: {
        type: 'line'
    },

    title: {
        text: 'stock-line'
    },

    series: [{
        data: [1, 3, 2]
    }]

});
