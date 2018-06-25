
$.getJSON('https://www.highcharts.com/samples/data/aapl-v.json', function (data) {

    // create the chart
    Highcharts.stockChart('container', {
        chart: {
            alignTicks: false
        },

        rangeSelector: {
            selected: 1
        },

        title: {
            text: 'AAPL Stock Volume'
        },

        series: [{
            type: 'column',
            name: 'AAPL Stock Volume',
            data: data,
            dataGrouping: {
                units: [[
                    'week', // unit name
                    [1] // allowed multiples
                ], [
                    'month',
                    [1, 2, 3, 4, 6]
                ]]
            }
        }]
    });
});