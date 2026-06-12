async function renderChart() {

    // Configure the connector
    const connector =
        new HighchartsConnectors.Morningstar.HypoPerformanceConnector({
            api: {
                url: 'https://demo-live-data.highcharts.com',
                access: {
                    url: 'https://demo-live-data.highcharts.com/token/oauth',
                    token: 'token'
                }
            },
            viewId: 'Growth',
            requestSettings: {
                outputCurrency: 'USD',
                outputReturnsFrequency: 'Monthly',
                assetClassGroupConfigs: {
                    assetClassGroupConfig: [{
                        id: 'ACG-USBROAD'
                    }]
                },
                hypoCalculationSettings: {
                    hypoType: 'Portfolio',
                    filingStatus: 'NoTaxes',
                    taxableIncome: 50000,
                    payTaxes: 'OutOfPocket',
                    federalIncomeTaxRate: 0,
                    capitalGainTaxRate: 0,
                    stateIncomeTaxRate: 0,
                    dividendTaxRate: 0,
                    illustrationTrailingTimePeriod: 'Customized',
                    startDate: '2020-01-01',
                    endDate: '2025-01-31',
                    synchronizePortfolioStartDate: true,
                    investmentDetailReturnsFrequency: 'Monthly',
                    liquidateOnEndDate: true,
                    subsequentInvestmentType: 'Invest',
                    subsequentInvestmentAmount: 0,
                    subsequentInvestmentWithdrawalFrequency: 'Monthly',
                    assetBasedAnnualFee: 0,
                    assetFeeFrequency: 'Annually',
                    assetFeeType: 'Amount',
                    payFees: 'OutOfPocketBeginning',
                    payFeesUseCashFirst: true,
                    frontLoadType: 'Standard',
                    customFeeType: 'Amount',
                    salesFeeAmount: 0,
                    applySalesCharge: true,
                    applyFeeForRebalance: false,
                    entryExitFeeType: 'CustomEntry',
                    rebalanceFrequency: 'None',
                    rebalanceThreshold: 0,
                    reinvestDividends: true,
                    reinvestCapitalGains: true,
                    portfolioAmountFee: 1000
                }
            },
            portfolios: [{
                name: 'TestPortfolio1',
                totalValue: 10000,
                currency: 'USD',
                holdings: [{
                    securityId: 'F00000VCTT',
                    weight: 20
                }, {
                    securityId: '0P00002NW8',
                    weight: 10
                }, {
                    tradingSymbol: 'AAPL',
                    weight: 15
                }, {
                    isin: 'US09251T1034',
                    weight: 35
                }, {
                    cusip: '256219106',
                    weight: 20
                }],
                benchmark: {
                    type: 'Standard',
                    holdings: [{
                        securityId: 'XIUSA04G92',
                        type: 'XI',
                        weight: 100
                    }]
                }
            }]
        });

    // Load data
    await connector.load();

    // Create chart
    Highcharts.stockChart('container', {
        chart: {
            plotBorderColor: '#E1E1E1',
            plotBorderWidth: 1,
            events: {
                render: function () {
                    const { rangeSelector, renderer } = this;
                    const { zoomText, buttonGroup, inputGroup, group } =
                        rangeSelector;
                    const zoomBBox = zoomText.getBBox();
                    const buttonsBBox = buttonGroup.getBBox();
                    const inputBBox = inputGroup.getBBox();

                    // Create or update buttons border
                    if (!rangeSelector.buttonsBorder) {
                        rangeSelector.buttonsBorder = renderer
                            .rect(0, 0, 0, 0)
                            .attr({
                                stroke: '#E1E1E1',
                                'stroke-width': 1,
                                r: 5
                            })
                            .add();
                    }

                    rangeSelector.buttonsBorder.attr({
                        x: zoomBBox.x + zoomBBox.width + 3,
                        y: group.translateY - 3 + zoomBBox.height / 2,
                        width: buttonsBBox.width - zoomBBox.width,
                        height: buttonsBBox.height + 4
                    });

                    // Create or update input border
                    if (!rangeSelector.inputBorder) {
                        rangeSelector.inputBorder = renderer
                            .rect(0, 0, 0, 0)
                            .attr({
                                stroke: '#E1E1E1',
                                'stroke-width': 1,
                                r: 5
                            })
                            .add();
                    }

                    rangeSelector.inputBorder.attr({
                        x: inputGroup.translateX - 5,
                        y: inputGroup.translateY + group.translateY - 3,
                        width: inputBBox.width + 10,
                        height: inputBBox.height + 4
                    });
                }
            }
        },
        credits: {
            enabled: false
        },
        title: {
            text: 'Performance Trends Over Time',
            align: 'left',
            x: 50,
            style: {
                fontSize: '22px'
            }
        },
        rangeSelector: {
            inputPosition: {
                align: 'left',
                x: 5,
                y: 4
            },
            buttonPosition: {
                align: 'left'
            },
            buttonTheme: {
                fill: 'none',
                r: 5,
                style: {
                    color: '#272727',
                    fontWeight: 'bold'
                },
                states: {
                    hover: {
                        fill: '#EA293C',
                        style: {
                            color: '#fff'
                        }
                    },
                    select: {
                        fill: '#EA293C',
                        style: {
                            color: '#fff'
                        }
                    }
                }
            },
            buttons: [{
                type: 'month',
                count: 3,
                text: '3m',
                title: 'View 3 months'
            }, {
                type: 'month',
                count: 6,
                text: '6m',
                title: 'View 6 months'
            }, {
                type: 'ytd',
                text: 'YTD',
                title: 'View year to date'
            }, {
                type: 'year',
                count: 1,
                text: '1y',
                title: 'View 1 year'
            }, {
                type: 'all',
                text: 'All',
                title: 'View all'
            }],
            inputStyle: {
                color: '#272727',
                fontWeight: 'bold'
            },
            labelStyle: {
                color: '#272727'
            }
        },
        xAxis: {
            lineWidth: 0,
            tickColor: '#E1E1E1',
            crosshair: {
                dashStyle: 'dash',
                color: '#000'
            }
        },
        yAxis: {
            gridLineColor: '#E1E1E1',
            opposite: false,
            labels: {
                format: '${value:,.0f}'
            },
            plotLines: [{
                value: 10000,
                width: 1,
                color: '#A7A7A7'
            }]
        },
        navigator: {
            maskFill: '#274FE026',
            outlineColor: '#C0C0C0',
            height: 73,
            xAxis: {
                gridLineColor: '#E1E1E1'
            },
            series: {
                type: 'area',
                fillColor: {
                    linearGradient: {
                        x1: 0,
                        y1: 0,
                        x2: 0,
                        y2: 1
                    },
                    stops: [
                        [0, 'rgba(0, 117, 219, 0.12)'],
                        [0.7, 'rgba(0, 113, 219, 0)']
                    ]
                }
            },
            handles: {
                backgroundColor: '#F7F7F7',
                borderColor: '#C0C0C0',
                borderRadius: 2,
                width: 9,
                height: 17
            }
        },
        scrollbar: {
            height: 0,
            trackBorderWidth: 0
        },
        tooltip: {
            shared: true,
            split: false,
            shadow: false,
            borderRadius: 5,
            borderColor: '#E3E3E8',
            borderWidth: 1,
            style: {
                textAlign: 'right'
            },
            headerFormat: '<strong>{point.key}</strong><br/>',
            pointFormat:
                '<b>{series.name} <span style="color:#8A8A8A">' +
                '$ {point.y:,.2f}</span></b> ' +
                '<span style="color:{series.color}; font-weight:bold;">' +
                '&#8213;</span><br/>'
        },
        plotOptions: {
            series: {
                states: {
                    hover: {
                        enabled: false
                    }
                },
                dataGrouping: {
                    enabled: true,
                    forced: true,
                    units: [
                        ['month', [1]]
                    ]
                }
            }
        },
        series: [{
            name: 'Portfolio',
            data: connector.getTable('Growth').getRows(void 0, void 0, [
                'Date',
                'Value'
            ]).slice(0, -1), // Remove trailing 0
            color: '#014CE5'
        }, {
            name: 'Benchmark',
            data: connector.getTable('Growth').getRows(void 0, void 0, [
                'Date',
                'Value_Benchmark'
            ]).slice(0, -1), // Remove trailing 0
            color: '#EA293C'
        }, {
            name: 'Net Invested',
            data: connector.getTable('Growth').getRows(void 0, void 0, [
                'Date',
                'Value_NetAmountInvested'
            ]).slice(0, -1), // Remove trailing 0
            color: '#2F2E38'
        }],
        legend: {
            enabled: true,
            rtl: true,
            floating: true,
            align: 'right',
            verticalAlign: 'top',
            layout: 'vertical',
            y: -80
        },
        responsive: {
            rules: [{
                condition: {
                    maxWidth: 650
                },
                chartOptions: {
                    legend: {
                        enabled: false
                    }
                }
            }]
        }
    });
}

renderChart();
