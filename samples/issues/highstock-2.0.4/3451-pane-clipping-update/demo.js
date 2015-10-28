$(function () {

    // Create the chart
    $('#container').highcharts('StockChart', {
        chart: {
            width: 400,
            height: 300,
            animation: false
        },

        title: {
            text: 'Wrong clipping after resize'
        },

        rangeSelector : {
            selected : 1
        },

        series : [{
            animation: false,
            name : 'AAPL',
            type: 'area',
            data : [1,2,3,3,4,5,5,6,5,4,3,4,3,2],
            pointStart: Date.UTC(2014, 0, 1),
            pointInterval: 24 * 36e5,
            tooltip: {
                valueDecimals: 2
            }
        }]
    });

    $('#setsize').click(function () {
        $('#container').highcharts().setSize(500,300);
    });

});
