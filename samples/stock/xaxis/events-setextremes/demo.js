$(function () {
    $('#container').highcharts('StockChart', {
        xAxis: {
            events: {
                setExtremes: function (e) {
                    $('#report').html('<b>Set extremes:</b> e.min: ' + Highcharts.dateFormat(null, e.min) +
                        ' | e.max: ' + Highcharts.dateFormat(null, e.max) + ' | e.trigger: ' + e.trigger);
                }
            }
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