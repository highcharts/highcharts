$(function () {
    $('#container').highcharts('StockChart', {

        navigator: {
            series: {
                data: ADBE
            }
        },

        rangeSelector: {
            selected: 1
        },

        series: [{
            name: 'MSFT',
            data: MSFT
        }]
    });
});