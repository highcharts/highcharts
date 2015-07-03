$(function () {
    $.getJSON('http://www.highcharts.com/samples/data/jsonp.php?filename=aapl-ohlcv.json&callback=?', function (data) {

        // split the data set into ohlc and volume
        var ohlc = [],
            volume = [],
            dataLength = data.length;

        for (i = 0; i < dataLength; i++) {
            ohlc.push([
                data[i][0], // the date
                data[i][1], // open
                data[i][2], // high
                data[i][3], // low
                data[i][4] // close
            ]);

            volume.push([
                data[i][0], // the date
                data[i][5] // the volume
            ])
        }

        // create the chart
        $('#container').highcharts('StockChart', {
            chart: {
                alignTicks: false,
                zoomType: 'y',
                events: {
                    load: function (e) {
                        e.target.yAxis[0].setExtremes(500, 550);
                    }
                }
            },

            rangeSelector: {
                selected: 2
            },

            title: {
                text: 'AAPL Historical'
            },

            xAxis: {
                maxZoom: 14 * 24 * 3600000,
            },
            yAxis: [{
                title: {
                    text: 'OHLC'
                },
                lineWidth: 2
            }],

            series: [{
                type: 'candlestick',
                name: 'AAPL',
                data: ohlc
            }]
        });
    });
});