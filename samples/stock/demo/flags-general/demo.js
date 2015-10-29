$(function () {
    $.getJSON('https://www.highcharts.com/samples/data/jsonp.php?filename=usdeur.json&callback=?', function (data) {

        // Create the chart
        $('#container').highcharts('StockChart', {


            rangeSelector : {
                selected : 0
            },

            title : {
                text : 'USD to EUR exchange rate'
            },

            tooltip: {
                style: {
                    width: '200px'
                },
                valueDecimals: 4,
                shared : true
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

            // the event marker flags
            }, {
                type : 'flags',
                data : [{
                    x : Date.UTC(2015, 5, 8),
                    title : 'C',
                    text : 'Stocks fall on Greece, rate concerns; US dollar dips'
                }, {
                    x : Date.UTC(2015, 5, 12),
                    title : 'D',
                    text : 'Zimbabwe ditches \'worthless\' currency for the US dollar '
                }, {
                    x : Date.UTC(2015, 5, 19),
                    title : 'E',
                    text : 'US Dollar Declines Over the Week on Rate Timeline'
                }, {
                    x : Date.UTC(2015, 5, 26),
                    title : 'F',
                    text : 'Greek Negotiations Take Sharp Turn for Worse, US Dollar set to Rally '
                }, {
                    x : Date.UTC(2015, 5, 29),
                    title : 'G',
                    text : 'Euro records stunning reversal against dollar'
                }, {
                    x : Date.UTC(2015, 5, 30),
                    title : 'H',
                    text : 'Surging US dollar curbs global IT spend'
                }],
                onSeries : 'dataseries',
                shape : 'circlepin',
                width : 16
            }]
        });
    });
});
