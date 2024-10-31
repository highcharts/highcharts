(async () => {
    const data = await fetch(
        'https://demo-live-data.highcharts.com/aapl-c.json'
    ).then(response => response.json());

    Highcharts.stockChart('container', {
        chart: {
            height: 800
        },
        title: {
            text: 'Point and Figure series'
        },
        series: [
            {
                type: 'pointandfigure',
                data
            }
        ]
    });
})();