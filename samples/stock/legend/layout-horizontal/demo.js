$(function () {
    $('#container').highcharts('StockChart', {
        title: {
            text: 'legend is horizontal by default'
        },

        legend: {
            enabled: true
        },

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