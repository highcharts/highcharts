(async () => {

    const json = await fetch(
        'https://www.highcharts.com/samples/data/morningstar/magnum-ice-cream-company-ohlcv.json'
    ).then(r => r.json());

    const rawData = json.ts.results[0].data;

    const ohlc = [];
    const volume = [];

    for (let i = rawData.length - 1; i >= 0; i--) {
        const entry = rawData[i],
            parts = entry['Date Received (GMT)'].split('-'),
            ts = `${parts[2]}-${parts[1]}-${parts[0]}`;

        ohlc.push([
            ts,
            +entry['Open price'],
            +entry['High price'],
            +entry['Low price'],
            +entry['Last price']
        ]);

        volume.push([ts, +entry['Cumulative volume']]);
    }

    Highcharts.stockChart('container', {
        title: {
            text: 'The Magnum Ice Cream Company (MICC)'
        },

        subtitle: {
            text: 'Source: Morningstar'
        },

        rangeSelector: {
            selected: 1,
            buttons: [{
                type: 'month',
                count: 1,
                text: '1m',
                title: 'View 1 month'
            }, {
                type: 'month',
                count: 3,
                text: '3m',
                title: 'View 3 months'
            }, {
                type: 'ytd',
                text: 'YTD',
                title: 'View year to date'
            }, {
                type: 'all',
                text: 'All',
                title: 'View all'
            }]
        },

        yAxis: [{
            labels: {
                x: -3
            },
            title: {
                text: 'OHLC'
            },
            height: '65%',
            lineWidth: 2
        }, {
            labels: {
                align: 'right',
                x: -3
            },
            title: {
                text: 'Volume'
            },
            top: '70%',
            height: '30%',
            offset: 0,
            lineWidth: 2
        }],

        series: [{
            type: 'candlestick',
            name: 'MICC',
            data: ohlc
        }, {
            type: 'column',
            name: 'Volume',
            data: volume,
            yAxis: 1
        }]
    });

})();
