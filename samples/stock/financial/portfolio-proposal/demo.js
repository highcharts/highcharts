Highcharts.SVGRenderer.prototype.symbols.triangleLeft = (x, y, w, h) => [
    ['M', x, y + h / 2],
    ['L', x + w, y],
    ['L', x + w, y + h],
    ['Z']
];

Highcharts.SVGRenderer.prototype.symbols.triangleRight = (x, y, w, h) => [
    ['M', x + w, y + h / 2],
    ['L', x, y],
    ['L', x, y + h],
    ['Z']
];

// Health is calculated as DividendGrowth 1y vs 3y
const healthMap = {
    up: '▲', // "📈",
    down: '▼', // "📉",
    unchanged: ''
};

// Define constants and utility functions
const predefinedHoldings = [
    // Cash assets
    {
        id: 'US0250818038',
        idType: 'ISIN',
        type: 'FO',
        weight: 15,
        name: 'American Century Capital Preservation Fund Investor Class',
        symbol: 'CPFXX',
        proposedWeight: 12,
        // Performance is based on Security Performance M0-M255, without current
        // price
        performance: [
            3.489756,
            1.578978,
            2.406443,
            4.033827,
            4.424365,
            2.000312,
            0.962403,
            0.341273,
            1.482696
        ],
        health: 0, // No dividend
        rating: 5
    },
    // Bonds
    {
        id: 'US61747C7074', // Morgan Stanley Instl Liquidity Govt Portfolio
        idType: 'ISIN',
        type: 'FO',
        weight: 10,
        name: 'Morgan Stanley Instl Liquidity Govt Portfolio',
        symbol: 'MSILX',
        proposedWeight: 8,
        performance: [
            6.441144,
            2.326492,
            11.612653,
            8.407705,
            7.397144,
            14.58974,
            4.214963,
            10.441094,
            14.269209
        ],
        health: 0, // No dividend
        rating: 4
    },
    {
        id: 'US46637K2814', // JPMorgan Hedged Equity Fund Class I
        idType: 'ISIN',
        type: 'FO',
        weight: 8,
        name: 'JPMorgan Hedged Equity Fund Class I',
        symbol: 'JHEQX',
        proposedWeight: 10,
        performance: [
            8.098393,
            7.884495,
            9.369053,
            11.304527,
            7.287685,
            -3.025323,
            -3.719703,
            7.843792,
            -2.295266
        ],
        health: 0, // No dividend
        rating: 4
    },
    // Stocks
    {
        id: 'US0378331005', // Apple Inc
        idType: 'ISIN',
        type: 'EQ',
        weight: 12,
        name: 'Apple Inc',
        symbol: 'AAPL',
        proposedWeight: 15,
        performance: [
            21.656702,
            21.669398,
            15.164604,
            8.778029,
            -9.457379,
            -15.748626,
            5.14527,
            -17.20206
        ],
        // Health is calculated as DividendGrowth 1y vs 3y
        health: 0.043 / 0.049 - 1,
        rating: 3
    },
    {
        id: 'US5949181045', // Microsoft Corp
        idType: 'ISIN',
        type: 'EQ',
        weight: 10,
        name: 'Microsoft Corp',
        symbol: 'MSFT',
        proposedWeight: 9,
        performance: [
            27.219246,
            20.833766,
            22.980631,
            8.541469,
            10.917074,
            10.304288,
            24.805381,
            9.116194
        ],
        health: 0.102 / 0.102 - 1,
        rating: 3
    },
    {
        id: 'US46625H1005', // JPMorgan Chase & Co
        idType: 'ISIN',
        type: 'EQ',
        weight: 9,
        name: 'JPMorgan Chase & Co',
        symbol: 'JPM',
        proposedWeight: 13,
        performance: [
            18.0628,
            27.309188,
            34.973873,
            39.046147,
            11.652499,
            0.243194,
            14.536989,
            12.150886
        ],
        health: 0.171 / 0.081 - 1,
        rating: 2
    },
    {
        id: 'US92826C8394', // Visa Inc Class A
        idType: 'ISIN',
        type: 'EQ',
        weight: 11,
        name: 'Visa Inc Class A',
        symbol: 'V',
        proposedWeight: 10,
        performance: [
            18.668443,
            14.265618,
            22.584624,
            30.785611,
            16.004301,
            2.973511,
            12.119206,
            13.750579
        ],
        health: 0.156 / 0.177 - 1,
        rating: 2
    },
    {
        id: 'US4781601046', // Johnson & Johnson
        idType: 'ISIN',
        type: 'EQ',
        weight: 14,
        name: 'Johnson & Johnson',
        symbol: 'JNJ',
        proposedWeight: 18,
        performance: [
            6.941891,
            3.666052,
            -1.751145,
            3.999764,
            1.973956,
            -3.77004,
            -2.419508,
            7.100926
        ],
        health: 0.045 / 0.054 - 1,
        rating: 4
    },
    {
        id: 'US0382221051', // Applied Materials Inc
        idType: 'ISIN',
        type: 'EQ',
        weight: 7,
        name: 'Applied Materials Inc',
        symbol: 'AMAT',
        proposedWeight: 6,
        performance: [
            25.094682,
            24.885594,
            16.932545,
            -24.017639,
            -2.349293,
            -5.840577,
            20.565983,
            2.137759
        ],
        health: 0.241 / 0.161 - 1,
        rating: 3
    },
    {
        id: 'US7265031051', // Plains All American Pipeline LP
        idType: 'ISIN',
        type: 'EQ',
        weight: 6,
        name: 'Plains All American Pipeline LP',
        symbol: 'PAA',
        proposedWeight: 8,
        performance: [
            -2.74609,
            20.454454,
            24.79414,
            2.347779,
            -2.606915,
            -16.852365,
            -1.738975,
            1.612692
        ],
        health: 0.188 / 0.208 - 1,
        rating: 1
    }
];

