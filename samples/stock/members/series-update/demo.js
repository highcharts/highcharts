Highcharts.getJSON('https://demo-live-data.highcharts.com/aapl-ohlc.json', function (data) {

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
    var chart = Highcharts.stockChart('container', {


        rangeSelector: {
            selected: 1
        },

        title: {
            text: 'AAPL Stock Price'
        },

        series: [{
            name: 'AAPL Stock Price',
            data: data,
            threshold: null,
            turboThreshold: 2000 // to accept point object configuration
        }]
    });

    var enableMarkers = true,
        color = false;

    // Toggle point markers
    document.getElementById('markers').addEventListener('click', function () {
        chart.series[0].update({
            marker: {
                enabled: enableMarkers
            }
        });
        enableMarkers = !enableMarkers;
    });

    // Toggle point markers
    document.getElementById('color').addEventListener('click', function () {
        chart.series[0].update({
            color: color ? null : Highcharts.getOptions().colors[1]
        });
        color = !color;
    });

    // Set type
    ['line', 'spline', 'area', 'areaspline', 'arearange', 'columnrange', 'candlestick', 'ohlc'].forEach(function (type) {
        document.getElementById(type).addEventListener('click', function () {
            chart.series[0].update({
                type: type
            });
        });
    });
});
