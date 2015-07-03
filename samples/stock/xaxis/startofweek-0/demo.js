$(function () {
    $('#container').highcharts('StockChart', {

        chart: {
            width: 800
        },

        xAxis: {
            dateTimeLabelFormats: {
                week: '%a,<br/>%e. %b'
            },
            startOfWeek: 0,
            tickPixelInterval: 70
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