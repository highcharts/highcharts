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

    const labelStyle = {
        color: 'var(--mstar-text-muted)',
        fontSize: '11px',
        fontWeight: '300'
    };
    const bodyTextStyle = {
        color: 'var(--mstar-text-strong)',
        fontSize: '12px',
        fontWeight: '300'
    };

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
                        'style="color:var(--mstar-text-muted);' +
                        'font-weight:300">AAL</span>',
                    useHTML: true,
                    align: 'left',
                    margin: 4,
                    style: {
                        color: 'var(--mstar-text-strong)',
                        fontSize: '22px',
                        fontWeight: '500'
                    }
                },
                subtitle: {
                    text: 'Tick-by-tick last price with bid/ask spread ' +
                        'band and per-trade volume',
                    align: 'left',
                    style: {
                        color: 'var(--mstar-text-muted)',
                        fontSize: '13px',
                        fontWeight: '300'
                    }
                },
                accessibility: {
                    keyboardNavigation: {
                        focusBorder: {
                            enabled: true,
                            style: {
                                color: 'var(--mstar-accent)',
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
                    style: labelStyle
                },
                chart: {
                    backgroundColor: 'var(--mstar-surface)',
                    style: {
                        fontFamily: '"MorningstarIntrinsic", ' +
                            '"Helvetica Neue", Helvetica, Arial, sans-serif'
                    }
                },
                credits: {
                    enabled: false
                },
                tooltip: {
                    backgroundColor: 'var(--mstar-surface)',
                    borderColor: 'var(--mstar-line)',
                    borderRadius: 4,
                    borderWidth: 1,
                    shadow: false,
                    style: bodyTextStyle,
                    dateTimeLabelFormats: {
                        millisecond: '%e %b, %H:%M:%S.%L',
                        second: '%e %b, %H:%M:%S',
                        minute: '%e %b, %H:%M'
                    },
                    valueDecimals: 2,
                    valuePrefix: '$'
                },
                navigator: {
                    handles: {
                        backgroundColor: 'var(--mstar-surface)',
                        borderColor: 'var(--mstar-line)'
                    },
                    maskFill: 'var(--mstar-mask)',
                    outlineColor: 'var(--mstar-line)',
                    series: {
                        name: 'Navigator',
                        data: series.price,
                        color: 'var(--mstar-accent-soft)'
                    },
                    xAxis: {
                        gridLineColor: 'var(--mstar-line)'
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
                            color: 'var(--mstar-text-muted)',
                            fontWeight: '300'
                        },
                        states: {
                            hover: {
                                fill: 'var(--mstar-hover)',
                                style: {
                                    color: 'var(--mstar-text-strong)'
                                }
                            },
                            select: {
                                fill: 'var(--mstar-accent-select)',
                                style: {
                                    color: 'var(--mstar-accent)',
                                    fontWeight: '500'
                                }
                            }
                        }
                    },
                    labelStyle: {
                        color: 'var(--mstar-text-muted)'
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
                    lineColor: 'var(--mstar-line)',
                    tickColor: 'var(--mstar-line)',
                    accessibility: {
                        description: 'Time of trade'
                    },
                    labels: {
                        style: labelStyle
                    }
                },
                yAxis: [{
                    height: '80%',
                    gridLineColor: 'var(--mstar-line)',
                    gridLineWidth: 1,
                    lineWidth: 0,
                    accessibility: {
                        description: 'Trade price in US dollars'
                    },
                    title: {
                        text: 'Price (USD)',
                        style: labelStyle
                    },
                    labels: {
                        format: '${value:.2f}',
                        style: labelStyle
                    }
                }, {
                    top: '80%',
                    height: '20%',
                    offset: 0,
                    maxPadding: 0,
                    gridLineColor: 'var(--mstar-line)',
                    gridLineWidth: 1,
                    showLastLabel: true,
                    lineWidth: 0,
                    accessibility: {
                        description: 'Number of shares per trade'
                    },
                    title: {
                        text: 'Shares (Volume)',
                        style: labelStyle
                    },
                    reserveSpace: false,
                    labels: {
                        x: 0,
                        y: 11,
                        style: labelStyle
                    }
                }],
                plotOptions: {
                    series: {
                        dataGrouping: {
                            dateTimeLabelFormats: {
                                millisecond: [
                                    '%e %b, %H:%M:%S.%L',
                                    '%e %b, %H:%M:%S',
                                    '-%H:%M:%S'
                                ],
                                second: [
                                    '%e %b, %H:%M:%S',
                                    '%e %b, %H:%M:%S',
                                    '-%H:%M:%S'
                                ],
                                minute: [
                                    '%e %b, %H:%M',
                                    '%e %b, %H:%M',
                                    '-%H:%M'
                                ]
                            }
                        }
                    }
                },
                series: [{
                    type: 'arearange',
                    name: 'Bid / Ask',
                    data: series.spread,
                    color: 'var(--mstar-band)',
                    fillOpacity: 0.55,
                    lineWidth: 0,
                    marker: {
                        enabled: false
                    },
                    accessibility: {
                        description: 'Translucent band showing the bid-ask ' +
                            'spread at each trade time.'
                    }
                }, {
                    name: 'Price',
                    data: series.price,
                    color: 'var(--mstar-accent)',
                    lineWidth: 1.5,
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
                    color: 'var(--mstar-accent-soft)',
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
