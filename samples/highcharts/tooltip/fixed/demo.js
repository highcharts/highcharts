(async () => {

    const ohlc = await fetch(
        'https://demo-live-data.highcharts.com/aapl-ohlc.json'
    ).then(response => response.json());

    const data = ohlc.map(d => [
        d[0], // the date
        d[4] // close
    ]);

    // Create the chart
    Highcharts.chart('container', {

        chart: {
            zooming: {
                type: 'x'
            }
        },

        title: {
            text: 'Fixed tooltip'
        },

        tooltip: {
            fixed: true
        },

        xAxis: {
            type: 'datetime',
            crosshair: true
        },

        series: [{
            name: 'AAPL',
            data
        }]
    });
})();
