$(function () {
    var data = [];

    for (var i = 0; i < 100; i++) {
        data[i] = i;
    }

    $('#container').highcharts('StockChart', {
        series: [{
            data: data,
            type: 'flags',

            dataGrouping: {
                enabled: true,
                groupPixelWidth: 10,
                units: [
                    ['second', 86400]
                ]
            }
        }]
    });
});