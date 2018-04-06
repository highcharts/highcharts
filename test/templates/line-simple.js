/* global ChartTemplate, Highcharts */

ChartTemplate.registerTemplate(
    new ChartTemplate('line-simple', Highcharts.chart, {

        chart: {
            type: 'line'
        },

        title: {
            text: 'line-simple'
        },

        series: [{
            data: [1, 3, 2]
        }]

    })
);
