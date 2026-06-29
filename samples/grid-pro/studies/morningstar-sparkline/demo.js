const commonOptions = {
    api: {
        url: 'https://demo-live-data.highcharts.com',
        access: {
            url: 'https://demo-live-data.highcharts.com/token/oauth',
            token: 'token'
        }
    }
};

const stockCollection = [
    ['Tesla, Inc. (TSLA)', 'US88160R1014', '0P0000OQN8'],
    ['Netflix, Inc. (NFLX)', 'US64110L1061', '0P000003UP'],
    ['Microsoft Corporation (MSFT)', 'US5949181045', '0P000003MH'],
    ['Amazon.com, Inc. (AMZN)', 'US0231351067', '0P000000B7'],
    ['Alphabet Inc. (GOOGL)', 'US02079K3059', '0P000002HD'],
    ['NVIDIA Corporation (NVDA)', 'US67066G1040', '0P000003RE'],
    ['Apple Inc. (AAPL)', 'US0378331005', '0P000000GY'],
    ['Meta Platforms, Inc. (META)', 'US30303M1027', '0P0000W3KZ'],
    ['Intel Corporation (INTC)', 'US4581401001', '0P000002X8'],
    ['Advanced Micro Devices, Inc. (AMD)', 'US0079031078', '0P0000006A']
].map(([ticker, ISIN, SecID]) => ({ ticker, ISIN, SecID }));

const marketIndex = {
    ticker: 'Dow Jones World Index (W1DOW)',
    ISIN: 'US2605571031',
    SecID: '0P0001H3ZI'
};

const getHoldings = [...stockCollection, marketIndex].map(({ ISIN }) => ({
    id: ISIN,
    idType: 'ISIN'
}));

const ANIMATION_SPEED = 1000;
const WINDOW_SIZE = 31;
const START_DATE = '2023-06-01';
const END_DATE = '2023-12-31';
const CHANGE_COLUMNS = [
    { id: 'oneDayChange', label: '1 Day', days: 1 },
    { id: 'oneWeekChange', label: '1 Week', days: 7 },
    { id: 'oneMonthChange', label: '1 Month', days: 30 }
];
const RANGE_BUTTONS = [
    { count: 1, type: 'week', text: '1W' },
    { count: 1, type: 'month', text: '1M' },
    { count: 3, type: 'month', text: '3M' },
    { count: 6, type: 'month', text: '6M' },
    { count: 1, type: 'year', text: '1Y' },
    { type: 'all', text: 'All' }
];
const DATA_COLUMNS = [
    'priceEvolution',
    ...CHANGE_COLUMNS.map(({ id }) => id),
    'price'
];
const INITIAL_VISIBLE_COUNT = Math.max(
    ...CHANGE_COLUMNS.map(({ days }) => days)
);
const dateFormatter = new Intl.DateTimeFormat('en', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
});
const hasValue = value => value != null;
const toPointData = (xData, yData) => xData.map((x, i) => [x, yData[i]]);
const getPrices = (table, stock) => (
    table.getColumn(stock.SecID) || []
).map(Number);
const connector = new HighchartsConnectors.Morningstar.TimeSeriesConnector({
    ...commonOptions,
    series: { type: 'Price' },
    securities: getHoldings,
    startDate: START_DATE,
    endDate: END_DATE,
    currencyId: 'EUR'
});

function getVisibleWindow(dataLength, visibleCount) {
    const end = Math.min(visibleCount, dataLength);
    const start = Math.max(0, end - WINDOW_SIZE);
    return { start, end };
}

function getDateRangeLabel(dates, visibleCount) {
    const { start, end } = getVisibleWindow(dates.length, visibleCount);
    return (
        `${dateFormatter.format(new Date(dates[start]))} - `
        + dateFormatter.format(new Date(dates[end - 1]))
    );
}

function updatePriceEvolutionHeader(dates, visibleCount) {
    document
        .querySelectorAll('#container .price-evolution-header-date')
        .forEach(label => {
            label.textContent = getDateRangeLabel(dates, visibleCount);
        });
}

