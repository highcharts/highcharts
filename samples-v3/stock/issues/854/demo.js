$(function () {
    $('#container').highcharts('StockChart', {
        chart: {
        },
        rangeSelector: {
            enabled: false
        },
        title: {
            text: 'Chart with no series option and no data'
        }
    });
 });