const assetAllocationTypes = {
    1: 'Stock',
    2: 'Bond',
    3: 'Cash',
    4: 'Other',
    99: 'Not classified'
};

function showLoading() {
    const loadingOverlay = document.getElementById('loading-overlay');
    if (loadingOverlay) {
        loadingOverlay.classList.add('active');
    }
}

function hideLoading() {
    const loadingOverlay = document.getElementById('loading-overlay');
    if (loadingOverlay) {
        loadingOverlay.classList.remove('active');
    }
}

// Function to render dynamic charts
async function renderCharts() {
    showLoading();
    try {
        const currentXRay = new HighchartsConnectors.Morningstar.XRayConnector({
            api: {
                url: 'https://demo-live-data.highcharts.com',
                access: {
                    url: 'https://demo-live-data.highcharts.com/token/oauth',
                    token: 'token'
                }
            },
            currencyId: 'EUR',
            dataPoints: {
                type: 'portfolio',
                dataPoints: [
                    [
                        'PerformanceReturn',
                        'M1',
                        'M2',
                        'M3',
                        'M6',
                        'M12',
                        'M36',
                        'M60'
                    ],
                    [
                        'StandardDeviation',
                        'M',
                        'M1',
                        'M2',
                        'M3',
                        'M6',
                        'M12',
                        'M36',
                        'M60'
                    ],
                    'AssetAllocationMorningstarEUR3'
                ]
            },
            startDate: '2020-01-01',
            holdings: predefinedHoldings.map(
                ({ id, idType, type, weight }) => ({ id, idType, type, weight })
            )
        });

        await currentXRay.load();

        const proposedXRay =
            new HighchartsConnectors.Morningstar.XRayConnector({
                api: {
                    url: 'https://demo-live-data.highcharts.com',
                    access: {
                        url: 'https://demo-live-data.highcharts.com/token/oauth',
                        token: 'token'
                    }
                },
                currencyId: 'EUR',
                dataPoints: {
                    type: 'portfolio',
                    dataPoints: [
                        [
                            'PerformanceReturn',
                            'M1',
                            'M2',
                            'M3',
                            'M6',
                            'M12',
                            'M36',
                            'M60'
                        ],
                        [
                            'StandardDeviation',
                            'M',
                            'M1',
                            'M2',
                            'M3',
                            'M6',
                            'M12',
                            'M36',
                            'M60'
                        ],
                        'AssetAllocationMorningstarEUR3'
                    ]
                },
                startDate: '2020-01-01',
                holdings: predefinedHoldings.map(
                    ({ id, idType, type, proposedWeight }) => ({
                        id,
                        idType,
                        type,
                        weight: proposedWeight
                    })
                )
            });

        await proposedXRay.load();

        renderRiskReturnChart(currentXRay, proposedXRay);
        renderHoldingsCharts(currentXRay, proposedXRay);
        renderPortfolioChart();
    } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error rendering charts:', error);
    } finally {
        hideLoading();
    }
}

