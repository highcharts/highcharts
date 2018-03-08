
$.getJSON('https://cdn.rawgit.com/highcharts/highcharts/057b672172ccc6c08fe7dbb27fc17ebca3f5b770/samples/data/usdeur.json', function (data) {

    var lastDate = data[data.length - 1][0],  // Get year of last data point
        days = 24 * 36e5; // Milliseconds in a day

    // Create the chart
    Highcharts.stockChart('container', {

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