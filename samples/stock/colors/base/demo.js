$(function () {
    Highcharts.setOptions({
        colors: ['green', 'blue']
    });
    $('#container').highcharts('StockChart', {

        rangeSelector: {
            selected: 1
        },

        series: [{
            name: 'ADBE',
            data: ADBE
        }, {
            name: 'MSFT',
            data: MSFT
        }]
    });
});