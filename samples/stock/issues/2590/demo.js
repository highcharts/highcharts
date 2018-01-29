

$.getJSON('https://cdn.rawgit.com/highcharts/highcharts/v6.0.4/samples/data/aapl-c.json', function (data) {
    // Create the chart
    Highcharts.stockChart('container', {


        rangeSelector: {
            selected: 1
        },

        title: {
            text: 'Chart.pan failed in Highstock 1.3.8'
        },

        series: [{
            name: 'AAPL',
            data: data,
            tooltip: {
                valueDecimals: 2
            }
        }]
    });
});