function renderRiskReturnChart(currentXRay, proposedXRay) {
    const currentTable = currentXRay.dataTables;
    const proposedTable = proposedXRay.dataTables;

    const columns = {
        TimePeriod: currentTable.TrailingPerformance.getColumn(
            'TotalReturn_MonthEnd_TimePeriod'
        ),
        Return: currentTable.TrailingPerformance.getColumn(
            'TotalReturn_MonthEnd_Value'
        ),
        StandardDeviation: currentTable.RiskStatistics.getColumn(
            'StandardDeviation'
        )
    };

    const proposedColumns = {
        TimePeriod: proposedTable.TrailingPerformance.getColumn(
            'TotalReturn_MonthEnd_TimePeriod'
        ),
        Return: proposedTable.TrailingPerformance.getColumn(
            'TotalReturn_MonthEnd_Value'
        ),
        StandardDeviation: currentTable.RiskStatistics.getColumn(
            'StandardDeviation'
        )
    };

    const periodIndex = columns.TimePeriod.indexOf('M6');

    if (periodIndex === -1) {
        return;
    }

    Highcharts.chart('risk-return-chart', {
        chart: {
            type: 'scatter',
            plotBorderColor: '#E1E1E1',
            plotBorderWidth: 1
        },
        credits: {
            enabled: false
        },
        legend: {
            enabled: false
        },
        title: {
            text: 'Estimate Risk vs. Return',
            align: 'left'
        },
        tooltip: {
            pointFormat: '<b>Total Return (%):</b> {point.y}<br> ' +
                '<b>Standard Deviation:</b> {point.x}'
        },
        xAxis: {
            lineWidth: 0,
            tickColor: '#E1E1E1',
            title: {
                text: 'Standard Deviation'
            },
            plotLines: [{
                value: columns.StandardDeviation[periodIndex],
                dashStyle: 'Dash',
                color: '#2F2E38',
                id: 'plot-line-std-dev'
            }],
            labels: {
                format: '{value:.2f}'
            }
        },
        yAxis: {
            gridLineColor: '#0000000A',
            title: {
                text: 'Total Return %'
            },
            plotLines: [{
                value: columns.Return[periodIndex],
                dashStyle: 'Dash',
                color: '#2F2E38',
                id: 'plot-line-risk'
            }],
            labels: {
                format: '{value:.2f}'
            }
        },
        series: [{
            name: 'Current',
            data: [[
                columns.StandardDeviation[periodIndex],
                columns.Return[periodIndex]
            ]],
            color: '#014CE5',
            marker: {
                symbol: 'circle'
            }
        }, {
            name: 'Proposed',
            data: [
                [
                    proposedColumns.StandardDeviation[periodIndex],
                    proposedColumns.Return[periodIndex]
                ]
            ],
            color: '#EA293C',
            marker: {
                symbol: 'square'
            }
        }, {
            name: 'Conservative',
            data: [
                [15, 6]
            ],
            color: '#1E90FF',
            marker: {
                symbol: 'triangle'
            }
        }, {
            name: 'Mod Conservative',
            data: [
                [15.5, 6.5]
            ],
            color: '#32CD32',
            marker: {
                symbol: 'triangle'
            }
        }, {
            name: 'Moderate',
            data: [
                [16, 6.8]
            ],
            color: '#FFD700',
            marker: {
                symbol: 'triangle'
            }
        }, {
            name: 'Mod Aggressive',
            data: [
                [16.5, 7]
            ],
            color: '#FF8C00',
            marker: {
                symbol: 'triangle'
            }
        }, {
            name: 'Aggressive',
            data: [
                [17, 7]
            ],
            color: '#FF4500',
            marker: {
                symbol: 'triangle'
            }
        }]
    });

    // Render data grids related to risk-return chart
    Grid.grid('assets-grid', {
        rendering: {
            theme: 'theme-custom'
        },
        dataTable: {
            columns: {
                name: ['Current', 'Proposed'],
                value: [
                    columns.Return[periodIndex],
                    proposedColumns.Return[periodIndex]
                ]
            }
        },
        columns: [{
            id: 'name',
            header: {
                format: 'Asset Allocation'
            }
        }, {
            id: 'value',
            header: {
                format: 'Return'
            },
            cells: {
                format: '{value:.2f}'
            }
        }],
        credits: {
            enabled: false
        }
    });

    Grid.grid('models-grid', {
        rendering: {
            theme: 'theme-custom'
        },
        dataTable: {
            columns: {
                name: [
                    'Conservative',
                    'Mod Conservative',
                    'Moderate',
                    'Mod Aggressive',
                    'Aggressive'
                ],
                value: [6, 6.5, 6.8, 7, 7]
            }
        },
        columns: [{
            id: 'name',
            header: {
                format: 'Risk Profile'
            }
        }, {
            id: 'value',
            header: {
                format: 'Return'
            }
        }]
    });
}

