$(function () {
    $('#container').highcharts('StockChart', {

        legend: {
            enabled: true,
            align: 'right',
            backgroundColor: '#FCFFC5',
            borderColor: 'black',
            borderWidth: 2,
            layout: 'vertical',
            verticalAlign: 'top',
            y: 100,
            shadow: true
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