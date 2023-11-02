(async () => {

    // Load the dataset
    const data = await fetch(
        'https://demo-live-data.highcharts.com/aapl-ohlc.json'
    ).then(response => response.json());

    // create the chart
    Highcharts.stockChart('container', {

        rangeSelector: {
            selected: 2
        },

        title: {
            text: 'AAPL Stock Price'
        },

        series: [{
            type: 'hlc',
            name: 'AAPL Stock Price',
            useOhlcData: true,
            data: data,
            accessibility: {
                point: {
                    valueDescriptionFormat: '{xDescription}. High: {point.high}, low: {point.low}, close: {point.close}.'
                }
            }
        }]
    });
})();