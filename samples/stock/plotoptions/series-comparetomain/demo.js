$.getJSON('https://www.highcharts.com/samples/data/aapl-c.json', function (data) {
    // Create the chart
    Highcharts.stockChart('container', {

        legend: {
            enabled: true
        },

        plotOptions: {
            series: {
                compare: 'percent',
                showInLegend: true
            }
        },

        rangeSelector: {
            selected: 1
        },

        title: {
            text: 'AAPL Stock Price'
        },

        tooltip: {
            pointFormat: '{series.name}: {point.y} ({point.change}%)',
            valueDecimals: 2
        },

        series: [{
            name: 'AAPL',
            id: 'main',
            data: data
        }, {
            type: 'sma',
            name: 'SMA with comparing to itself',
            linkedTo: 'main',
            compareToMain: false
        }, {
            type: 'sma',
            name: 'SMA with comparing to main series',
            linkedTo: 'main',
            compareToMain: true
        }]

    });
});