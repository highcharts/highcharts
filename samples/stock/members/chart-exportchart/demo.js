$(function () {
    $('#container').highcharts('StockChart', {

        rangeSelector: {
            selected: 1,
            inputBoxStyle: {
                right: '80px'
            }
        },

        series: [{
            name: 'USD to EUR',
            data: usdeur
        }],

        exporting: {
            chartOptions: {
                chart: {
                    width: 1024,
                    height: 768
                }
            }
        }
    });

    $('#button').click(function () {
        var chart = $('#container').highcharts();
        chart.exportChart();
    });
});