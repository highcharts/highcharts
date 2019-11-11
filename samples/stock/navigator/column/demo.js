Highcharts.getJSON('https://www.highcharts.com/samples/data/aapl-v.json', function (data) {

    Highcharts.stockChart('container', {

        rangeSelector: {
            selected: 4
        },

        navigator: {
            series: {
                type: 'column',
                pointRange: null,
                dataGrouping: {
                    groupPixelWidth: 10
                }
            }
        },

        title: {
            text: 'AAPL Stock Volume'
        },

        series: [{
            type: 'column',
            name: 'AAPL Stock Volume',
            data: data
        }]
    });
});