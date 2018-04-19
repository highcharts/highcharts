/* global ChartTemplate, Highcharts */

ChartTemplate.register('columnrange-simple', Highcharts.chart, {

    chart: {
        type: 'columnrange'
    },

    title: {
        text: 'columnrange-simple'
    },

    series: [{
        data: [[0, 1], [2, 3], [1, 2]]
    }]

});