function renderHoldingsCharts(currentXRay, proposedXRay) {
    const currentTable = currentXRay.getTable('AssetAllocation');
    const proposedTable = proposedXRay.getTable('AssetAllocation');

    const categories = currentTable.getColumn('MorningstarEUR3_Type');
    const values = currentTable.getColumn('MorningstarEUR3_L');

    const proposedCategories = proposedTable.getColumn('MorningstarEUR3_Type');
    const proposedValues = proposedTable.getColumn('MorningstarEUR3_L');

    const colorMapping = {
        1: '#5409DA',
        2: '#4E71FF',
        3: '#8DD8FF'
    };

    const data = [];
    for (let i = 0; i < categories.length; i++) {
        const category = categories[i];
        const value = values[i];

        if (value > 0) {
            data.push({
                name: assetAllocationTypes[category] || `Category ${category}`,
                y: value,
                color: colorMapping[category]
            });
        }
    }

    const proposedData = [];
    for (let i = 0; i < proposedCategories.length; i++) {
        const category = proposedCategories[i];
        const value = proposedValues[i];

        if (value > 0) {
            proposedData.push({
                name: assetAllocationTypes[category] || `Category ${category}`,
                y: value,
                color: colorMapping[category]
            });
        }
    }

    Highcharts.chart('current-holdings-chart', {
        chart: {
            type: 'pie',
            marginTop: 40
        },
        title: {
            text: 'Asset Allocation',
            align: 'left'
        },
        subtitle: {
            text: 'Current Holdings',
            align: 'center',
            verticalAlign: 'bottom',
            style: {
                fontSize: '16px',
                fontWeight: 'bold',
                color: '#000'
            }
        },
        legend: {
            labelFormat: '{name} {point.y:.2f}%'
        },
        // In case of changing type to Bar/Column
        xAxis: {
            categories: proposedData.map(d => d.name)
        },
        plotOptions: {
            pie: {
                innerSize: '60%',
                dataLabels: {
                    enabled: false
                },
                borderWidth: 0
            }
        },
        tooltip: {
            format: '{point.name}: <b>{point.y:.2f}%</b>'
        },
        series: [{
            name: 'Holdings',
            showInLegend: true,
            data
        }]
    });

    Highcharts.chart('proposed-holdings-chart', {
        chart: {
            type: 'pie',
            marginTop: 40
        },
        title: {
            text: 'Proposed Holdings',
            align: 'center',
            verticalAlign: 'bottom',
            style: {
                fontSize: '16px',
                fontWeight: 'bold'
            }
        },
        legend: {
            labelFormat: '{name} {point.y:.2f}%'
        },
        plotOptions: {
            pie: {
                innerSize: '60%',
                dataLabels: {
                    enabled: false
                },
                borderWidth: 0
            }
        },
        tooltip: {
            format: '{point.name}: <b>{point.y:.2f}%</b>'
        },
        series: [{
            name: 'Holdings',
            showInLegend: true,
            data: proposedData
        }]
    });
}

function renderPortfolioChart() {
    const increasingData = [];
    const decreasingData = [];

    predefinedHoldings.forEach((holding, index) => {
        const isIncrease = holding.weight < holding.proposedWeight;
        const transformedDataPoint = {
            name: holding.name,
            low: Math.min(holding.weight, holding.proposedWeight),
            high: Math.max(holding.weight, holding.proposedWeight),
            x: index
        };

        if (isIncrease) {
            increasingData.push(transformedDataPoint);
        } else {
            decreasingData.push(transformedDataPoint);
        }
    });

    Highcharts.chart('portfolio-chart', {
        chart: {
            type: 'dumbbell',
            inverted: true
        },
        title: {
            text: 'Portfolio Illustrations',
            align: 'left'
        },
        subtitle: {
            text: 'Current holdings vs Proposed holdings',
            align: 'left'
        },
        tooltip: {
            shared: true
        },
        xAxis: [{
            type: 'category',
            opposite: true
        }, {
            linkedTo: 0,
            type: 'category',
            tickPositions: [0, 1.5, 6],
            labels: {
                formatter: function () {
                    return this.axis.options.cats[this.pos] || '';
                }
            },
            cats: {
                0: 'Cash',
                1.5: 'Bond',
                6: 'Stock'
            }
        }, {
            linkedTo: 0,
            offset: 0,
            type: 'category',
            tickPositions: [0, 2, 9],
            tickWidth: 1,
            tickLength: 3,
            labels: {
                enabled: false
            }
        }],
        yAxis: {
            title: ''
        },
        legend: {
            enabled: false
        },
        plotOptions: {
            dumbbell: {
                connectorWidth: 3,
                marker: {
                    radius: 5,
                    states: {
                        hover: {
                            lineWidth: 0
                        }
                    }
                },
                dataLabels: {
                    enabled: true,
                    color: 'contrast',
                    crop: false,
                    overflow: 'allow'
                }
            }
        },
        series: [{
            name: 'Increase',
            data: increasingData,
            color: '#14C5C4',
            marker: {
                enabled: true,
                symbol: 'triangleRight'
            },
            lowMarker: {
                enabled: false
            }
        }, {
            name: 'Decrease',
            type: 'dumbbell',
            data: decreasingData,
            color: '#ff0000',
            marker: {
                enabled: false
            },
            lowColor: undefined,
            lowMarker: {
                enabled: true,
                symbol: 'triangleLeft'
            }
        }]
    });
}

