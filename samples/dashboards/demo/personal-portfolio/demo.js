// Todo: put into array?
const investmentData1 = {
        investmentDays: [4, 6, 10], // Inves2,tment days
        investments: [100, 100, 100] // Amounts invested on those days
    // Todo: metadata linking to a stock?
    },
    investmentData2 = {
        investmentDays: [1, 4, 7], // Investment days
        investments: [200, 10, 800] // Amounts invested on those days
        // Todo: metadata linking to a stock?
    };


// Loop over each day to calculate portfolio value and total units
const generatePortfolio = (investment, stockPrices) => {
    const { investmentDays, investments } = investment;
    const portfolioValues = [];
    let totalUnits = 0;
    stockPrices.forEach((priceData, day) => {
        // Check if it's an investment day
        if (investmentDays.includes(day)) {
            const investmentIndex = investmentDays.indexOf(day),
                unitsBought = investments[investmentIndex] / priceData[1];
            totalUnits += unitsBought;
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
    securities: [
        {
            id: 'US64110L1061',
            idType: 'ISIN'
        }, {
            id: 'US5949181045',
            idType: 'ISIN'
        }
    ],
    currencyId: 'EUR'
});

// TODO: Wait for this to go live?
/*
const riskScoreConnector = new Connectors.Morningstar.RiskScoreConnector({
    ...commonOptions,
    portfolios: [
        {
            name: 'MyPortfolio',
            currency: 'USD',
            totalValue: 100,
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
        }
    ]
});
*/

/*
const riskScoreConnector = new Connectors.Morningstar.RiskScoreConnector({
    ...commonOptions,
    portfolios: [
        {
            name: 'test1',
            currency: 'EUR',
            totalValue: 1000,
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
        }
    ]
})*/

// Mock risk score:

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

const sumAllArrays = data => {
    // Initialize an empty object to accumulate sums by time
    const valueSumsByTime = {};

    // Iterate over each array in the data
    data.forEach(arr => {
        arr.forEach(([time, value]) => {
            // If this time doesn't exist in the result object, initialize it
            if (!valueSumsByTime[time]) {
                valueSumsByTime[time] = 0;
            }
            // Sum the values for the corresponding time
            valueSumsByTime[time] += value;
        });
    });

    // Convert the result object to an array of arrays [time, sum]
    const resultArray =
        Object.entries(valueSumsByTime).map(
            ([time, sum]) => [Number(time), sum]
        );

    return resultArray;
};

Promise.all([
    connector.load()
]).then(() => {

    // morningStarData = connector.table.getRows(0, undefined);

    const { Date: dates, ...companies } = connector.table.getColumns();

    const processedData = Object.fromEntries(
        Object.entries(companies).map(([key, values]) => [
            key,
            values.map((value, i) => [dates[i], value])
        ])
    );

    const netflixHolding = generatePortfolio(
            investmentData1,
            processedData['0P0001BUL2']
        ),
        microsoftHolding = generatePortfolio(
            investmentData2,
            processedData['0P0001BUL3']
        );

    const walletTotal = sumAllArrays([netflixHolding, microsoftHolding]);
    const lastTotal = walletTotal[walletTotal.length - 1][1];

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
            valueFormat: '${value:.2f}',
            title: 'Holding'
        }, {
            type: 'KPI',
            renderTo: 'kpi-balance',
            value: 8,
            title: 'Balance',
            valueFormat: '${value}'
        }, {
            type: 'Highcharts',
            chartConstructor: 'stockChart',
            renderTo: 'wallet',
            chartOptions: {
                chart: {
                    type: 'areaspline'
                },
                title: {
                    text: 'Holding over time'
                },

                series: [{
                    data: netflixHolding
                }, {
                    data: microsoftHolding
                }, {
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
