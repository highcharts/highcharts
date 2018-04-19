/* global ChartTemplate, Highcharts */

ChartTemplate.register('columnrange-simple', Highcharts.chart, {

    chart: {
        type: 'columnrange'
    },

    title: {
        text: 'columnrange-simple'
    },

    series: [{
        data: [{
            min: 0,
            max: 1
        }, {
            min: 3,
            max: 4
        }, {
            min: 1,
            max: 2
        }]
    }]

});
