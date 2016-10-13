$(function () {
    window.chart = new Highcharts.StockChart({
        chart: {
            renderTo: document.getElementById('container')[0]
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