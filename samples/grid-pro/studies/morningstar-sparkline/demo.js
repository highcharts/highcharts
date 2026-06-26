const commonOptions = {
    api: {
        url: 'https://demo-live-data.highcharts.com',
        access: {
            url: 'https://demo-live-data.highcharts.com/token/oauth',
            token: 'token'
        }
    }
};

const stockCollection = [{
    ticker: 'Tesla, Inc. (TSLA)',
    ISIN: 'US88160R1014',
    SecID: '0P0000OQN8'
}, {
    ticker: 'Netflix, Inc. (NFLX)',
    ISIN: 'US64110L1061',
    SecID: '0P000003UP'
}, {
    ticker: 'Microsoft Corporation (MSFT)',
    ISIN: 'US5949181045',
    SecID: '0P000003MH'
}, {
    ticker: 'Amazon.com, Inc. (AMZN)',
    ISIN: 'US0231351067',
    SecID: '0P000000B7'
}, {
    ticker: 'Alphabet Inc. (GOOGL)',
    ISIN: 'US02079K3059',
    SecID: '0P000002HD'
},
{
    ticker: 'NVIDIA Corporation (NVDA)',
    ISIN: 'US67066G1040',
    SecID: '0P000003RE'
},
{
    ticker: 'Apple Inc. (AAPL)',
    ISIN: 'US0378331005',
    SecID: '0P000000GY'
},
{
    ticker: 'Meta Platforms, Inc. (META)',
    ISIN: 'US30303M1027',
    SecID: '0P0000W3KZ'
},
{
    ticker: 'Intel Corporation (INTC)',
    ISIN: 'US4581401001',
    SecID: '0P000002X8'
},
{
    ticker: 'Advanced Micro Devices, Inc. (AMD)',
    ISIN: 'US0079031078',
    SecID: '0P0000006A'
}
];
const marketIndex = {
    ticker: 'Dow Jones World Index (W1DOW)',
    ISIN: 'US2605571031',
    SecID: '0P0001H3ZI'
};

const getHoldings = [
    ...stockCollection.map(stock => ({ id: stock.ISIN, idType: 'ISIN' })),
    { id: marketIndex.ISIN, idType: 'ISIN' }
];

const ANIMATION_SPEED = 1000;
const WINDOW_SIZE = 20;
const TIME_PERIODS = [
    { label: '1', days: 7 },
    { label: '2', days: 30 },
    { label: '3', days: 90 }
];
const INITIAL_VISIBLE_COUNT = Math.max(
    ...TIME_PERIODS.map(({ days }) => days)
);

