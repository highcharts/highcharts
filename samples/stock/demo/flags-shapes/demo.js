$(function () {
    $.getJSON('http://www.highcharts.com/samples/data/jsonp.php?filename=usdeur.json&callback=?', function (data) {

        // Create the chart
        $('#container').highcharts('StockChart', {


            rangeSelector : {
                selected : 1
            },

            title : {
                text : 'USD to EUR exchange rate'
            },

            yAxis : {
                title : {
                    text : 'Exchange rate'
                }
            },

            series : [{
                name : 'USD to EUR',
                data : data,
                id : 'dataseries',
                tooltip : {
                    valueDecimals: 4
                }
            }, {
                type : 'flags',
                data : [{
                    x : Date.UTC(2011, 1, 22),
                    title : 'A',
                    text : 'Shape: "squarepin"'
                }, {
                    x : Date.UTC(2011, 3, 28),
                    title : 'A',
                    text : 'Shape: "squarepin"'
                }],
                onSeries : 'dataseries',
                shape : 'squarepin',
                width : 16
            }, {
                type : 'flags',
                data : [{
                    x : Date.UTC(2011, 2, 1),
                    title : 'B',
                    text : 'Shape: "circlepin"'
                }, {
                    x : Date.UTC(2011, 3, 1),
                    title : 'B',
                    text : 'Shape: "circlepin"'
                }],
                shape : 'circlepin',
                width : 16
            }, {
                type : 'flags',
                data : [{
                    x : Date.UTC(2011, 2, 10),
                    title : 'C',
                    text : 'Shape: "flag"'
                }, {
                    x : Date.UTC(2011, 3, 11),
                    title : 'C',
                    text : 'Shape: "flag"'
                }],
                color : Highcharts.getOptions().colors[0], // same as onSeries
                fillColor : Highcharts.getOptions().colors[0],
                onSeries : 'dataseries',
                width : 16,
                style : {// text style
                    color : 'white'
                },
                states : {
                    hover : {
                        fillColor : '#395C84' // darker
                    }
                }
            }]
        });
    });
});
