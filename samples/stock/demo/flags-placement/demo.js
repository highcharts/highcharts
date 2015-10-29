$(function () {
    $.getJSON('https://www.highcharts.com/samples/data/jsonp.php?filename=usdeur.json&callback=?', function (data) {

        var lastDate = data[data.length - 1][0],  // Get year of last data point
            days = 24 * 36e5; // Milliseconds in a day

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
                    x: lastDate - 60 * days,
                    title: 'On series'
                }, {
                    x: lastDate - 30 * days,
                    title: 'On series'
                }],
                onSeries: 'dataseries',
                shape: 'squarepin'
            }, {
                type: 'flags',
                name: 'Flags on axis',
                data: [{
                    x: lastDate - 45 * days,
                    title: 'On axis'
                }, {
                    x: lastDate - 15 * days,
                    title: 'On axis'
                }],
                shape: 'squarepin'
            }]
        });
    });
});