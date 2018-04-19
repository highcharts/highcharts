/* global ChartTemplate, Highcharts */

ChartTemplate.register('line-stock', Highcharts.stock, {

    chart: {
        type: 'line'
    },

    title: {
        text: 'line-stock'
    },

    series: [{
        data: [1, 3, 2]
    }]

});
