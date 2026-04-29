function accounting() {
    Highcharts.setOptions({
        chart: {
            styledMode: true
        },
        lang: {
            locale: 'en-us'
        }
    });

    const currentMonth = Date.UTC(2023, 9);
    const revTarget = 105;
    const costTarget = 89;

    const currentYear = new Date(currentMonth).getFullYear();

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
            size: '110%'
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
                    format: '${y}M'
                }
            }
        }
    };

    const commonColumnOptions = {
        accessibility: {
            point: {
                valuePrefix: '$'
            }
        },
        chart: {
            type: 'column',
            className: 'highcharts-column-chart'
        },
        credits: {
            enabled: false
        },
        xAxis: {
            type: 'datetime',
            min: Date.UTC(currentYear),
            max: Date.UTC(currentYear, 11)
        },
        yAxis: {
            tickInterval: 2e6
        },
        series: [{
            name: 'Budget',
            id: 'budget-series',
            colorIndex: 1
        }],
        tooltip: {
            format: `<span style="font-size: 10px">{x:%B %Y}</span><br>
            <span class="highcharts-color-{colorIndex}">●</span>
            {series.name}: {(divide y 1000000):.2f}M
        `
        }
    };

    const board = Dashboards.board('container', {
        dataPool: {
            connectors: [{
                type: 'CSV',
                id: 'data',
                csv: document.getElementById('csv').innerHTML,
                dataModifier: {
                    type: 'Math',
                    columnFormulas: [{
                        column: 'Result', // I
                        formula: 'D1-C1'
                    }, {
                        column: 'AccResult', // J
                        formula: 'SUM(I$1:I1)'
                    }, {
                        column: 'CostPredA', // K
                        formula: 'AVERAGE(E1,G1)'
                    }, {
                        column: 'RevPredA', // L
                        formula: 'AVERAGE(F1, H1)'
                    }, {
                        column: 'AccResPredP', // M
                        formula: 'J1+SUM(F$1:F1)-SUM(E$1:E1)'
                    }, {
                        column: 'AccResPredO', // N
                        formula: 'J1+SUM(H$1:H1)-SUM(G$1:G1)'
                    }, {
                        column: 'ResPredA', // O
                        formula: 'L1-K1'
                    }, {
                        column: 'AccResPredA', // P
                        formula: 'J1+SUM(O$1:O1)'
                    }]
                }
            }]
        },
        gui: {
            layouts: [{
                id: 'layout-1',
                rows: [{
                    cells: [{
                        id: 'kpi-layout-cell',
                        layout: {
                            rows: [{
                                cells: [{
                                    id: 'rev-chart-kpi'
                                }, {
                                    id: 'rev-forecast-kpi'
                                }, {
                                    id: 'rev-goal-forecast-kpi'
                                }]
                            }, {
                                cells: [{
                                    id: 'cost-chart-kpi'
                                }, {
                                    id: 'cost-forecast-kpi'
                                }, {
                                    id: 'cost-goal-forecast-kpi'
                                }]
                            }, {
                                cells: [{
                                    id: 'res-chart-kpi'
                                }, {
                                    id: 'res-forecast-kpi'
                                }, {
                                    id: 'res-goal-forecast-kpi'
                                }]
                            }]
                        }
                    }, {
                        id: 'stock-cell'
                    }]
                }, {
                    cells: [{
                        id: 'rev-chart'
                    }, {
                        id: 'cost-chart'
                    }]
                }]
            }]
        },
        components: [{
            renderTo: 'rev-chart-kpi',
            type: 'KPI',
            chartOptions: Highcharts.merge(commonGaugeOptions, {
                title: {
                    text: 'Revenue (YTD)'
                },
                accessibility: {
                    point: {
                        // eslint-disable-next-line max-len
                        valueDescriptionFormat: 'YTD revenue is {value} million $.'
                    }
                },
                yAxis: {
                    max: 102,
                    tickPositions: [73, 83, 92, 102],
                    plotBands: [{
                        from: 0,
                        to: 73,
                        className: 'null-band'
                    }, {
                        from: 73,
                        to: 83,
                        className: 'warn-band'
                    }, {
                        from: 83,
                        to: 92,
                        className: 'opt-band'
                    }, {
                        from: 92,
                        to: 102,
                        className: 'high-band'
                    }]
                }
            })
        }, {
            renderTo: 'rev-forecast-kpi',
            type: 'KPI',
            title: `Revenue forecast for ${currentYear}:`,
            valueFormat: '${value}M'
        }, {
            renderTo: 'rev-goal-forecast-kpi',
            type: 'KPI',
            title: 'Revenue goal will be achieved at:',
            valueFormat: '{value}%'
        }, {
            renderTo: 'cost-chart-kpi',
            type: 'KPI',
            chartOptions: Highcharts.merge(commonGaugeOptions, {
                title: {
                    text: 'Cost (YTD)'
                },
                accessibility: {
                    point: {
                        valueDescriptionFormat: 'YTD cost is {value} million $.'
                    }
                },
                yAxis: {
                    max: 86,
                    tickPositions: [61, 70, 78, 86],
                    plotBands: [{
                        from: 0,
                        to: 61,
                        className: 'null-band'
                    }, {
                        from: 61,
                        to: 70,
                        className: 'warn-band'
                    }, {
                        from: 70,
                        to: 78,
                        className: 'opt-band'
                    }, {
                        from: 78,
                        to: 86,
                        className: 'warn-band'
                    }]
                }
            })
        }, {
            renderTo: 'cost-forecast-kpi',
            type: 'KPI',
            title: `Cost forecast for ${currentYear}:`,
            valueFormat: '${value}M'
        }, {
            renderTo: 'cost-goal-forecast-kpi',
            type: 'KPI',
            title: 'Cost goal will be achieved at:',
            valueFormat: '{value}%'
        }, {
            renderTo: 'res-chart-kpi',
            type: 'KPI',
            chartOptions: Highcharts.merge(commonGaugeOptions, {
                title: {
                    text: 'Result (YTD)'
                },
                accessibility: {
                    point: {
                        // eslint-disable-next-line max-len
                        valueDescriptionFormat: 'YTD result is {value} million $.'
                    }
                },
                yAxis: {
                    max: 21,
                    tickPositions: [6, 10, 16, 21],
                    plotBands: [{
                        from: 0,
                        to: 6,
                        className: 'null-band'
                    }, {
                        from: 6,
                        to: 10,
                        className: 'warn-band'
                    }, {
                        from: 10,
                        to: 16,
                        className: 'opt-band'
                    }, {
                        from: 16,
                        to: 21,
                        className: 'high-band'
                    }]
                }
            })
        }, {
            renderTo: 'res-forecast-kpi',
            type: 'KPI',
            title: `Result forecast for ${currentYear}:`,
            valueFormat: '${value}M'
        }, {
            renderTo: 'res-goal-forecast-kpi',
            type: 'KPI',
            title: 'Result goal will be achieved at:',
            valueFormat: '{value}%'
        }, {
            renderTo: 'rev-chart',
            type: 'Highcharts',
            connector: {
                id: 'data',
                columnAssignment: [{
                    seriesId: 'budget-series',
                    data: ['Date', 'Budget']
                }, {
                    seriesId: 'Revenue',
                    data: ['Date', 'Revenue']
                }]
            },
            sync: {
                highlight: true
            },
            chartOptions: {
                ...commonColumnOptions,
                title: {
                    text: 'Revenue'
                }
            }
        }, {
            renderTo: 'cost-chart',
            type: 'Highcharts',
            connector: {
                id: 'data',
                columnAssignment: [{
                    seriesId: 'budget-series',
                    data: ['Date', 'Budget']
                }, {
                    seriesId: 'Cost',
                    data: ['Date', 'Cost']
                }]
            },
            sync: {
                highlight: true
            },
            chartOptions: {
                ...commonColumnOptions,
                title: {
                    text: 'Cost'
                }
            }
        }, {
            renderTo: 'stock-cell',
            type: 'Highcharts',
            chartConstructor: 'stockChart',
            connector: {
                id: 'data',
                columnAssignment: [{
                    seriesId: 'result',
                    data: ['Date', 'AccResPredA']
                }, {
                    seriesId: 'pessimistically',
                    data: ['Date', 'AccResPredP']
                }, {
                    seriesId: 'optimistically',
                    data: ['Date', 'AccResPredO']
                }]
            },
            sync: {
                highlight: true
            },
            tooltip: {
                useHTML: true
            },
            chartOptions: {
                chart: {
                    className: 'highcharts-stock-chart'
                },
                title: {
                    text: 'Accumulated Result with Forecast'
                },
                subtitle: {
                    text: 'From January 2019 to December 2024'
                },
                accessibility: {
                    point: {
                        valuePrefix: '$'
                    }
                },
                xAxis: {
                    plotLines: [{
                        value: currentMonth,
                        label: {
                            text: 'current month'
                        }
                    }, {
                        value: Date.UTC(currentYear, 0),
                        className: 'year-plotline'
                    }, {
                        value: Date.UTC(currentYear, 11),
                        className: 'year-plotline'
                    }]
                },
                rangeSelector: {
                    buttons: [{
                        type: 'month',
                        count: 6,
                        text: '6m',
                        title: 'View 6 months'
                    }, {
                        type: 'year',
                        count: 1,
                        text: '1y',
                        title: 'View 1 year'
                    }, {
                        type: 'year',
                        count: 3,
                        text: '3y',
                        title: 'View 3 years'
                    }, {
                        type: 'ytd',
                        text: 'YTD',
                        title: 'View year to date'
                    }, {
                        type: 'all',
                        text: 'All',
                        title: 'View all'
                    }],
                    selected: 2
                },
                tooltip: {
                    formatter: function () {
                        const { x, points } = this;
                        const format = v => '$' + (v / 1e6).toFixed(2) + 'M';
                        const color = (s, color) => `
                        <span class="highcharts-color-${color}">${s}</span>
                    `;
                        const date = Highcharts.dateFormat('%B %Y', x);

                        if (x <= currentMonth) {
                            // eslint-disable-next-line max-len
                            return `<span style="font-size: 10px">${date}</span><br>
                            ${color('●', 0)}
                            Result: ${color(format(points[0].y), 0)}
                        `;
                        }

                        return `<span style="font-size: 10px">
                            Forecast for ${date}
                        </span><br>
                        ${color('➚', 2)}
                        Optimistically: ${color(format(points[2].y), 2)}<br>
                        ${color('●', 0)}
                        Average: ${color(format(points[0].y), 0)}<br>
                        ${color('➘', 1)}
                        Pessimistically: ${color(format(points[1].y), 1)}
                    `;
                    }
                },
                credits: {
                    enabled: false
                },
                series: [{
                    name: 'Result',
                    id: 'result',
                    zIndex: 2
                }, {
                    name: 'Pessimistically',
                    id: 'pessimistically'
                }, {
                    name: 'Optimistically',
                    id: 'optimistically'
                }]
            }
        }]
    }, true);

    board.then(res => {
        // eslint-disable-next-line max-len
        const table = res.dataPool.connectors.data.getTable().getModified().columns;

        const revKPI = res.mountedComponents[0].component;
        const revForecast = res.mountedComponents[1].component;
        const revGoalForecast = res.mountedComponents[2].component;
        const costKPI = res.mountedComponents[3].component;
        const costForecast = res.mountedComponents[4].component;
        const costGoalForecast = res.mountedComponents[5].component;
        const resKPI = res.mountedComponents[6].component;
        const resForecast = res.mountedComponents[7].component;
        const resGoalForecast = res.mountedComponents[8].component;

        // eslint-disable-next-line max-len
        const firstRowID = table.Date.findIndex(d => d === Date.UTC(currentYear));
        const lastRowID = table.Date.findIndex(d => d === currentMonth);
        const forecastRowID =
        table.Date.findIndex(d => d === Date.UTC(currentYear, 11));

        let revYTD = 0,
            costYTD = 0;
        for (let i = firstRowID; i <= lastRowID; i++) {
            revYTD += table.Revenue[i] / 1e6;
            costYTD += table.Cost[i] / 1e6;
        }

        let revYearlyForecast = revYTD,
            costYearlyForecast = costYTD;
        for (let i = lastRowID + 1; i <= forecastRowID; i++) {
            revYearlyForecast += table.RevPredA[i] / 1e6;
            costYearlyForecast += table.CostPredA[i] / 1e6;
        }

        revKPI.update({
            caption: `${Math.round(revYTD / revTarget * 100)}% of annual target`
        });
        revKPI.chart.addSeries({ data: [revYTD] });

        costKPI.update({
            // eslint-disable-next-line max-len
            caption: `${Math.round(costYTD / costTarget * 100)}% of annual target`
        });
        costKPI.chart.addSeries({ data: [costYTD] });

        resKPI.update({
            caption: `${Math.round(
                (revYTD - costYTD) / (revTarget - costTarget) * 100
            )}% of annual target`
        });
        resKPI.chart.addSeries({
            data: [Math.round((revYTD - costYTD) * 10) / 10]
        });

        revForecast.update({
            value: revYearlyForecast.toFixed(2)
        });

        revGoalForecast.update({
            value: Math.round(revYearlyForecast / revTarget * 100)
        });

        costForecast.update({
            value: costYearlyForecast.toFixed(2)
        });

        costGoalForecast.update({
            value: Math.round(costYearlyForecast / costTarget * 100)
        });

        resForecast.update({
            value: (revYearlyForecast - costYearlyForecast).toFixed(2)
        });

        resGoalForecast.update({
            value: Math.round((
                revYearlyForecast - costYearlyForecast
            ) / (revTarget - costTarget) * 100)
        });
    });

}

