$.getJSON('https://www.highcharts.com/samples/data/aapl-c.json', function (data) {
    // Create the chart
    Highcharts.stockChart('container', {

        plotOptions: {
            series: {
                compare: 'percent'
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
            name: 'SMA',
            linkedTo: 'main',
            compareToMain: true
        }]

    });
});