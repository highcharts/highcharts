$(function () {
    $.getJSON('http://www.highcharts.com/samples/data/jsonp.php?filename=aapl-ohlc.json&callback=?', function (data) {

        // The data point configurations are arrays on the form [x, open, high, low, close].
        // In order to make this understandable for different series types like line, column
        // and ranges, we need to transform it to objects. Single-value series types like
        // line will use the y option, ranges will use low and high, and OHLC will
        // use all.
        data = Highcharts.map(data, function (config) {
            return {
                x: config[0],
                open: config[1],
                high: config[2],
                low: config[3],
                close: config[4],
                y: config[4] // let the closing value represent the data in single-value series
            };
        });

        // create the chart
        $('#container').highcharts('StockChart', {


            rangeSelector : {
                selected : 1
            },

            title : {
                text : 'AAPL Stock Price'
            },

            series : [{
                name : 'AAPL Stock Price',
                data : data,
                threshold: null,
                turboThreshold: 2000 // to accept point object configuration
            }]
        });

        var chart = $('#container').highcharts(),
            enableMarkers = true,
            color = false;

        // Toggle point markers
        $('#markers').click(function () {
            chart.series[0].update({
                marker: {
                    enabled: enableMarkers
                }
            });
            enableMarkers = !enableMarkers;
        });

        // Toggle point markers
        $('#color').click(function () {
            chart.series[0].update({
                color: color ? null : Highcharts.getOptions().colors[1]
            });
            color = !color;
        });

        // Set type
        $.each(['line', 'spline', 'area', 'areaspline', 'arearange', 'columnrange', 'candlestick', 'ohlc'], function () {
            var type = this.toString();
            $('#' + type).click(function () {
                chart.series[0].update({
                    type: type
                });
            });
        });
    });
});