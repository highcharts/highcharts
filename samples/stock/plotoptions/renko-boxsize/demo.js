(async () => {
    const linearData = await fetch(
        'https://www.highcharts.com/samples/data/aapl-c.json'
    ).then(response => response.json());

    Highcharts.stockChart('container', {
        rangeSelector: {
            selected: 1
        },
        series: [
            {
                boxSize: 6,
                type: 'renko',
                yAxis: 0,
                data: linearData
            }
        ]
    });
})();
