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
    const { interval, amount } = investmentPlan,
        portfolioValues = [];
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


const getHoldings = weight =>  stockCollection.map(stock => ({
    id: stock.ISIN,
    idType: 'ISIN',
    ...(weight && { weight })
}));

// Morningstar data fetch
const commonMSOptions = {
    api: {
        url: 'https://demo-live-data.highcharts.com',
        access: {
            url: 'https://demo-live-data.highcharts.com/token/oauth',
            username: 'username',
            password: 'password'
        }
    }
};


function sumAllArrays(arr) {
    return arr.reduce((acc, current) => acc.map((num, idx) =>
        [num[0], num[1] + current[idx][1]]
    ));
}


(async () => {
    // eslint-disable-next-line no-undef
    const timeSeriesConnector = new Connectors.Morningstar
        .TimeSeriesConnector({
            ...commonMSOptions,
            series: {
                type: 'Price'
            },
            securities: getHoldings(),
            currencyId: 'EUR',
            startDate: '2022-01-01',
            endDate: '2023-12-31'
        });


    await timeSeriesConnector.load();

    const { Date: dates, ...companies } =
        timeSeriesConnector.table.getColumns();

    const processedData = Object.fromEntries(
        Object.entries(companies).map(([key, values]) => [
            key,
            values.map((value, i) => [dates[i], value])
        ])
    );

    const holdings = [],
        dataGridData = [];

    stockCollection.forEach(stock => {
        holdings.push(generatePortfolio(
            basicInvestmentPlan, processedData[stock.SecID]
        ));
    });

    const walletTotal = sumAllArrays(holdings),
        lastTotal = walletTotal[walletTotal.length - 1][1],
        annualInvestment = 200 * 12 * holdings.length,
        // eslint-disable-next-line no-undef
        goalAnalysisConnector = new Connectors.Morningstar
            .GoalAnalysisConnector({
                ...commonMSOptions,
                annualInvestment,
                assetClassWeights: [
                    1
                ],
                currentSavings: lastTotal,
                includeDetailedInvestmentGrowthGraph: true,
                target: 100000,
                timeHorizon: 5
            });

    await goalAnalysisConnector.load();

    // Generate columns for the datagrid
    stockCollection.forEach((stock, i) => {
        const len = holdings[i].length,
            lastHolding = holdings[i][len - 1][1],
            ISIN = stock.ISIN,
            tradingSymbol = stock.tradingSymbol;
        dataGridData.push([
            tradingSymbol,
            ISIN,
            Math.round(lastHolding / lastTotal * 100)
        ]);
    });

    // Generate portfolio for risk score
    const portfolio = {
        name: 'PersonalPortfolio',
        currency: 'EUR',
        totalValue: lastTotal,
        // Holdings with equal weights
        holdings: getHoldings(100 / stockCollection.length)
    };

    // Creating chart and KPI options
    const walletChartOptions = {
        plotOptions: {
            series: {
                marker: {
                    enabled: false
                }
            }
        },
        chart: {
            height: 400
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
        }],

        responsive: {
            rules: [{
                condition: {
                    maxWidth: 731
                },
                chartOptions: {
                    chart: {
                        height: 300
                    },
                    rangeSelector: {
                        enabled: false
                    },
                    scrollbar: {
                        enabled: false
                    }
                }
            }]
        }

    };

    const riskScoreKPIOptions = {
        chart: {
            height: 186,
            type: 'solidgauge'
        },
        pane: {
            background: [{
                backgroundColor: '#EEE',
                borderRadius: 30,
                borderWidth: 0,
                outerRadius: '100%',
                innerRadius: '90%',
                shape: 'arc'
            }],
            size: 250,
            center: ['50%', '90%'],
            endAngle: 80,
            startAngle: -80
        },
        tooltip: {
            enabled: false
        },
        plotOptions: {
            series: {
                borderRadius: 30,
                innerRadius: '90%',
                dataLabels: {
                    format: '<div style="text-align:center; ' +
                        'margin-top: -20px">' +
                    '<div style="font-size:1.2em;">{y:.0f}</div>' +
                    '<div style="font-size:14px; opacity:0.4; ' +
                    'text-align: center;">Risk score</div>' +
                    '</div>',
                    useHTML: true
                }
            }
        },
        accessibility: {
            point: {
                valueDescriptionFormat: 'Risk score.'
            }
        },

        yAxis: {
            visible: true,
            tickPositions: [23, 40, 60, 78, 90],
            tickLength: 20,
            min: 0,
            max: 100,
            labels: {
                enabled: false
            },
            zIndex: 10
        }
    };
    const goalAnalysisKPIOptions = {
        chart: {
            height: 186,
            type: 'solidgauge'
        },
        pane: {
            startAngle: 0,
            endAngle: 360,
            background: [{
                innerRadius: '90%',
                outerRadius: '110%'
            }]
        },
        yAxis: {
            min: 0,
            max: 100,
            lineWidth: 0,
            minorTickInterval: null,
            tickAmount: 2
        },
        series: [{
            borderRadius: 30,
            dataLabels: {
                format: '<div style="text-align:center; ' +
                    'margin-top: -20px">' +
                '<div style="font-size:1.2em;">{y}%</div>' +
                '<div style="font-size:14px; opacity:0.4; ' +
                'text-align: center;">Goal probability</div>' +
                '</div>',
                useHTML: true
            },
            innerRadius: '90%',
            radius: '110%'
        }]
    };

    // Creating the dashboard
    Dashboards.board('container', {
        dataPool: {
            connectors: [{
                type: 'JSON',
                id: 'stock-grid',
                options: {
                    columnNames: ['name', 'ISIN', 'percentage'],
                    firstRowAsNames: false,
                    data: dataGridData
                }
            },
            {
                id: 'risk-score',
                type: 'MorningstarRiskScore',
                options: {
                    ...commonMSOptions,
                    portfolios: [
                        portfolio
                    ]
                }
            }]
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
                        id: 'wallet-chart'
                    }]
                }, {
                    cells: [{
                        id: 'data-grid'
                    }, {
                        id: 'kpi-gauge-risk'
                    }]
                },  {
                    cells: [{
                        id: 'goal-analysis-wrapper',
                        layout: {
                            rows: [{
                                cells: [{
                                    id: 'kpi-gauge-goal'
                                }, {
                                    id: 'kpi-goal-target'
                                }, {
                                    id: 'kpi-goal-years'
                                }, {
                                    id: 'kpi-goal-annual'
                                }]
                            }]
                        }
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
            renderTo: 'wallet-chart',
            chartOptions: walletChartOptions
        }, {
            type: 'DataGrid',
            connector: {
                id: 'stock-grid'
            },
            renderTo: 'data-grid',
            dataGridOptions: {
                credits: {
                    enabled: false
                }
            }
        }, {
            renderTo: 'kpi-gauge-risk',
            type: 'KPI',
            connector: {
                id: 'risk-score'
            },
            columnName: 'PersonalPortfolio_RiskScore',
            chartOptions: riskScoreKPIOptions
        }, {
            type: 'KPI',
            renderTo: 'kpi-goal-target',
            value: goalAnalysisConnector.metadata.financialGoal,
            valueFormat: '€{value:.2f}',
            title: 'Financial goal'
        }, {
            type: 'KPI',
            renderTo: 'kpi-goal-years',
            value: goalAnalysisConnector.metadata.years,
            title: 'Years'
        }, {
            type: 'KPI',
            renderTo: 'kpi-goal-annual',
            value: annualInvestment,
            valueFormat: '€{value:.2f}',
            title: 'Annual investment'
        }, {
            renderTo: 'kpi-gauge-goal',
            type: 'KPI',
            value: goalAnalysisConnector.metadata.probabilityOfReachingTarget,
            chartOptions: goalAnalysisKPIOptions
        }]
    });
})();
