$(function () {
    $('#container').highcharts('StockChart', {
        rangeSelector: {
            enabled: false
        },
        title: {
            text: 'Chart with no series option and no data'
        }
    });
});