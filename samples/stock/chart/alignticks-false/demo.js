$(function () {
    $('#container').highcharts('StockChart', {

        chart: {
            alignTicks: false
        },

        yAxis: [{
            title: {
                text: 'GOOGL'
            }
        }, {
            title: {
                text: 'MSFT'
            },
            gridLineWidth: 0
        }],

        rangeSelector: {
            selected: 1
        },

        series: [{
            name: 'GOOGL',
            data: GOOGL
        }, {
            name: 'MSFT',
            data: MSFT,
            yAxis: 1
        }]
    });
});