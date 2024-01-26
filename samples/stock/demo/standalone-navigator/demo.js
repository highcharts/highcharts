(async () => {

    const data = await fetch(
        'https://demo-live-data.highcharts.com/aapl-ohlcv.json'
    ).then(response => response.json());

    // split the data set into price and volume
    const price = [],
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
        price.push([
            data[i][0], // the date
            data[i][1] // the price
        ]);

        volume.push([
            data[i][0], // the date
            data[i][5] // the volume
        ]);
    }
    // create the standalone navigator
    const nav = Highcharts.navigator('navigator-container', {
        series: [{
            data: price
        }]
    });

    const baseConfing = {
        plotOptions: {
            series: {
                dataGrouping: {
                    units: groupingUnits
                }
            }
        },
        navigator: {
            enabled: false
        },
        rangeSelector: {
            enabled: false
        },
        scrollbar: {
            enabled: false
        }
    };

    // create charts
    const priceChart = Highcharts.stockChart('price-chart', {
        ...baseConfing,
        chart: {
            panKey: 'shift',
            zooming: {
                type: 'x'
            }
        },
        series: [{
            name: 'AAPL',
            data: price
        }]
    });

    const volumeChart = Highcharts.stockChart('volume-chart', {
        ...baseConfing,
        series: [{
            type: 'column',
            name: 'Volume',
            data: volume
        }]
    });

    // bind charts to the standalone navigator
    nav.bind(priceChart);
    nav.bind(volumeChart);
})();