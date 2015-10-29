$(function () {
    $.getJSON('https://www.highcharts.com/samples/data/jsonp.php?filename=usdeur.json&callback=?', function (data) {

        // Create the chart
        $('#container').highcharts('StockChart', {


            rangeSelector : {
                selected : 1
            },

            title : {
                text : 'Issue in v1.3.6 caused last flag not to appear'
            },

            tooltip: {
                style: {
                    width: '200px'
                },
                valueDecimals: 4
            },

            yAxis : {
                title : {
                    text : 'Exchange rate'
                }
            },

            series : [{
                name : 'USD to EUR',
                data : data,
                id : 'dataseries'
            },
            // the event marker flags
            {
                type : 'flags',
                data : [{
                    x : Date.UTC(2011, 4, 10),
                    title : 'B',
                    text : 'EURUSD: Bearish Trend Change on Tap?'
                }],
                onSeries : 'dataseries',
                shape : 'circlepin',
                width : 16
            }]
        });
    });
});
