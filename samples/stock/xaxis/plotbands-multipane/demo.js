$(function () {
    $('#container').highcharts('StockChart', {
        xAxis: {
            plotBands: [{
                color: '#eeeeee',
                from: 2,
                to: 3
            }]
        },
        yAxis: [
            {
                height: '50%'
            },
            {
                height: '45%',
                top: '55%',
                offset: 0
            }
        ],

        series: [
            {
                yAxis: 0,
                data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]
            },
            {
                yAxis: 1,
                data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]
            }
        ]
    });
});