/* global ChartTemplate, Highcharts */

ChartTemplate.register('pie-simple', Highcharts.chart, {

    chart: {
        type: 'pie'
    },

    title: {
        text: 'pie-simple'
    },

    series: [{
        data: [1, 3, 2]
    }]

});
