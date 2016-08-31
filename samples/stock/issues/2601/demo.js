$(function () {
    var price = [
        [1369412100000, 10],
        [1369671300000, 15],
        [1369671300000, 20],
        [1369844100000, 5]
    ];

    var chart = Highcharts.StockChart({
        chart: {
            renderTo: 'container',
            zoomType: 'x'
        },
        title: {
            text: 'In Highstock <= 1.3.9, comparing against an empty series would fail'
        },
        series: [{
            type: 'line',
            name: 'Price',
            data: price,
            compare: 'value'
        }, {
            type: 'line',
            name: 'test',
            data: [],
            compare: 'value'
        }]
    });

});