function investing() {
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
        timeSeriesConnector.getTable().getColumns();

        const processedData = Object.fromEntries(
            Object.entries(companies).map(([key, values]) => [
                key,
                values.map((value, i) => [dates[i], value])
            ])
        );

        const holdings = [],
            investedAmounts = [],
            gridData = [];

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

        // Generate columns for the grid
        stockCollection.forEach((stock, i) => {
            const len = holdings[i].length,
                lastHolding = holdings[i][len - 1],
                ISIN = stock.ISIN,
                tradingSymbol = stock.tradingSymbol;

            gridData.push([
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
                }, {
                    id: 'holding-data',
                    type: 'JSON',
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
                }, {
                    id: 'stock-grid',
                    type: 'JSON',
                    columnIds: ['Name', 'ISIN', 'Percentage'],
                    firstRowAsNames: false,
                    data: gridData
                }, {
                    id: 'risk-score',
                    type: 'MorningstarRiskScore',
                    ...commonMSOptions,
                    portfolios: [
                        portfolio
                    ]
                }, {
                    id: 'goal-analysis',
                    type: 'MorningstarGoalAnalysis',
                    ...commonMSOptions,
                    annualInvestment,
                    assetClassWeights: [
                        1
                    ],
                    currentSavings: lastHoldingTotal,
                    includeDetailedInvestmentGrowthGraph: true,
                    target: 100000,
                    timeHorizon: 5
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
                            id: 'grid'
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
                type: 'Grid',
                connector: {
                    id: 'stock-grid'
                },
                renderTo: 'grid',
                gridOptions: {
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
                columnId: 'PersonalPortfolio_RiskScore',
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

}

function finance() {
    Highcharts.setOptions({
        chart: {
            styledMode: true
        }
    });
    Dashboards.board('container', {
        dataPool: {
            connectors: [{
                id: 'transactions',
                type: 'JSON',
                firstRowAsNames: false,
                columnIds: ['id', 'Receiver', 'Amount', 'Balance'],
                data: [
                    ['rsf934fds', 'John Doe', 100, 1000],
                    ['f0efnakr', 'Anna Smith', 200, 800],
                    ['mfaiks12', 'Robert Johnson', 300, 500],
                    ['15fqmfk', 'Susan Williams', 400, 100]
                ]
            }]
        },
        gui: {
            layouts: [{
                rows: [{
                    id: 'row-1',
                    cells: [{
                        id: 'dashboard-row-1-cell-1'
                    }, {
                        id: 'dashboard-row-1-cell-2'
                    }, {
                        id: 'dashboard-row-1-cell-3'
                    }]
                }, {
                    cells: [{
                        id: 'dashboard-row-2-cell-1'
                    }]
                }, {
                    cells: [{
                        id: 'dashboard-row-3-cell-1'
                    }, {
                        id: 'dashboard-row-3-cell-2'
                    }, {
                        id: 'dashboard-row-3-cell-3'
                    }]
                }]
            }]
        },
        components: [{
            type: 'KPI',
            renderTo: 'dashboard-row-1-cell-1',
            title: 'Total balance',
            value: 1430,
            valueFormat: '$ {value}',
            subtitle: '43%',
            linkedValueTo: {
                enabled: false
            },
            chartOptions: {
                chart: {
                    styledMode: true
                },
                series: [{
                    type: 'spline',
                    enableMouseTracking: false,
                    dataLabels: {
                        enabled: false
                    },
                    data: [1870, 1210, 1500, 1900, 1430]
                }]
            }
        }, {
            type: 'KPI',
            renderTo: 'dashboard-row-1-cell-2',
            title: 'Savings',
            value: 6500,
            valueFormat: '$ {value}',
            subtitle: '22%',
            linkedValueTo: {
                enabled: false
            },
            chartOptions: {
                chart: {
                    styledMode: true
                },
                series: [{
                    type: 'spline',
                    enableMouseTracking: false,
                    dataLabels: {
                        enabled: false
                    },
                    data: [0, 1000, 1000, 4500, 5300, 6500]
                }]
            }
        }, {
            type: 'HTML',
            renderTo: 'dashboard-row-1-cell-3',
            elements: [{
                tagName: 'div',
                children: [{
                    tagName: 'h4',
                    textContent: 'Check how you can save more!',
                    attributes: {
                        class: 'main-title'
                    }
                }, {
                    tagName: 'button',
                    textContent: 'Go to the saving account',
                    attributes: {
                        id: 'saving-button'
                    }
                }]
            }]
        }, {
            type: 'Highcharts',
            renderTo: 'dashboard-row-2-cell-1',
            title: 'Earnings',
            chartOptions: {
                chart: {
                    marginTop: 50
                },
                defs: {
                    gradient0: {
                        tagName: 'linearGradient',
                        id: 'gradient-0',
                        x1: 0,
                        y1: 0,
                        x2: 0,
                        y2: 1,
                        children: [{
                            tagName: 'stop',
                            offset: 0
                        }, {
                            tagName: 'stop',
                            offset: 1
                        }]
                    }
                },
                credits: {
                    enabled: false
                },
                title: {
                    text: ''
                },
                legend: {
                    enabled: false
                },
                xAxis: {
                    categories: [
                        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
                    ]
                },
                yAxis: [{
                    title: '',
                    labels: {
                        format: '{value} k'
                    }
                }],
                series: [{
                    type: 'areaspline',
                    dataLabels: {
                        enabled: false
                    },
                    marker: {
                        enabled: false
                    },
                    name: 'Earnings',
                    data: [10, 20, 30, 40, 12, 11, 10, 23, 4, 34, 50, 20]
                }]
            }
        }, {
            type: 'KPI',
            renderTo: 'dashboard-row-3-cell-1',
            title: 'Spendings',
            value: 350,
            valueFormat: '$ {value}',
            linkedValueTo: {
                enabled: false
            },
            chartOptions: {
                series: [{
                    type: 'column',
                    enableMouseTracking: false,
                    dataLabels: {
                        enabled: false
                    },
                    name: 'Spendings',
                    data: [45, 30, 50, 80, 10, 45, 30, 59, 39, 15, 62]
                }]
            }
        }, {
            type: 'KPI',
            renderTo: 'dashboard-row-3-cell-2',
            title: 'Your wallet condition',
            value: '',
            subtitle: 'You saved 1450$ this month',
            linkedValueTo: {
                enabled: false
            },
            chartOptions: {
                title: {
                    verticalAlign: 'middle',
                    floating: true,
                    text: '58%'
                },
                series: [{
                    type: 'pie',
                    enableMouseTracking: false,
                    data: [58, 42],
                    size: '100%',
                    innerSize: '75%',
                    dataLabels: {
                        enabled: false
                    }
                }]
            }
        }, {
            renderTo: 'dashboard-row-3-cell-3',
            connector: {
                id: 'transactions'
            },
            title: 'Transactions',
            type: 'Grid',
            gridOptions: {
                credits: {
                    enabled: false
                },
                rendering: {
                    theme: 'hcg-custom-theme'
                }
            }
        }]
    }, true);

}

const demoCard = document.getElementById('demoCard');
const chartDescription = document.getElementById('chartDescription');
const announce = document.getElementById('announce');


const dashboards = {
    accounting: {
        run: accounting,
        className: 'accounting',
        name: 'Accounting',
        demoCardLabel: 'Highcharts Accounting dashboard demo',
        chartDescription: `A purely decorative dashboard presenting sample 
        financial results of a company along with predictions, 
        as well as revenue and costs compared to the budget. `
    },
    investing: {
        run: investing,
        className: 'investing',
        name: 'Investing',
        demoCardLabel: 'Highcharts Investing dashboard demo',
        chartDescription: `A purely decorative dashboard simulating 
        a personal investment portfolio's performance over time, 
        incorporating analysis through the Morningstar connector. `
    },
    finance: {
        run: finance,
        className: 'finance',
        name: 'Finance',
        demoCardLabel: 'Highcharts Finance dashboard demo',
        chartDescription: `A purely decorative dashboard simulating 
        a personal finance dashboard. `
    }
};


// buttons


function selectDashboard(selectedId) {

    const selectedDashboard = dashboards[selectedId];

    Object.entries(dashboards).forEach(([id, dashboard]) => {
        const el = document.getElementById(id);
        const isSelected = id === selectedId;

        document.getElementById('container').innerHTML = '';


        document.getElementById('container').classList.remove(
            'investing',
            'accounting',
            'finance'
        );

        // eslint-disable-next-line max-len
        document.getElementById('container').classList.add(selectedDashboard.className);

        // toggle active class
        el.classList.toggle('active', isSelected);

        // update aria-label
        el.setAttribute(
            'aria-label',
            isSelected ?
                `${dashboard.name} dashboard selected` :
                `${dashboard.name} dashboard`
        );

        // optional but ideal accessibility state
        el.setAttribute('aria-selected', isSelected);
    });

    // update demo card accessibility
    demoCard.setAttribute('aria-label', selectedDashboard.demoCardLabel);

    // update description
    chartDescription.textContent = selectedDashboard.chartDescription;

    // announce change (screen reader live region)
    announce.textContent = '';
    announce.textContent =
        `Dashboard switched to ${selectedDashboard.name.toLowerCase()}`;

    // run dashboard logic
    selectedDashboard.run();

}

Object.keys(dashboards).forEach(id => {
    document.getElementById(id).addEventListener('click', () => {
        selectDashboard(id);
    });
});


selectDashboard('accounting');