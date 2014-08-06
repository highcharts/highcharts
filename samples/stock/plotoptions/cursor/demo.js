$(function () {
    $('#container').highcharts('StockChart', {

        plotOptions: {
            series: {
                cursor: 'pointer',
                events: {
                    click: function () {
                        alert('You just clicked the graph');
                    }
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