// Function to handle data grid updates
function setupGrid() {
    Grid.grid('portfolio-grid', {
        caption: {
            text: 'Portfolio Illustrations'
        },
        rendering: {
            theme: 'theme-custom',
            rows: {
                virtualization: false
            }
        },
        dataTable: {
            columns: {
                name: predefinedHoldings.map(holding => holding.name),
                symbol: predefinedHoldings.map(holding => holding.symbol),
                weight: predefinedHoldings.map(holding => holding.weight),
                proposedWeight: predefinedHoldings.map(
                    holding => holding.proposedWeight
                ),
                health: predefinedHoldings.map(holding => holding.health),
                performance: predefinedHoldings.map(
                    holding => holding.performance
                ),
                rating: predefinedHoldings.map(holding => holding.rating)
            }
        },
        columns: [{
            id: 'name',
            header: {
                format: 'Description'
            }
        }, {
            id: 'symbol',
            enabled: false,
            header: {
                format: 'Symbol / CUSIP'
            }
        }, {
            id: 'health',
            header: {
                format: 'Dividend change<br>(1Y vs 3Y)'
            },
            cells: {
                formatter: function () {
                    const dataTable =
                        this.column.viewport.grid.dataProvider.dataTable;
                    const health = dataTable.getCell('health', this.row.index);
                    const healthState =
                        health === 0 ?
                            'unchanged' :
                            health < 0 ?
                                'down' :
                                'up';
                    const sign = health > 0 ? '+' : '';
                    const color =
                        health === 0 ?
                            'black' :
                            health < 0 ?
                                '#ff0000' :
                                '#008000';

                    return `<span style="color: ${color}">
                        ${healthMap[healthState] || ''}${sign}
                        ${(this.value * 100).toFixed(0)}%</span>`;
                }
            }
        }, {
            id: 'weight',
            header: {
                format: 'Current % of Portfolio'
            },
            cells: {
                format: '{value:.2f}%'
            }
        }, {
            id: 'proposedWeight',
            header: {
                format: 'Proposed % of Portfolio'
            },
            cells: {
                format: '{value:.2f}%',
                validationRules: ['notEmpty', 'number'],
                editMode: {
                    enabled: true
                }
            }
        }, {
            id: 'performance',
            header: {
                format: 'Performance'
            },
            cells: {
                renderer: {
                    type: 'sparkline',
                    chartOptions: {
                        colors: ['#5409DA'],
                        chart: {
                            type: 'spline'
                        },
                        exporting: {
                            enabled: false
                        },
                        tooltip: {
                            enabled: true,
                            outside: true,
                            format: '<b>{point.y}%</b>'
                        },
                        plotOptions: {
                            series: {
                                label: {
                                    enabled: false
                                },
                                states: {
                                    hover: {
                                        enabled: true
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }, {
            id: 'rating',
            header: {
                format: 'Rating'
            },
            enabled: false,
            cells: {
                editable: false
            }
        }],
        columnDefaults: {
            cells: {
                events: {
                    afterEdit: function () {
                        predefinedHoldings[this.row.index].proposedWeight =
                            this.value;
                        renderCharts();
                    }
                }
            }
        }
    });
}

// Render static charts
function renderStaticCharts() {
    Highcharts.chart('growth-chart', {
        chart: {
            type: 'line',
            zoomType: 'x'
        },
        title: {
            text: 'Growth Over Time',
            align: 'left'
        },
        subtitle: {
            text: 'December 2013 - December 2021',
            align: 'left'
        },
        xAxis: {
            categories: [
                'Dec 13',
                'Dec 14',
                'Dec 15',
                'Dec 16',
                'Dec 17',
                'Dec 18',
                'Dec 19',
                'Dec 20',
                'Dec 21'
            ],
            tickmarkPlacement: 'on',
            title: {
                enabled: false
            },
            tickWidth: 1,
            tickLength: 4
        },
        yAxis: {
            title: {
                text: null
            },
            labels: {
                formatter: function () {
                    return (
                        Highcharts.numberFormat(this.value, 0, '.', ',') + '$'
                    );
                }
            }
        },
        plotOptions: {
            line: {
                marker: {
                    enabled: false
                }
            }
        },
        tooltip: {
            valueSuffix: '$',
            split: true
        },
        series: [{
            name: 'Current',
            data: [
                8000000,
                12000000,
                18000000,
                16000000,
                17000000,
                20000000,
                20000000,
                21000000,
                22000000
            ],
            color: '#A1B0C6'
        }, {
            name: 'Proposed',
            data: [
                8000000,
                13000000,
                19000000,
                17000000,
                18000000,
                22000000,
                24000000,
                26000000,
                29000000
            ],
            color: '#5409DA'
        }]
    });

    Highcharts.chart('stress-chart', {
        chart: {
            type: 'column'
        },
        title: {
            text: 'Historical Stress Test',
            align: 'left'
        },
        xAxis: {
            categories: [
                'Dot-com Bubble Burst<br>(2000–2002)',
                'September 11<br>(2001)',
                '2nd Gulf War<br>(2003-2011)',
                'Global Financial Crisis<br>(2008)',
                'European Debt Crisis<br>(2011)',
                'COVID-19 Crash<br>(Feb–Mar 2020)',
                'Russia-Ukraine War<br>(2022 Onset)'
            ],
            tickWidth: 1,
            tickLength: 4
        },
        yAxis: {
            title: {
                text: '% Change'
            }
        },
        plotOptions: {
            column: {
                grouping: true,
                borderWidth: 0,
                borderRadius: 5
            }
        },
        tooltip: {
            split: true
        },
        series: [{
            name: 'Current',
            data: [-45, -30, -25, -25, -50, -40],
            color: '#A1B0C6'
        }, {
            name: 'Proposed',
            data: [-20, -15, -20, -10, -30, -20],
            color: '#5409DA'
        }]
    });

    createMap();
}

async function createMap() {
    const topology = await fetch(
        'https://code.highcharts.com/mapdata/custom/world.topo.json'
    ).then(response => response.json());

    const {
        mapSeries
    } = parseData([
        ['1', 1, 0, 1],
        ['2', 0, 0, 0],
        ['3', 0, 0, 0],
        ['4', 81, 42, 83],
        ['5', 10, 56, 9],
        ['6', 3, 0, 3],
        ['7', 0, 0, 0],
        ['8', 0, 0, 0],
        ['9', 0, 0, 0],
        ['10', 0, 0, 0],
        ['11', 1, 1, 1],
        ['12', 0, 0, 0],
        ['13', 0, 0, 1],
        ['14', 1, 0, 1],
        ['15', 98, 98],
        ['16', 0, 0, 0]
    ]);

    Highcharts.mapChart('map-chart', {
        chart: {
            map: topology,
            backgroundColor: 'transparent'
        },
        title: {
            text: 'Regional Exposure',
            align: 'left'
        },
        mapView: {
            projection: {
                name: 'Miller'
            }
        },
        credits: {
            enabled: false
        },
        mapNavigation: {
            enabled: true
        },
        colors: ['#5409DA', '#4E71FF', '#8DD8FF'],
        plotOptions: {
            map: {
                showInLegend: false,
                allAreas: false,
                joinBy: ['iso-a2', 'code'],
                nullColor: '#A1B0C6'
            }
        },
        tooltip: {
            pointFormat: '{point.name}: <b>{point.value:.2f}%</b>'
        },
        series: [{
            name: 'World Map',
            allAreas: true
        }, ...mapSeries]
    });
}

function parseData(regionalExposureData) {
    const regionCountryMap = {
        1: [
            ['US', 'd']
        ],
        2: [
            ['CA', 'd']
        ],
        3: [
            ['AI', 'e'],
            ['AG', 'd'],
            ['AR', 'e'],
            ['AW', 'd'],
            ['BS', 'd'],
            ['BB', 'd'],
            ['BZ', 'e'],
            ['BM', 'd'],
            ['BO', 'e'],
            ['BQ', 'e'],
            ['BR', 'e'],
            ['VG', 'e'],
            ['KY', 'd'],
            ['CL', 'e'],
            ['CO', 'e'],
            ['CR', 'e'],
            ['CU', 'e'],
            ['CW', 'e'],
            ['DM', 'e'],
            ['DO', 'e'],
            ['EC', 'e'],
            ['SV', 'e'],
            ['FK', 'e'],
            ['BL', 'e'],
            ['GF', 'e'],
            ['GD', 'e'],
            ['GP', 'e'],
            ['GT', 'e'],
            ['GY', 'e'],
            ['HT', 'e'],
            ['HN', 'e'],
            ['JM', 'e'],
            ['MQ', 'e'],
            ['MX', 'e'],
            ['MS', 'e'],
            ['NI', 'e'],
            ['PA', 'e'],
            ['PY', 'e'],
            ['PE', 'e'],
            ['PR', 'd'],
            ['KN', 'e'],
            ['LC', 'e'],
            ['VC', 'e'],
            ['SR', 'e'],
            ['TT', 'e'],
            ['TC', 'e'],
            ['UY', 'e'],
            ['VE', 'e']
        ],
        4: [
            ['GB', 'd'],
            ['GG', 'd'],
            ['IM', 'd'],
            ['JE', 'd']
        ],
        5: [
            ['AT', 'd'],
            ['BE', 'd'],
            ['CY', 'd'],
            ['EE', 'e'],
            ['FI', 'd'],
            ['FR', 'd'],
            ['DE', 'd'],
            ['GR', 'd'],
            ['IE', 'd'],
            ['IT', 'd'],
            ['LV', 'e'],
            ['LU', 'd'],
            ['MT', 'd'],
            ['NL', 'd'],
            ['PT', 'd'],
            ['SK', 'e'],
            ['SI', 'd'],
            ['ES', 'd']
        ],
        6: [
            ['AD', 'd'],
            ['DK', 'd'],
            ['FO', 'd'],
            ['GI', 'e'],
            ['GL', 'd'],
            ['IS', 'd'],
            ['LI', 'd'],
            ['MC', 'd'],
            ['NO', 'd'],
            ['SM', 'd'],
            ['SJ', 'e'],
            ['SE', 'd'],
            ['CH', 'd'],
            ['VA', 'e']
        ],
        7: [
            ['AL', 'e'],
            ['BY', 'e'],
            ['BA', 'e'],
            ['BG', 'e'],
            ['HR', 'e'],
            ['CZ', 'e'],
            ['HU', 'e'],
            ['LT', 'e'],
            ['MK', 'e'],
            ['MD', 'e'],
            ['PL', 'e'],
            ['RO', 'e'],
            ['RU', 'e'],
            ['RS', 'e'],
            ['ME', 'e'],
            ['TR', 'e'],
            ['UA', 'e']
        ],
        8: [
            ['DZ', 'e'],
            ['AO', 'e'],
            ['BJ', 'e'],
            ['BW', 'e'],
            ['BV', 'e'],
            ['BF', 'e'],
            ['BI', 'e'],
            ['CM', 'e'],
            ['CV', 'e'],
            ['CF', 'e'],
            ['TD', 'e'],
            ['KM', 'e'],
            ['CG', 'e'],
            ['CI', 'e'],
            ['CD', 'e'],
            ['DJ', 'e'],
            ['EG', 'e'],
            ['GQ', 'e'],
            ['ER', 'e'],
            ['ET', 'e'],
            ['GA', 'e'],
            ['GM', 'e'],
            ['GH', 'e'],
            ['GN', 'e'],
            ['GW', 'e'],
            ['KE', 'e'],
            ['LS', 'e'],
            ['LR', 'e'],
            ['LY', 'e'],
            ['MG', 'e'],
            ['MW', 'e'],
            ['ML', 'e'],
            ['MR', 'e'],
            ['MU', 'e'],
            ['YT', 'e'],
            ['MA', 'e'],
            ['MZ', 'e'],
            ['NA', 'e'],
            ['NE', 'e'],
            ['NG', 'e'],
            ['RE', 'e'],
            ['RW', 'e'],
            ['ST', 'e'],
            ['SN', 'e'],
            ['SC', 'e'],
            ['SL', 'e'],
            ['SO', 'e'],
            ['ZA', 'e'],
            ['SH', 'e'],
            ['SD', 'e'],
            ['SZ', 'e'],
            ['TZ', 'e'],
            ['TG', 'e'],
            ['TN', 'e'],
            ['UG', 'e'],
            ['EH', 'e'],
            ['ZM', 'e'],
            ['ZW', 'e']
        ],
        9: [
            ['BH', 'd'],
            ['IR', 'e'],
            ['IQ', 'e'],
            ['IL', 'd'],
            ['JO', 'e'],
            ['KW', 'd'],
            ['LB', 'e'],
            ['OM', 'e'],
            ['QA', 'd'],
            ['SA', 'e'],
            ['SY', 'e'],
            ['AE', 'd'],
            ['PS', 'e'],
            ['YE', 'e']
        ],
        10: [
            ['JP', 'd']
        ],
        11: [
            ['AU', 'd'],
            ['NZ', 'd']
        ],
        12: [
            ['BN', 'd'],
            ['PF', 'd'],
            ['GU', 'd'],
            ['HK', 'd'],
            ['MO', 'd'],
            ['NC', 'd'],
            ['SG', 'd'],
            ['KR', 'd'],
            ['TW', 'd']
        ],
        13: [
            ['AF', 'e'],
            ['AS', 'e'],
            ['AM', 'e'],
            ['AZ', 'e'],
            ['BD', 'e'],
            ['BT', 'e'],
            ['MM', 'e'],
            ['KH', 'e'],
            ['CN', 'e'],
            ['CX', 'e'],
            ['CC', 'e'],
            ['CK', 'e'],
            ['TL', 'e'],
            ['FJ', 'e'],
            ['GE', 'e'],
            ['HM', 'e'],
            ['IN', 'e'],
            ['ID', 'e'],
            ['KZ', 'e'],
            ['KI', 'e'],
            ['KG', 'e'],
            ['LA', 'e'],
            ['MY', 'e'],
            ['MV', 'e'],
            ['MH', 'e'],
            ['FM', 'e'],
            ['MN', 'e'],
            ['NR', 'e'],
            ['NP', 'e'],
            ['NU', 'e'],
            ['NF', 'e'],
            ['KP', 'e'],
            ['MP', 'e'],
            ['PK', 'e'],
            ['PW', 'e'],
            ['PG', 'e'],
            ['PH', 'e'],
            ['PN', 'e'],
            ['WS', 'e'],
            ['SB', 'e'],
            ['LK', 'e'],
            ['TJ', 'e'],
            ['TH', 'e'],
            ['TK', 'e'],
            ['TO', 'e'],
            ['TM', 'e'],
            ['TV', 'e'],
            ['UZ', 'e'],
            ['VU', 'e'],
            ['VN', 'e'],
            ['WF', 'e']
        ]
    };

    const regionMap = {
        1: 'United States',
        2: 'Canada',
        3: 'Latin America',
        4: 'United Kingdom',
        5: 'Eurozone',
        6: 'Europe - ex Euro',
        7: 'Europe - Emerging',
        8: 'Africa',
        9: 'Middle East',
        10: 'Japan',
        11: 'Australasia',
        12: 'Asia - Developed',
        13: 'Asia - Emerging',
        14: 'Emerging Market',
        15: 'Developed Country'
    };

    const regionIconMap = {
        1: 'usa',
        4: 'uk',
        5: 'euro',
        6: 'euro',
        8: 'africa',
        11: 'au',
        13: 'asia'
    };

    const regionalExposure = {};

    regionalExposureData.forEach(([regionCode, ...exposures]) => {
        regionalExposure[regionCode] = exposures[0];
    });

    const mapSeries = [],
        barSeries = [];

    for (const [regionCode, value] of Object.entries(regionalExposure)) {
        const regionName = regionMap[regionCode],
            iconPath = regionIconMap[regionCode],
            countries = regionCountryMap[regionCode] || [];

        if (countries.length > 0 && value > 0) {
            mapSeries.push({
                name: regionName,
                data: countries.map(([country]) => ({
                    code: country,
                    value
                }))
            });

            barSeries.push({
                name: regionName,
                y: value,
                iconPath
            });
            barSeries.sort((a, b) => b.y - a.y);
        }
    }

    return {
        mapSeries,
        barSeries
    };
}

// Initialize the dashboard
document.addEventListener('DOMContentLoaded', async () => {
    // Call the function and handle errors at the call site
    await renderCharts().catch(error => {
        // eslint-disable-next-line no-console
        console.error('Error rendering charts:', error);
    });

    setupGrid();
    renderStaticCharts();
});
