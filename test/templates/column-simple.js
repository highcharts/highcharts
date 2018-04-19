/* global ChartTemplate, Highcharts */

ChartTemplate.register('column-simple', Highcharts.chart, {

    chart: {
        type: 'column'
    },

    title: {
        text: 'column-simple'
    },

    series: [{
        data: [1, 3, 2]
    }]

});
