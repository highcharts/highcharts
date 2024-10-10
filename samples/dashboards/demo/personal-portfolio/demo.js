const basicInvestmentPlan = {
    interval: 30, // Every 30 days
    amount: 200   // Amount in EUR
};

const stockCollection = [
    {
        tradingSymbol: 'NFLX',
        ISIN: 'US64110L1061',
        SecID: '0P000003UP'
    }, {
        tradingSymbol: 'MSFT',
        ISIN: 'US5949181045',
        SecID: '0P000003MH'
    }, {
        tradingSymbol: 'AMZN',
        ISIN: 'US0231351067',
        SecID: '0P000000B7'
    }, {
        tradingSymbol: 'GOOGL',
        ISIN: 'US02079K3059',
        SecID: '0P000002HD'
    }
];

const generatePortfolio = (investmentPlan, stockPrices) => {
    const { interval, amount } = investmentPlan;
    const portfolioValues = [];
    let totalUnits = 0;
    stockPrices.forEach((priceData, day) => {
        // Check if it's an investment day
        if ((day % interval) === 0) {
            totalUnits += amount / priceData[1];
        }

        // Calculate portfolio value for the day
        const value = totalUnits * priceData[1];
        portfolioValues.push([priceData[0], value]);
    });
    return portfolioValues;
};

const data = [
    ['Name', 'ISIN', '% of wallet'],
    ['Mock1', 'MOCK6528', 70],
    ['Mock2', 'MOCK6529', 30]
];

const getIDs = () =>  stockCollection.map(stock => ({
    id: stock.ISIN,
    idType: 'ISIN'
}));

// Morningstar data fetch
const commonOptions = {
    api: {
        url: 'https://demo-live-data.highcharts.com',
        access: {
            url: 'https://demo-live-data.highcharts.com/token/oauth',
            username: 'username',
            password: 'password'
        }
    }
};

// eslint-disable-next-line no-undef
const connector = new Connectors.Morningstar.TimeSeriesConnector({
    ...commonOptions,
    series: {
        type: 'Price'
    },
    securities: getIDs(),
    currencyId: 'EUR',
    startDate: '2022-01-01',
    endDate: '2023-12-31'
});

const mockRiskScore = {
    riskScores: [
        {
            portfolio: {
                externalId: 'string',
                name: 'string',
                riskScore: 30,
                alignmentScore: 0,
                rSquared: 0,
                retainedWeightProxied: 0,
                scoringMethodUsed: 'string',
                effectiveDate: 'string'
            },
            metadata: {
                requestId: 'string',
                messages: [{
                    type: 'Warning',
                    message: 'string',
                    invalidHoldings: [{
                        identifier: 'string',
                        identifierType: 'SecurityId',
                        cusip: 'string',
                        fundCode: 'string',
                        isin: 'string',
                        performanceId: 'string',
                        securityId: 'string',
                        ticker: 'string',
                        tradingSymbol: 'string',
                        status: 'Invalid'
                    }]
                }]
            }
        }
    ],
    metadata: {
        requestId: 'string',
        messages: [{
            type: 'Warning',
            message: 'string'
        }]
    }
};

function sumAllArrays(arr) {
    return arr.reduce((acc, current) => acc.map((num, idx) =>
        [num[0], num[1] + current[idx][1]]
    ));
}


