$(function () {
    Highcharts.stockChart('container', {

        rangeSelector: {
            selected: 1
        },

        legend: {
            enabled: true,
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'top',
            y: 100
        },

        series: [{
            name: 'ADBE',
            data: ADBE
        }, {
            name: 'MSFT',
            data: MSFT,
            visible: false
        }]
    });
});