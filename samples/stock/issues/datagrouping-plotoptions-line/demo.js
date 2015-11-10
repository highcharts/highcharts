$(function () {
    $('#container').highcharts('StockChart', {

        title: {
            text: 'Data grouping on plotOptions.line. Should group to weeks'
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
                }
            },
            line: {
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