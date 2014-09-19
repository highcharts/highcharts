$(function () {
           // create the chart
    $('#container').highcharts('StockChart', {

        chart: {
            animation: false
        },

        title: {
            text: 'AAPL Historical'
        },

        yAxis: [{
            title: {
                text: 'OHLC'
            },
            height: 50,
            lineWidth: 2,
            id: 'primary'
        }],

        series: [{
            animation: false,
            type: 'line',
            name: 'AAPL',
            data: [1,4,2,3]
        }]
    }, function (chart) {

        chart.addAxis({
            id: 'secondary',
            offset: 0,
            height: 150,
            top: 150,
            min: 0,
            max: 100,
            lineWidth: 2
        });

    });
});