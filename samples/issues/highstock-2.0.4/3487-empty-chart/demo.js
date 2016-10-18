$(function () {
    $('#container').highcharts('StockChart', {
        navigator: {
            adaptToUpdatedData: false
        },
        scrollbar: {
            enabled: false
        },
        rangeSelector: {
            selected: 3
        },
        series: [{}]
    });
});