// Morningstar creds
const commonMSOptions = {
    api: {
        url: 'https://demo-live-data.highcharts.com',
        access: {
            url: 'https://demo-live-data.highcharts.com/token/oauth',
            token: 'your-access-token'
        }
    }
};


const basicInvestmentPlan = {
    interval: 30, // Every 30 days
    amount: 200   // Amount in EUR
};


const stockCollection = [{
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
}];


// Simulation of personal portfolio
const generatePortfolio = (investmentPlan, stockPrices) => {
    const { interval, amount } = investmentPlan,
        holding = [],
        investedAmount = [];
    let totalUnits = 0,
        investedSoFar = 0;
    stockPrices.forEach((priceData, day) => {
        // Check if it's an investment day
        if ((day % interval) === 0) {
            totalUnits += amount / priceData[1];
            investedSoFar += amount;
        }

        // Calculate portfolio value for the day
        const value = totalUnits * priceData[1];
        holding.push(value);
        investedAmount.push(investedSoFar);
    });
    return {
        holding, // Values based on units held and price
        investedAmount // Invested amount accumulated over time
    };
};


const getHoldings = weight => stockCollection.map(stock => ({
    id: stock.ISIN,
    idType: 'ISIN',
    ...(weight && { weight })
}));


// Return the sum of the last indices of arrays
const getCurrentTotal = arrOfArr => {
    let sum = 0;
    arrOfArr.forEach(arr => {
        sum += arr.at(-1);
    });

    return sum;
};

