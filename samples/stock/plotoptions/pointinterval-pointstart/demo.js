$(function () {
    $('#container').highcharts('StockChart', {

        title: {
            text: 'Start at the first of April'
        },

        rangeSelector: {
            selected: 1
        },

        series: [{
            name: 'Temperature',
            data: temperatures,
            pointStart: Date.UTC(2004, 3, 1), // first of April
            pointInterval: 3600 * 1000, // hourly data
            tooltip: {
                valueDecimals: 1,
                valueSuffix: '°C'
            }
        }]
    });
});