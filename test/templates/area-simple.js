/* global ChartTemplate, Highcharts */

ChartTemplate.register('area-simple', Highcharts.chart, {

    chart: {
        type: 'area'
    },

    title: {
        text: 'area-simple'
    },

    series: [{
        data: [1, 3, 2]
    }]

});