function formatDelta(value) {
    const formattedValue = Math.abs(value).toFixed(2);
    if (value > 0) {
        return `<span style='color: #4caf50;'>${formattedValue}% &uarr;</span>`;
    }
    if (value < 0) {
        return `<span style='color: #f44336;'>${formattedValue}% &#8595;</span>`;
    }
    return `<span>${formattedValue}%</span>`;
}
function getRowData(stock, prices, visibleCount) {
    const currentPrice = prices[visibleCount - 1];

    return {
        ticker: stock.ticker,
        priceEvolution: toSpark(prices, visibleCount),
        price: Number(currentPrice?.toFixed(2) ?? ''),
        ...Object.fromEntries(
            CHANGE_COLUMNS.map(({ id, days }) => {
                const previousPrice = prices[visibleCount - days - 1];
                const value = hasValue(currentPrice) && hasValue(previousPrice) ?
                    Number((
                        (currentPrice - previousPrice) / previousPrice * 100
                    ).toFixed(2)) :
                    0;

                return [id, value];
            })
        )
    };
}

const toSpark = (col, count) => {
    const { start, end } = getVisibleWindow(col.length, count);
    return col.slice(start, end).map(Number).join(', ');
};
if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
    document.body.classList.add('touch-device');
}
(async () => {
    try {
        await connector.load();
        const table = connector.getTable();
        const dates = table.getColumn('Date') || [];
        const cachedPrices = stockCollection.map(
            stock => getPrices(table, stock)
        );
        const indexPrice = getPrices(table, marketIndex);
        const maxSeriesLength = Math.max(...cachedPrices.map(p => p.length), 0);
        let visibleCount = INITIAL_VISIBLE_COUNT;
        const rowsData = stockCollection.map((stock, i) => (
            getRowData(stock, cachedPrices[i], visibleCount)
        ));
        const gridData = new Grid.DataTable({
            columns: Object.fromEntries(
                ['ticker', ...DATA_COLUMNS].map(column => [
                    column,
                    rowsData.map(row => row[column])
                ])
            )
        });

        const defaultHeader = [{
            columnId: 'ticker',
            format: 'Company'
        }, {
            columnId: 'priceEvolution',
            format: 'Price Evolution<span class="price-evolution-header-date">'
                    + getDateRangeLabel(dates, visibleCount) + '</span>'
        },
        ...CHANGE_COLUMNS.map(({ id, label }) => ({
            columnId: id,
            format: `${label} (%)`
        })),
        {
            columnId: 'price',
            format: '<span class="price-header">Price <wbr>(EUR)</span>'
        }];
        const compactHeader = defaultHeader.filter(({ columnId }) => ![
            CHANGE_COLUMNS[0].id,
            CHANGE_COLUMNS[2].id
        ].includes(columnId));

        const grid = Grid.grid('container', {
            data: { dataTable: gridData },
            columnDefaults: {
                sorting: {
                    orderSequence: ['desc', 'asc'],
                    order: 'desc'
                }
            },
            rendering: {
                rows: {
                    strictHeights: true
                },
                theme: 'theme-custom'
            },
            header: defaultHeader,
            columns: [{
                id: 'ticker',
                width: '20%'
            }, {
                id: 'priceEvolution',
                className: 'stockSparklines',
                cells: {
                    events: {
                        click: function () {
                            const ticker = this.row.data.ticker;
                            const stock = stockCollection.find(
                                s => s.ticker === ticker
                            );
                            if (!stock) {
                                return;
                            }
                            openStockChart(
                                stock,
                                stockCollection.indexOf(stock),
                                visibleCount
                            );
                        }
                    },
                    renderer: {
                        type: 'sparkline',
                        chartOptions: function (data) {
                            const y = (data || '').split(',').map(Number);
                            return {
                                tooltip: {
                                    enabled: true,
                                    outside: true,
                                    formatter: function () {
                                        return (
                                            `<b>${this.y.toFixed(2)} EUR</b>`
                                        );
                                    }
                                },
                                chart: {
                                    animation: true
                                },
                                series: [{
                                    data: y,
                                    animation: {
                                        duration: ANIMATION_SPEED
                                    },
                                    color: y[y.length - 1] >= y[0] ?
                                        '#4caf50' :
                                        '#f44336'
                                }]
                            };
                        }
                    }
                }
            },
            ...CHANGE_COLUMNS.map(({ id }) => ({
                id,
                cells: {
                    formatter: function () {
                        return formatDelta(this.value);
                    }
                },
                width: '10%'
            })),
            {
                id: 'price',
                width: '10%'
            }
            ],
            responsive: {
                rules: [{
                    condition: {
                        maxWidth: 900
                    },
                    gridOptions: {
                        header: compactHeader,
                        columns: [{
                            id: CHANGE_COLUMNS[1].id,
                            width: '15%'
                        }, {
                            id: 'price',
                            width: '15%'
                        }]
                    }
                }]
            }
        });

        async function refreshGrid() {
            visibleCount = Math.min(visibleCount + 1, maxSeriesLength);
            stockCollection.forEach((stock, rowIndex) => {
                const rowData = getRowData(
                    stock,
                    cachedPrices[rowIndex],
                    visibleCount
                );
                DATA_COLUMNS.forEach(column => {
                    gridData.setCell(column, rowIndex, rowData[column]);
                });
            });

            await grid.querying.proceed(true);
            updatePriceEvolutionHeader(dates, visibleCount);
            grid.viewport.columns.forEach(column => {
                column.loadData();
            });
            stockCollection.forEach((_, rowIndex) => {
                const row = grid.viewport.getRow(rowIndex);
                if (!row) {
                    return;
                }
                row.loadData();
                row.cells.forEach(cell => cell.setValue());
            });
        }
        const gridInterval = setInterval(async () => {
            if (visibleCount >= maxSeriesLength) {
                clearInterval(gridInterval);
                return;
            }
            await refreshGrid();
        }, ANIMATION_SPEED);

        const overlay = document.getElementById('spark-popup-overlay');
        let popupChart = null;
        let popupInterval = null;

        function closePopup() {
            overlay.classList.remove('open');
            clearInterval(popupInterval);
            popupInterval = null;
            popupChart.destroy();
        }
        overlay.addEventListener('click', e => {
            if (e.target === overlay) {
                closePopup();
            }
        });
        document
            .getElementById('spark-popup-close')
            .addEventListener('click', closePopup);

        function openStockChart(stock, rowIndex, visibleCount) {
            const prices = cachedPrices[rowIndex];
            const { end } = getVisibleWindow(prices.length, visibleCount); 
            const xData = dates.slice(0, end);
            const stockData = prices.slice(0, end).map(Number);
            const indexData = indexPrice.slice(0, end).map(Number);
            const pointFormat = (
                '<span style="color:{point.color}">\u25CF</span> '
                + '{series.name}</br> <b>{point.y} EUR</b> '
                + '({point.change:.2f}%)<br/>'
            );
            const makeSeries = (name, data) => ({
                name,
                showInLegend: true,
                data: toPointData(xData, data),
                compare: 'percent',
                compareStart: true,
                tooltip: {
                    pointFormat,
                    valueDecimals: 2
                }
            });
            overlay.classList.add('open');
            popupChart = Highcharts.stockChart('spark-popup-chart', {
                chart: {
                    events: {
                        load: function () {
                            const [stockSeries, indexSeries] = this.series;
                            let popupVisible = visibleCount;
                            popupInterval = setInterval(function () {
                                popupVisible = popupVisible + 1;
                                const end = Math.min(
                                    popupVisible,
                                    maxSeriesLength
                                );
                                const nextStockY = prices[end - 1];
                                const nextIndexY = indexPrice[end - 1];
                                const nextX = dates[end - 1];

                                if (popupVisible >= maxSeriesLength) {
                                    clearInterval(popupInterval);
                                    popupInterval = null;
                                    return;
                                }
                                stockSeries.addPoint([nextX, nextStockY], true, false);
                                indexSeries.addPoint([nextX, nextIndexY], true, false);
                            }, ANIMATION_SPEED);
                        }
                    }
                },
                rangeSelector: {
                    buttons: RANGE_BUTTONS
                },
                title: { text: stock.ticker + ' vs. ' + marketIndex.ticker },
                yAxis: {
                    labels: {
                        format: '{text}%'
                    }
                },
                legend: { enabled: true },
                series: [
                    makeSeries(stock.ticker, stockData),
                    makeSeries(marketIndex.ticker, indexData)
                ]
            });
        }
    } catch (err) {
        document.getElementById('container').textContent = (
            'Failed to load data: ' + err.message
        );
    } finally {
        document.getElementById('loading-spinner')?.remove();
    }
})();
