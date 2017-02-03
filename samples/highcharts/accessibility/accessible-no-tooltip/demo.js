$(function () {
    Highcharts.chart('container', {
        title: {
            text: 'Tab through chart and make sure there are no errors'
        },

        tooltip: {
            enabled: false
        },
        series: [{
            data: [74, 69.6, 63.7, 63.9, 43.7]
        }]
    });
});
