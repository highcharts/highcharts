$(function () {
    Highcharts.stockChart('container', {

        title: {
            text: 'Navigator mask is outside zoomed range'
        },

        navigator: {
            maskInside: false
        },

        rangeSelector: {
            selected: 1
        },

        series: [{
            name: 'USD to EUR',
            data: usdeur
        }]
    });
});