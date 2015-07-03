$(function () {
    $.getJSON('http://www.highcharts.com/samples/data/jsonp.php?filename=usdeur.json&callback=?', function (data) {

        var year = new Date(data[data.length - 1][0]).getFullYear(); // Get year of last data point

        // Create the chart
        $('#container').highcharts('StockChart', {

            rangeSelector: {
                selected: 1
            },

            title: {
                text: 'USD to EUR exchange rate'
            },

            yAxis: {
                title: {
                    text: 'Exchange rate'
                }
            },

            series: [{
                name: 'USD to EUR',
                data: data,
                id: 'dataseries',
                tooltip: {
                    valueDecimals: 4
                }
            }, {
                type: 'flags',
                name: 'Flags on series',
                data: [{
                    x: Date.UTC(year, 1, 22),
                    title: 'On series'
                }, {
                    x: Date.UTC(year, 3, 28),
                    title: 'On series'
                }],
                onSeries: 'dataseries',
                shape: 'squarepin'
            }, {
                type: 'flags',
                name: 'Flags on axis',
                data: [{
                    x: Date.UTC(year, 2, 1),
                    title: 'On axis'
                }, {
                    x: Date.UTC(year, 3, 1),
                    title: 'On axis'
                }],
                shape: 'squarepin'
            }]
        });
    });
});