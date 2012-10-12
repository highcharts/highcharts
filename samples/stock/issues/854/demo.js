$(function () {
    var chart = new Highcharts.StockChart({
        chart: {
            renderTo: 'container'
        },
        rangeSelector: {
            enabled: false
        },
        title: {
            text: 'Chart with no series option and no data'
        }
    });
 });