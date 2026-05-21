/**
 * The original field codes from the dataset linked to more user-friendly names
 */
const FIELD_MAP = {
    D953: 'dateReceived',
    D952: 'timeReceived',
    D502: 'tradeTime',
    D3: 'volume',
    D2: 'price',
    D4: 'bid',
    D6: 'ask'
};

/**
 * Parses a date and time string into a timestamp.
 *
 * @param dateStr A date string in the format 'DD-MM-YYYY'.
 * @param timeStr A time string in the format 'HH:MM:SS.sss'.
 *
 * @return {number} A timestamp in milliseconds.
 */
function parseTimestamp(dateStr, timeStr) {
    const [day, month, year] = dateStr.split('-').map(Number),
        [hms, msPart] = timeStr.split('.'),
        [hours, minutes, seconds] = hms.split(':').map(Number),
        ms = msPart ? Number(msPart.padEnd(3, '0').slice(0, 3)) : 0;

    return Date.UTC(year, month - 1, day, hours, minutes, seconds, ms);
}

/**
 * Loads and normalizes the dataset from the provided JSON file.
 *
 * @return {Promise<Array<object>>} Resolves to an array of normalized trade
 * rows sorted by timestamp ascending.
 */
async function loadDataset() {
    const json = await fetch(
            'https://cdn.jsdelivr.net/gh/highcharts/highcharts@6671de8/samples/data/morningstar/american-airlines-group.json'
        ).then(r => r.json()),
        rows = json.ts.results[0].data.map(record => {
            const row = {};
            // Get the user-friendly field names from the FIELD_MAP
            for (const [code, key] of Object.entries(FIELD_MAP)) {
                row[key] = record[code];
            }

            // Parse and normalize the data types
            row.timestamp = parseTimestamp(row.dateReceived, row.timeReceived);
            row.price = Number(row.price);
            row.bid = Number(row.bid);
            row.ask = Number(row.ask);
            row.volume = Number(row.volume);
            row.spread = +(row.ask - row.bid).toFixed(2);

            return row;
        });

    return rows.sort((a, b) => a.timestamp - b.timestamp);
}

/**
 * Builds a price series from the given rows.
 *
 * @param rows An array of normalized trade rows.
 *
 * @return {Object} An object containing arrays for price, bid, ask and volume
 * series.
 */
function getPriceSeries(rows) {
    const price = [],
        bid = [],
        ask = [],
        volume = [];

    for (let i = 0; i < rows.length; i++) {
        const row = rows[i],
            date = row.timestamp;

        ask.push([date, row.ask]);
        bid.push([date, row.bid]);
        price.push([date, row.price]);
        volume.push([date, row.volume]);
    }

    return { ask, bid, price, volume };
}

/**
 * Builds a trades table from the given rows.
 *
 * @param rows An array of normalized trade rows.
 *
 * @return {Object} An object containing the column IDs and data for the trades
 * table.
 */
function getTradesTable(rows) {
    const descRows = [...rows].sort((a, b) => b.timestamp - a.timestamp),
        date = [],
        time = [],
        price = [],
        volume = [],
        bid = [],
        ask = [],
        spread = [];

    for (let i = 0; i < descRows.length; i++) {
        const row = descRows[i];

        date.push(row.dateReceived);
        time.push(row.tradeTime);
        price.push(row.price);
        volume.push(row.volume);
        bid.push(row.bid);
        ask.push(row.ask);
        spread.push(row.spread);
    }

    return {
        columnIds: ['Date', 'Time', 'Price', 'Volume', 'Bid', 'Ask', 'Spread'],
        data: [date, time, price, volume, bid, ask, spread]
    };
}

/**
 * Initializes the dashboard by loading the dataset, building the price series
 * and trades table and configuring the dashboard components.
 *
 * @return {Promise<void>} A promise that resolves when the dashboard is fully
 * initialized.
 */
(async () => {
    const rows = await loadDataset(),
        series = getPriceSeries(rows),
        tradesTable = getTradesTable(rows);

    Dashboards.board('container', {
        dataPool: {
            connectors: [{
                id: 'trades',
                type: 'JSON',
                columnIds: tradesTable.columnIds,
                data: tradesTable.data,
                orientation: 'columns',
                firstRowAsNames: false
            }]
        },
        components: [{
            renderTo: 'dashboard-col-stock',
            type: 'Highcharts',
            chartConstructor: 'stockChart',
            title: 'Intraday Price & Quote (Bid/Ask) with Volume',
            chartOptions: {
                credits: {
                    enabled: false
                },
                tooltip: {
                    xDateFormat: '%H:%M:%S',
                    valueDecimals: 2
                },
                navigator: {
                    series: {
                        name: 'Navigator',
                        type: 'column',
                        data: series.volume,
                        color: '#00e272'
                    }
                },
                rangeSelector: {
                    inputEnabled: false,
                    selected: 4,
                    buttons: [{
                        type: 'minute',
                        count: 5,
                        text: '5m'
                    }, {
                        type: 'minute',
                        count: 10,
                        text: '10m'
                    }, {
                        type: 'minute',
                        count: 15,
                        text: '15m'
                    }, {
                        type: 'minute',
                        count: 30,
                        text: '30m'
                    }, {
                        type: 'all',
                        text: 'All'
                    }]
                },
                xAxis: {
                    type: 'datetime'
                },
                yAxis: [{
                    height: '60%',
                    title: {
                        text: 'Price (USD)'
                    },
                    labels: {
                        format: '${value:.2f}'
                    }
                }, {
                    top: '65%',
                    height: '35%',
                    offset: 0,
                    title: {
                        text: 'Shares (Volume)'
                    }
                }],
                series: [{
                    name: 'Ask',
                    data: series.ask,
                    color: '#2caffe'
                }, {
                    name: 'Bid',
                    data: series.bid,
                    color: '#544fc5'
                }, {
                    name: 'Price',
                    data: series.price,
                    color: '#fe6a35'
                }, {
                    name: 'Volume',
                    type: 'column',
                    data: series.volume,
                    color: '#00e272',
                    yAxis: 1,
                    tooltip: {
                        valueDecimals: 0
                    }
                }]
            }
        }, {
            renderTo: 'dashboard-col-grid',
            type: 'Grid',
            connector: {
                id: 'trades'
            },
            title: 'Recent Trades',
            gridOptions: {
                columnDefaults: {
                    cells: {
                        format: '${value:,.2f}'
                    }
                },
                columns: [{
                    id: 'Date',
                    cells: {
                        format: '{value}'
                    }
                }, {
                    id: 'Time',
                    cells: {
                        format: '{value}'
                    }
                }, {
                    id: 'Volume',
                    cells: {
                        format: '{value}'
                    }
                }]
            }
        }]
    });
})();
