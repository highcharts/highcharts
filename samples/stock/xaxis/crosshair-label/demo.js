$(function () {

    $.getJSON('http://www.highcharts.com/samples/data/jsonp.php?filename=aapl-c.json&callback=?', function (data) {
        // Create the chart
        $('#container').highcharts('StockChart', {

            chart: {
                marginRight: 50
            },
            rangeSelector : {
                selected : 1
            },

            title : {
                text : 'AAPL Stock Price'
            },

            xAxis: {
                crosshair: {
                    label: {
                        enabled: true,
                        padding: 8
                    }
                }
            },

            yAxis: {
                opposite: true,
                crosshair: {
                    label: {
                        enabled: true,
                        format: '{value:.2f}'
                    }
                },
                labels: {
                    align: 'left',
                    format: '{value:.2f}',
                    y: 6,
                    x: 2
                }
            },

            series : [{
                name : 'AAPL',
                data : data,
                tooltip: {
                    valueDecimals: 2
                }
            }]
        });
    });

});
