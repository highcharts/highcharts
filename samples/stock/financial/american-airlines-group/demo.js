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
            row.dateReceived = row.dateReceived.split('-').reverse().join('-');
            row.timestamp = new Date(
                row.dateReceived + 'T' + row.timeReceived + 'Z'
            ).getTime();
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
 * @return {Object} An object containing arrays for price, spread (bid/ask
 * range) and volume series.
 */
function getPriceSeries(rows) {
    const price = [],
        spread = [],
        volume = [];

    for (let i = 0; i < rows.length; i++) {
        const row = rows[i],
            date = row.timestamp;

        price.push([date, row.price]);
        spread.push([date, row.bid, row.ask]);
        volume.push([date, row.volume]);
    }

    return { price, spread, volume };
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
    const date = [],
        time = [],
        price = [],
        volume = [],
        bid = [],
        ask = [],
        spread = [];

    for (let i = 0; i < rows.length; i++) {
        const row = rows[i];

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
            chartOptions: {
                title: {
                    text: 'American Airlines Group &middot; <span ' +
                        'style="color:#64625f;font-weight:300">AAL</span>',
                    useHTML: true,
                    align: 'left',
                    margin: 4,
                    style: {
                        color: '#1a1918',
                        fontSize: '22px',
                        fontWeight: '500'
                    }
                },
                subtitle: {
                    text: 'Tick-by-tick last price with bid/ask spread ' +
                        'band and per-trade volume',
                    align: 'left',
                    style: {
                        color: '#64625f',
                        fontSize: '13px',
                        fontWeight: '300'
                    }
                },
                accessibility: {
                    keyboardNavigation: {
                        focusBorder: {
                            enabled: true,
                            style: {
                                color: '#2364B9',
                                lineWidth: 2
                            }
                        }
                    },
                    point: {
                        valueDescriptionFormat: '{xDescription}, ${point.y}'
                    }
                },
                caption: {
                    text: 'Each marker on the line is a single trade; the ' +
                        'translucent band shows the bid-ask quote at that ' +
                        'moment. Volume per trade is in the lower pane.',
                    align: 'left',
                    style: {
                        color: '#64625f',
                        fontSize: '11px',
                        fontWeight: '300'
                    }
                },
                chart: {
                    backgroundColor: '#ffffff',
                    plotBorderWidth: 0,
                    style: {
                        fontFamily: '"MorningstarIntrinsic", ' +
                            '"Helvetica Neue", Helvetica, Arial, sans-serif'
                    }
                },
                credits: {
                    enabled: false
                },
                tooltip: {
                    backgroundColor: '#ffffff',
                    borderColor: '#dad9d8',
                    borderRadius: 4,
                    borderWidth: 1,
                    shadow: false,
                    style: {
                        color: '#1a1918',
                        fontSize: '12px',
                        fontWeight: '300'
                    },
                    xDateFormat: '%H:%M:%S',
                    valueDecimals: 2,
                    valuePrefix: '$'
                },
                navigator: {
                    handles: {
                        backgroundColor: '#ffffff',
                        borderColor: '#dad9d8'
                    },
                    maskFill: 'rgba(100, 98, 95, 0.2)',
                    outlineColor: '#dad9d8',
                    series: {
                        name: 'Navigator',
                        data: series.price,
                        color: 'rgba(35, 100, 185, 0.45)'
                    },
                    xAxis: {
                        gridLineColor: '#dad9d8'
                    }
                },
                scrollbar: {
                    enabled: false
                },
                rangeSelector: {
                    inputEnabled: false,
                    selected: 3,
                    buttonTheme: {
                        fill: 'none',
                        r: 4,
                        stroke: 'none',
                        'stroke-width': 0,
                        style: {
                            color: '#64625f',
                            fontWeight: '300'
                        },
                        states: {
                            hover: {
                                fill: 'rgba(100, 98, 95, 0.08)',
                                style: {
                                    color: '#1a1918'
                                }
                            },
                            select: {
                                fill: 'rgba(35, 100, 185, 0.12)',
                                style: {
                                    color: '#2364B9',
                                    fontWeight: '500'
                                }
                            }
                        }
                    },
                    labelStyle: {
                        color: '#64625f'
                    },
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
                    type: 'datetime',
                    lineColor: '#dad9d8',
                    tickColor: '#dad9d8',
                    accessibility: {
                        description: 'Time of trade'
                    },
                    labels: {
                        style: {
                            color: '#64625f',
                            fontSize: '11px',
                            fontWeight: '300'
                        }
                    }
                },
                yAxis: [{
                    height: '80%',
                    gridLineColor: '#dad9d8',
                    gridLineWidth: 1,
                    lineWidth: 0,
                    accessibility: {
                        description: 'Trade price in US dollars'
                    },
                    title: {
                        text: 'Price (USD)',
                        style: {
                            color: '#64625f',
                            fontSize: '11px',
                            fontWeight: '300'
                        }
                    },
                    labels: {
                        format: '${value:.2f}',
                        style: {
                            color: '#64625f',
                            fontSize: '11px',
                            fontWeight: '300'
                        }
                    }
                }, {
                    top: '80%',
                    height: '20%',
                    offset: 0,
                    maxPadding: 0,
                    gridLineColor: '#dad9d8',
                    gridLineWidth: 1,
                    showLastLabel: true,
                    lineWidth: 0,
                    accessibility: {
                        description: 'Number of shares per trade'
                    },
                    title: {
                        text: 'Shares (Volume)',
                        style: {
                            color: '#64625f',
                            fontSize: '11px',
                            fontWeight: '300'
                        }
                    },
                    reserveSpace: false,
                    labels: {
                        x: 0,
                        y: 11,
                        style: {
                            color: '#64625f',
                            fontSize: '11px',
                            fontWeight: '300'
                        }
                    }
                }],
                series: [{
                    type: 'arearange',
                    name: 'Bid / Ask',
                    data: series.spread,
                    color: '#a9c0db',
                    fillOpacity: 0.55,
                    lineWidth: 0,
                    zIndex: 0,
                    marker: {
                        enabled: false
                    },
                    accessibility: {
                        description: 'Translucent band showing the bid-ask ' +
                            'spread at each trade time.'
                    }
                }, {
                    type: 'line',
                    name: 'Price',
                    data: series.price,
                    color: '#2364B9',
                    lineWidth: 1.5,
                    zIndex: 1,
                    marker: {
                        enabled: true,
                        radius: 2,
                        symbol: 'circle'
                    },
                    accessibility: {
                        description: 'Last traded price at each individual ' +
                            'trade.'
                    }
                }, {
                    name: 'Volume',
                    type: 'column',
                    data: series.volume,
                    color: 'rgba(35, 100, 185, 0.45)',
                    borderWidth: 0,
                    yAxis: 1,
                    tooltip: {
                        valueDecimals: 0,
                        valuePrefix: ''
                    },
                    accessibility: {
                        description: 'Number of shares exchanged in each ' +
                            'individual trade.'
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
                    },
                    sorting: {
                        order: 'desc'
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
