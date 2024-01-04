(async () => {

    const data = await fetch(
        'https://demo-live-data.highcharts.com/aapl-ohlcv.json'
    ).then(response => response.json());

    // split the data set into ohlc and volume
    const ohlc = [],
        volume = [],
        dataLength = data.length,
        // set the allowed units for data grouping
        groupingUnits = [[
            'week',                         // unit name
            [1]                             // allowed multiples
        ], [
            'month',
            [1, 2, 3, 4, 6]
        ]];

    for (let i = 0; i < dataLength; i += 1) {
        ohlc.push([
            data[i][0], // the date
            data[i][1], // open
            data[i][2], // high
            data[i][3], // low
            data[i][4] // close
        ]);

        volume.push([
            data[i][0], // the date
            data[i][5] // the volume
        ]);
    }
    // create the standalone navigator
    const nav = Highcharts.navigator('navigator-container', {
        series: [{
            data: ohlc
        }]
    });

    // create charts
    // const priceChart = Highcharts.chart('price-chart', {
    //     navigator: {
    //         enabled: false
    //     },
    //     series: [{
    //         name: 'AAPL',
    //         data: ohlc,
    //     }]
    // });

    // const volumeChart = Highcharts.chart('volume-chart', {
    //     navigator: {
    //         enabled: false
    //     },
    //     series: [{
    //         type: 'column',
    //         name: 'Volume',
    //         data: volume,
    //     }]
    // });

    // // bind charts to the standalone navigator
    // nav.bind(priceChart);
    // nav.bind(volumeChart);

})();