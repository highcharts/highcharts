(async () => {
    const linearData = await fetch(
        'https://www.highcharts.com/samples/data/aapl-c.json'
    ).then(response => response.json());

    Highcharts.stockChart('container', {
        rangeSelector: {
            selected: 1
        },
        title: {
            text: 'AAPL Stock Price on Renko chart'
        },
        navigator: {
            enabled: false
        },
        series: [
            {
                animation: false,
                name: 'AAPL',
                type: 'renko',
                data: linearData
            }
        ]
    });
})();
