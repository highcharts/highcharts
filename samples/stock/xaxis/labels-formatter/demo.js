$(function () {
    $('#container').highcharts('StockChart', {

        yAxis: {
            labels: {
                formatter: function () {
                    return this.value + ' units';
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