Promise.all([
    connector.load()
]).then(() => {

    const { Date: dates, ...companies } = connector.table.getColumns();

    const processedData = Object.fromEntries(
        Object.entries(companies).map(([key, values]) => [
            key,
            values.map((value, i) => [dates[i], value])
        ])
    );

    const holdings = [];

    stockCollection.forEach(stock => {
        holdings.push(generatePortfolio(
            basicInvestmentPlan, processedData[stock.SecID]
        ));
    });

    const walletTotal = sumAllArrays(holdings);

    const lastTotal = walletTotal[walletTotal.length - 1][1];

    /*
        const portfolio = {
            name: 'PersonalPortfolio',
            totalValue: lastTotal,
            holdings: [
                {
                    id: 'US64110L1061',
                    idType: 'ISIN',
                    weight: 50
                },
                {
                    id: 'US5949181045',
                    idType: 'ISIN',
                    weight: 50
                }
            ]
        };
    */
    const commonGaugeOptions = {
        chart: {
            type: 'gauge',
            className: 'highcharts-gauge-chart',
            marginBottom: 0
        },
        pane: {
            startAngle: -90,
            endAngle: 89.9,
            background: null,
            center: ['50%', '64%'],
            size: '100%'
        },
        yAxis: {
            visible: true,
            min: 0,
            minorTickInterval: null,
            labels: {
                distance: 12,
                allowOverlap: true
            }
        },
        tooltip: {
            enabled: false
        },
        plotOptions: {
            series: {
                dial: {
                    baseWidth: 12,
                    baseLength: 0,
                    rearLength: 0
                },
                pivot: {
                    radius: 5
                },
                dataLabels: {
                    useHTML: true
                }
            }
        }
    };

    Dashboards.board('container', {
        dataPool: {
            connectors: [{
                type: 'JSON',
                id: 'stock-grid',
                options: {
                    data
                }
            }
            /* { // TODO: wait for this to go live
                id: 'risk-score',
                type: 'MorningstarRiskScore',
                options: {
                    portfolios: [
                        portfolio
                    ],
                    ...commonOptions
                }
            }*/]
        },
        gui: {
            layouts: [{
                rows: [{
                    cells: [{
                        id: 'kpi-wrapper',
                        layout: {
                            rows: [{
                                cells: [{
                                    id: 'kpi-holding'
                                }, {
                                    id: 'kpi-balance'
                                }]
                            }]
                        }
                    }]
                }, {
                    cells: [{
                        id: 'wallet'
                    }]
                }, {
                    cells: [{
                        id: 'data-grid'
                    }]
                }, {
                    cells: [{
                        id: 'gauge-risk'
                    }]
                }]
            }]
        },
        components: [{
            type: 'KPI',
            renderTo: 'kpi-holding',
            value: lastTotal,
            valueFormat: '€{value:.2f}',
            title: 'Holding'
        }, {
            type: 'KPI',
            renderTo: 'kpi-balance',
            value: 8000,
            title: 'Balance',
            valueFormat: '€{value:.2f}'
        }, {
            type: 'Highcharts',
            chartConstructor: 'stockChart',
            renderTo: 'wallet',
            chartOptions: {
                plotOptions: {
                    series: {
                        marker: {
                            enabled: false
                        }
                    }
                },
                chart: {
                    className: 'wallet',
                    height: 500
                },
                rangeSelector: {
                    animate: false,
                    x: 0,
                    y: 0,
                    buttonSpacing: 40,
                    inputEnabled: false,
                    dropdown: 'never',
                    selected: 4
                },
                navigator: {
                    enabled: false
                },
                title: {
                    text: 'Holding over time'
                },
                tooltip: {
                    format: '€{y:.2f}'
                },
                series: [{
                    name: 'Total',
                    data: walletTotal
                }]

            }
        }, {
            type: 'DataGrid',
            connector: {
                id: 'stock-grid'
            },
            renderTo: 'data-grid',
            dataGridOptions: {

            }
        }, {
            renderTo: 'gauge-risk',
            type: 'KPI',
            /*
                connector: { // TODO: wait for this to go live
                    id: 'risk-score',
                    columnAssignment: [
                        {
                            seriesId: 'kpi-risk-score',
                            data: ['PersonalPortfolio_RiskScore']
                        }
                    ]
                }
            */
            chartOptions: Highcharts.merge(commonGaugeOptions, {
                title: {
                    text: 'Risk score'
                },
                accessibility: {
                    point: {
                        valueDescriptionFormat: 'Risk score.'
                    }
                },

                series: [{
                    id: 'kpi-risk-score',
                    data: [mockRiskScore.riskScores[0].portfolio.riskScore]
                }],
                yAxis: {
                    borderRadius: 30,
                    max: 100,
                    plotBands: [{
                        from: 0,
                        to: 50,
                        className: 'band-0',
                        borderRadius: '50%',
                        thickness: 20
                    }, {
                        from: 50,
                        to: 100,
                        className: 'band-5',
                        borderRadius: '50%',
                        thickness: 20
                    }, {
                        from: 23,
                        to: 40,
                        className: 'band-1',
                        thickness: 20
                    }, {
                        from: 40,
                        to: 60,
                        className: 'band-2',
                        thickness: 20
                    }, {
                        from: 60,
                        to: 78,
                        className: 'band-3',
                        thickness: 20
                    }, {
                        from: 78,
                        to: 92,
                        className: 'band-4',
                        thickness: 20
                    }]
                }
            })
        }]
    });
});
