$(function () {
    Highcharts.stockChart('container', {

        title: {
            text: 'Data grouping on plotOptions.series. Should group to weeks'
        },

        tooltip: {
            valueDecimals: 4
        },

        rangeSelector: {
            selected: 4
        },

        plotOptions: {
            series: {
                marker: {
                    enabled: true
                },
                dataGrouping: {
                    groupPixelWidth: 10
                }
            }
        },

        series: [{
            name: 'ADBE',
            data: ADBE
        }]
    });
});