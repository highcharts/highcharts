$(function () {
    Highcharts.stockChart('container', {

        plotOptions: {
            series: {
                marker: {
                    enabled: true
                }
            }
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