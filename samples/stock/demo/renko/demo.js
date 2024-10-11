(async () => {
    const linearData = await fetch(
        'https://www.highcharts.com/samples/data/aapl-c.json'
    ).then(response => response.json());

    Highcharts.stockChart('container', {
        title: {
            text: 'AAPL Stock Price on Renko chart'
        },
        series: [
            {
                name: 'AAPL',
                type: 'renko',
                data: linearData
            }
        ]
    });
})();
