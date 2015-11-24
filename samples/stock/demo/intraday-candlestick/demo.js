$(function () {
    $.getJSON('https://www.highcharts.com/samples/data/jsonp.php?filename=new-intraday.json&callback=?', function (data) {

        // create the chart
        $('#container').highcharts('StockChart', {


            title: {
                text: 'AAPL stock price by minute'
            },

            rangeSelector : {
                buttons : [{
                    type : 'hour',
                    count : 1,
                    text : '1h'
                }, {
                    type : 'day',
                    count : 1,
                    text : '1D'
                }, {
                    type : 'all',
                    count : 1,
                    text : 'All'
                }],
                selected : 1,
                inputEnabled : false
            },

            series : [{
                name : 'AAPL',
                type: 'candlestick',
                data : data,
                tooltip: {
                    valueDecimals: 2
                }
            }]
        });
    });
});