(async () => {
    const isTouchDevice = 'ontouchstart' in window
        || navigator.maxTouchPoints > 0;
    if (isTouchDevice) {
        document.body.classList.add('touch-device');
    }
    const connector = new HighchartsConnectors.Morningstar.TimeSeriesConnector({
        ...commonOptions,
        series: { type: 'Price' },
        securities: getHoldings,
        startDate: '2022-05-01',
        endDate: '2023-12-31',
        currencyId: 'EUR'
    });
    const toSpark = (col, count) => {
        const end = Math.min(count, col.length);
        const start = Math.max(0, end - WINDOW_SIZE);
        return col.slice(start, end).map(Number).join(', ');
    };

    const getPrices = (table, stock) => {
        const priceColumn = table.getColumn(stock.SecID) || [];
        return priceColumn.map(Number);
    };

    function calculateDeltas(prices, visibleCount) {
        return TIME_PERIODS.map(({ days }) => {
            const currentPrice = prices[visibleCount - 1];
            const previousPrice = prices[visibleCount - 1 - days];

            if (
                currentPrice === null
                || typeof currentPrice === 'undefined'
                || previousPrice === null
                || typeof previousPrice === 'undefined'
            ) {
                return 0;
            }

            return Number((currentPrice - previousPrice).toFixed(2));
        });
    }
    function calculateRowValues(prices, visibleCount) {
        return {
            spark: toSpark(prices, visibleCount),
            latestPrice: Number(prices[visibleCount - 1]?.toFixed(2) ?? ''),
            deltaValues: calculateDeltas(prices, visibleCount)
        };
    }
    function formatDelta(value) {
        const formattedValue = Math.abs(value).toFixed(2);

        if (value > 0) {
            return `<span style='color: #4caf50;'>${formattedValue} &uarr;</span>`;
        }
        if (value < 0) {
            return `<span style='color: #f44336;'>${formattedValue} &#8595;</span>`;
        }
        return `<span>${formattedValue}</span>`;
    }

    try {
        await connector.load();
        const table = connector.getTable();
        let visibleCount = INITIAL_VISIBLE_COUNT;
        const cachedPrices = stockCollection.map(
            stock => getPrices(table, stock)
        );
        const indexPrice = getPrices(table, marketIndex);

        const rows = stockCollection.map((stock, i) => {
            const prices = cachedPrices[i];
            const { spark, latestPrice, deltaValues } = calculateRowValues(
                prices,
                visibleCount
            );
            return {
                ticker: stock.ticker,
                priceEvolution: spark,
                oneWeekChange: deltaValues[0],
                oneMonthChange: deltaValues[1],
                threeMonthChange: deltaValues[2],
                price: latestPrice
            };
        });

        const maxSeriesLength = Math.max(...cachedPrices.map(p => p.length), 0);
        const gridData = new Grid.DataTable({
            columns: {
                ticker: rows.map(row => row.ticker),
                priceEvolution: rows.map(row => row.priceEvolution),
                oneWeekChange: rows.map(row => row.oneWeekChange),
                oneMonthChange: rows.map(row => row.oneMonthChange),
                threeMonthChange: rows.map(row => row.threeMonthChange),
                price: rows.map(row => row.price)
            }
        });
        const compactTimePeriodHeader = {
            columnId: 'oneMonthChange',
            format: '1 Month'
        };
        const priceHeaderFormat = (
            '<span class="price-header">Price <wbr>(EUR)</span>'
        );
        const defaultHeader = [{
            columnId: 'ticker',
            format: 'Company'
        }, {
            columnId: 'priceEvolution',
            format: 'Price Evolution'
        }, {
            columnId: 'oneWeekChange',
            format: '1 Week'
        }, {
            columnId: 'oneMonthChange',
            format: '1 Month'
        }, {
            columnId: 'threeMonthChange',
            format: '3 Months'
        }, {
            columnId: 'price',
            format: priceHeaderFormat
        }];
        const compactHeader = defaultHeader
            .filter(entry => ![
                'oneWeekChange',
                'threeMonthChange'
            ].includes(entry.columnId))
            .map(entry => (
                entry.columnId === 'oneMonthChange' ?
                    compactTimePeriodHeader :
                    entry
            ));

        const grid = Grid.grid('container', {
            data: { dataTable: gridData },
            columnDefaults: {
                sorting: {
                    orderSequence: ['asc', 'desc'],
                    order: 'asc'
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
                header: { format: 'Company' },
                width: '20%'
            }, {
                id: 'priceEvolution',
                className: 'stockSparklines',
                header: { format: 'Price Evolution' },
                cells: {
                    events: {
                        click: function () {
                            const rowIndex = this.row.index;
                            const ticker = this.row.data.ticker;
                            const stock = stockCollection.find(
                                s => s.ticker === ticker
                            );
                            if (!stock) {
                                return;
                            }
                            openStockChart(stock, rowIndex, visibleCount);
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
                                plotOptions: {
                                    series: {
                                        enableMouseTracking: true
                                    }
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
            }, {
                id: 'oneWeekChange',
                header: { format: '1 Week (EUR)' },
                cells: {
                    formatter: function () {
                        return formatDelta(this.value);
                    }
                },
                width: '10%'
            }, {
                id: 'oneMonthChange',
                header: { format: '1 Month (EUR)' },
                cells: {
                    formatter: function () {
                        return formatDelta(this.value);
                    }
                },
                width: '10%'
            }, {
                id: 'threeMonthChange',
                header: { format: '3 Months (EUR)' },
                cells: {
                    formatter: function () {
                        return formatDelta(this.value);
                    }
                },
                width: '10%'
            }, {
                id: 'price',
                header: { format: priceHeaderFormat },
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
                            id: 'oneMonthChange',
                            width: '20%'
                        }, {
                            id: 'price',
                            width: '15%'
                        }]
                    }
                }]
            }
        });

        async function refreshSparkline() {
            visibleCount = Math.min(visibleCount + 1, maxSeriesLength);
            stockCollection.forEach((_, rowIndex) => {
                const { spark, latestPrice, deltaValues } = calculateRowValues(
                    cachedPrices[rowIndex],
                    visibleCount
                );

                gridData.setCell('priceEvolution', rowIndex, spark);
                gridData.setCell('oneWeekChange', rowIndex, deltaValues[0]);
                gridData.setCell('oneMonthChange', rowIndex, deltaValues[1]);
                gridData.setCell('threeMonthChange', rowIndex, deltaValues[2]);
                gridData.setCell('price', rowIndex, latestPrice);
            });
            await grid.querying.proceed(true);

            for (const column of grid.viewport.columns) {
                column.loadData();
            }

            stockCollection.forEach((_, rowIndex) => {
                const row = grid.viewport.getRow(rowIndex);
                if (!row) {
                    return;
                }

                row.loadData();
                row.cells.forEach(cell => cell.setValue());
            });
        }
        setInterval(refreshSparkline, ANIMATION_SPEED);
        const overlay = document.getElementById('spark-popup-overlay');
        let popupInterval = null;
        // Close on overlay or button click
        function closePopup() {
            overlay.classList.remove('open');
            clearInterval(popupInterval);
            popupInterval = null;
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
            const dates = table.getColumn('Date') || [];

            const end = Math.min(visibleCount, prices.length);

            // Slicing from zero to let user view entire timeline.
            const yData = prices.slice(0, end).map(Number);
            const xData = dates.slice(0, end);

            const indexData = indexPrice.slice(0, end).map(Number);

            const tolltipPointFormat = (
                '<span style="color:{point.color}">\u25CF</span> '
                + '{series.name}</br> <b>{point.y} EUR</b> '
                + '({point.change:.2f}%)<br/>'
            );
            overlay.classList.add('open');
            Highcharts.stockChart('spark-popup-chart', {
                chart: {
                    events: {
                        load: function () {
                            const stockSeries = this.series[0];
                            const indexSeries = this.series[1];
                            if (popupInterval) {
                                clearInterval(popupInterval);
                            }
                            popupInterval = setInterval(function () {
                                visibleCount = Math.min(
                                    visibleCount + 1,
                                    maxSeriesLength
                                );
                                const end = Math.min(
                                    visibleCount,
                                    prices.length
                                );
                                const newStockY = prices[end - 1];
                                const newIndexY = indexPrice[end - 1];
                                const newX = dates[end - 1];

                                if (
                                    end >= prices.length
                                    || end >= dates.length
                                    || newStockY === null
                                    || typeof newStockY === 'undefined'
                                    || newX === null
                                    || typeof newX === 'undefined'
                                ) {
                                    clearInterval(popupInterval);
                                    popupInterval = null;
                                    return;
                                }

                                stockSeries.addPoint(
                                    [newX, newStockY],
                                    true,
                                    false
                                );
                                indexSeries.addPoint(
                                    [newX, newIndexY],
                                    true,
                                    false
                                );
                            }, ANIMATION_SPEED);
                        }
                    }
                },
                rangeSelector: {
                    selected: 1
                },
                title: {
                    text: stock.ticker
                },
                yAxis: {
                    labels: {
                        format: '{text}%'
                    }
                },
                legend: {
                    enabled: true
                },
                series: [{
                    name: stock.ticker,
                    showInLegend: true,
                    data: xData.map((x, i) => [x, yData[i]]),
                    compare: 'percent',
                    compareStart: true,
                    tooltip: {
                        pointFormat: tolltipPointFormat,
                        valueDecimals: 2
                    }
                }, {
                    name: marketIndex.ticker,
                    showInLegend: true,
                    data: xData.map((x, i) => [x, indexData[i]]),
                    compare: 'percent',
                    compareStart: true,
                    tooltip: {
                        pointFormat: tolltipPointFormat,
                        valueDecimals: 2
                    }
                }]
            });
        }
    } catch (err) {
        document.getElementById('container').textContent = (
            'Failed to load data: ' + err.message
        );
    }
})();