(async () => {
    const timeSeriesConnector = new HighchartsConnectors.Morningstar
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
        investedAmounts = [],
        dataGridData = [];

    stockCollection.forEach(stock => {
        const { holding, investedAmount } = generatePortfolio(
            basicInvestmentPlan,
            processedData[stock.SecID]
        );

        holdings.push(holding);
        investedAmounts.push(investedAmount);

    });

    const investedAmountTotal = getCurrentTotal(investedAmounts),
        lastHoldingTotal = getCurrentTotal(holdings),
        annualInvestment = 200 * 12 * holdings.length;

    // Generate columns for the datagrid
    stockCollection.forEach((stock, i) => {
        const len = holdings[i].length,
            lastHolding = holdings[i][len - 1],
            ISIN = stock.ISIN,
            tradingSymbol = stock.tradingSymbol;

        dataGridData.push([
            tradingSymbol,
            ISIN,
            Math.round(lastHolding / lastHoldingTotal * 100)
        ]);
    });

    // Generate portfolio for risk score
    const portfolio = {
        name: 'PersonalPortfolio',
        currency: 'EUR',
        totalValue: lastHoldingTotal,
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
        accessibility: {
            description: 'displaying portfolio performance and investments'
        },
        rangeSelector: {
            inputEnabled: false,
            selected: 4
        },
        navigator: {
            enabled: false
        },
        title: {
            text: 'Portfolio performance'
        },
        yAxis: {
            accessibility: {
                description: 'price in euro'
            }
        },
        tooltip: {
            format: '<b>{x:%e - %b - %Y}</b><br/>' +
                'Invested: €{points.1.y:,.2f}<br/>' +
                'Holding: €{points.0.y:,.2f}<br/>' +
                'Yield: {(multiply (divide (subtract points.0.y points.1.y)' +
                ' points.1.y) 100):,.0f}%'
        },
        series: [{
            name: 'Holding',
            id: 'holding'
        }, {
            name: 'Invested',
            id: 'invested',
            className: 'dotted-line'
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
                    }
                }
            }]
        }

    };

    const riskScoreKPIOptions = {
        chart: {
            height: 186,
            type: 'solidgauge',
            className: 'hidden-title'
        },
        title: {
            text: 'Risk score',
            floating: true
        },
        pane: {
            background: [{
                borderRadius: 30,
                borderWidth: 0,
                outerRadius: '100%',
                innerRadius: '85%',
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
                borderRadius: 20,
                innerRadius: '85%',
                dataLabels: {
                    format: '<div style="text-align:center; ' +
                        'margin-top: -20px">' +
                    '<div style="font-size:1.6em;">{y:.0f}</div>' +
                    '<div style="font-size:14px; opacity:0.5; ' +
                    'text-align: center;">Risk score</div>' +
                    '</div>',
                    useHTML: true
                }
            }
        },
        accessibility: {
            typeDescription: 'half circular gauge',
            description: 'displaying the portfolio risk',
            point: {
                descriptionFormat: 'risk score {y:.0f}'
            }
        },
        yAxis: {
            accessibility: {
                description: 'risk score'
            },
            visible: true,
            tickPositions: [23, 40, 60, 78, 90],
            minorTickWidth: 0,
            tickLength: 50,
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
            type: 'solidgauge',
            className: 'hidden-title'
        },
        title: {
            text: 'Goal probability',
            floating: true
        },
        pane: {
            startAngle: 0,
            endAngle: 360,
            background: [{
                innerRadius: '90%',
                outerRadius: '115%'
            }]
        },
        accessibility: {
            typeDescription: 'circular gauge',
            description: 'displaying the probability of reaching the' +
                'financial goal',
            point: {
                descriptionFormat: 'probability {y:.0f}%'
            }
        },
        yAxis: {
            accessibility: {
                description: 'probability'
            },
            min: 0,
            max: 100,
            minorTickInterval: null
        },
        tooltip: {
            enabled: false
        },
        series: [{
            borderRadius: 30,
            dataLabels: {
                format: '<div style="text-align:center; ' +
                    'margin-top: -40px">' +
                    '<div style="font-size:1.4em;">{y}%</div>' +
                    '<div style="font-size:14px; opacity:0.5; ' +
                    'text-align: center;">Goal probability</div>' +
                    '</div>',
                useHTML: true
            },
            innerRadius: '90%',
            radius: '115%'
        }]
    };

    Highcharts.setOptions({
        chart: {
            styledMode: true
        },
        lang: {
            rangeSelectorZoom: ''
        }
    });

    // Creating the dashboard
    const board = await Dashboards.board('container', {
        dataPool: {
            connectors: [{
                id: 'investment-data',
                type: 'JSON',
                options: {
                    data: [dates, ...investedAmounts],
                    orientation: 'columns',
                    firstRowAsNames: false,
                    dataModifier: {
                        type: 'Math',
                        columnFormulas: [{
                            column: 'investmentAccumulation',
                            formula: '=SUM(B1:ZZ1)'
                        }]
                    }
                }
            }, {
                id: 'holding-data',
                type: 'JSON',
                options: {
                    data: [dates, ...holdings],
                    orientation: 'columns',
                    firstRowAsNames: false,
                    dataModifier: {
                        type: 'Math',
                        columnFormulas: [{
                            column: 'holdingAccumulation',
                            formula: '=SUM(B1:ZZ1)'
                        }]
                    }
                }
            }, {
                id: 'stock-grid',
                type: 'JSON',
                options: {
                    columnNames: ['Name', 'ISIN', 'Percentage'],
                    firstRowAsNames: false,
                    data: dataGridData
                }
            }, {
                id: 'risk-score',
                type: 'MorningstarRiskScore',
                options: {
                    ...commonMSOptions,
                    portfolios: [
                        portfolio
                    ]
                }
            }, {
                id: 'goal-analysis',
                type: 'MorningstarGoalAnalysis',
                options: {
                    ...commonMSOptions,
                    annualInvestment,
                    assetClassWeights: [
                        1
                    ],
                    currentSavings: lastHoldingTotal,
                    includeDetailedInvestmentGrowthGraph: true,
                    target: 100000,
                    timeHorizon: 5
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
                                    id: 'kpi-invested'
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
            value: lastHoldingTotal,
            valueFormat: '€{value:,.2f}',
            title: 'Holding'
        }, {
            type: 'KPI',
            renderTo: 'kpi-invested',
            value: investedAmountTotal,
            valueFormat: '€{value:,.2f}',
            title: 'Invested'
        }, {
            type: 'Highcharts',
            chartConstructor: 'stockChart',
            renderTo: 'wallet-chart',
            connector: [{
                id: 'holding-data',
                columnAssignment: [{
                    seriesId: 'holding',
                    data: ['0', 'holdingAccumulation']
                }]
            }, {
                id: 'investment-data',
                columnAssignment: [{
                    seriesId: 'invested',
                    data: ['0', 'investmentAccumulation']
                }]
            }],
            chartOptions: walletChartOptions
        }, {
            type: 'DataGrid',
            connector: {
                id: 'stock-grid'
            },
            renderTo: 'data-grid',
            dataGridOptions: {
                rendering: {
                    rows: {
                        strictHeights: true
                    }
                },
                columns: [{
                    id: 'Percentage',
                    header: {
                        format: 'Wallet percentage'
                    },
                    cells: {
                        format: '{value}%'
                    }
                }],
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
            id: 'cpt-goal-target',
            renderTo: 'kpi-goal-target',
            connector: {
                id: 'goal-analysis'
            },
            valueFormat: '€{value:,.2f}',
            title: 'Financial goal'
        }, {
            type: 'KPI',
            id: 'cpt-goal-years',
            renderTo: 'kpi-goal-years',
            title: 'Years'
        }, {
            type: 'KPI',
            id: 'cpt-goal-annual',
            renderTo: 'kpi-goal-annual',
            value: annualInvestment,
            valueFormat: '€{value:,.2f}',
            title: 'Annual investment'
        }, {
            renderTo: 'kpi-gauge-goal',
            id: 'cpt-goal-prob',
            type: 'KPI',
            chartOptions: goalAnalysisKPIOptions
        }]
    }, true);

    // Update the goal analysis KPIs after loading the connector
    const res = await board;

    // Access relevant metadata
    const {
        years,
        probabilityOfReachingTarget,
        financialGoal
    } = res.dataPool.connectors['goal-analysis'].metadata;

    // Get relevant components
    const goalYearsCpt = res.getComponentById('cpt-goal-years'),
        goalCpt = res.getComponentById('cpt-goal-prob'),
        goalTargetCpt = res.getComponentById('cpt-goal-target');

    // Updates
    goalYearsCpt.update({
        value: years
    });

    goalCpt.update({
        value: probabilityOfReachingTarget
    });

    goalTargetCpt.update({
        value: financialGoal
    });
})();
