const countryExposureMap = {
    AUS: 'Australia',
    AUT: 'Austria',
    BEL: 'Belgium',
    BRA: 'Brazil',
    CAN: 'Canada',
    CHE: 'Switzerland',
    CHN: 'China',
    DEU: 'Germany',
    DNK: 'Denmark',
    ESP: 'Spain',
    FIN: 'Finland',
    FRA: 'France',
    GBR: 'United Kingdom',
    HKG: 'Hong Kong',
    IND: 'India',
    IRL: 'Ireland',
    ISR: 'Israel',
    ITA: 'Italy',
    JPN: 'Japan',
    KOR: 'South Korea',
    LUX: 'Luxembourg',
    MEX: 'Mexico',
    NLD: 'Netherlands',
    NOR: 'Norway',
    NZL: 'New Zealand',
    POL: 'Poland',
    PRT: 'Portugal',
    SGP: 'Singapore',
    SWE: 'Sweden',
    TWN: 'Taiwan',
    USA: 'United States',
    ZAF: 'South Africa'
};

const assetAllocationTypes = {
    1: 'Stock',
    2: 'Bond',
    3: 'Cash',
    4: 'Other',
    99: 'Not classified'
};

const globalRegionClassification = {
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
    15: 'Developed Country',
    99: 'Not Classified'
};

const globalStockSectorBreakdown = {
    99: 'Not Classified',
    101: 'Basic Materials',
    308: 'Communication Services',
    102: 'Consumer Cyclical',
    205: 'Consumer Defensive',
    206: 'Healthcare',
    310: 'Industrials',
    104: 'Real Estate',
    311: 'Technology',
    309: 'Energy',
    103: 'Financial Services',
    207: 'Utilities'
};

// Helper functions
Grid.Templating.helpers.translateGlobalSector = value =>
    globalStockSectorBreakdown[value];
Highcharts.Templating.helpers.translateGlobalSector = value =>
    globalStockSectorBreakdown[value];
Highcharts.Templating.helpers.translateAssetAllocation = value =>
    assetAllocationTypes[value];

// Apply global options to charts
Highcharts.setOptions({
    lang: {
        locale: 'en-gb'
    },
    credits: {
        enabled: false
    },
    title: {
        align: 'left'
    },
    subtitle: {
        align: 'left'
    }
});

async function renderDashboard() {
    const api = {
        url: 'https://demo-live-data.highcharts.com',
        access: {
            url: 'https://demo-live-data.highcharts.com/token/oauth',
            token: 'token'
        }
    };

    const security = {
        id: 'GB00B581Z480',
        idType: 'ISIN'
    };

    const securityDetailsConnector =
        new HighchartsConnectors.Morningstar.SecurityDetailsConnector({
            api,
            converters: [
                'AssetAllocations',
                'CountryExposure',
                'GlobalStockSectorBreakdown',
                'HistoricalPerformanceSeries',
                'RegionalExposure',
                'StyleBoxBreakdown',
                'TrailingPerformance'
            ],
            security
        });

    await securityDetailsConnector.load();

    // Parse data into Highcharts format. Types 14 and 15 are the developed
    // and emerging aggregates, which would double count the regions above.
    const regionAggregates = ['14', '15'];
    const regionBreakdownData =
        securityDetailsConnector.getTable('RegionalExposure').getRows(
            0,
            securityDetailsConnector
                .getTable('RegionalExposure').getRowCount(),
            ['Type', 'N']
        )
            .filter(
                ([key, value]) =>
                    !regionAggregates.includes(key) && value > 0
            )
            .sort(([, a], [, b]) => b - a)
            .map(([key, value], index) => ({
                name: globalRegionClassification[key],
                x: index,
                y: value
            }));

    // Parse data into Highcharts format. The snapshot covers more countries
    // than the chart names, so only the mapped ones are plotted.
    const countryExposureData =
        securityDetailsConnector.getTable('CountryExposure')
            .getRows(
                0,
                securityDetailsConnector
                    .getTable('CountryExposure').getRowCount(),
                ['Type', 'Equity_N']
            )
            .filter(([key, value]) => countryExposureMap[key] && value > 0)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 15)
            .map(([key, value], index) => ({
                name: countryExposureMap[key],
                x: index,
                y: value
            }));

    // The yearly series is shorter than the quarterly one sharing the table,
    // so the trailing blank rows are dropped. Each return is dated to the
    // last day of the year it covers, so the year is taken from that date and
    // used as a category, rather than plotting the boundary date itself.
    const calendarYearReturnData =
        securityDetailsConnector.getTable('HistoricalPerformanceSeries')
            .getRows(
                0,
                securityDetailsConnector
                    .getTable('HistoricalPerformanceSeries').getRowCount(),
                ['Nav_M12_Y_Date', 'Nav_M12_Y_Value']
            )
            .filter(([date, value]) => date && value !== void 0)
            .map(([date, value]) => [new Date(date).getUTCFullYear(), value])
            .sort(([a], [b]) => a - b);

    // Holdings are read from the raw snapshot: the rows do not all carry the
    // same fields, which leaves the parsed table short of the full top-ten.
    const holdingsData =
        (securityDetailsConnector.metadata.json
            .Portfolios[0].PortfolioHoldings || [])
            .map(holding => ({
                name: holding.SecurityName || holding.ExternalName,
                isin: holding.ISIN,
                weight: holding.Weighting,
                marketValue: holding.MarketValue
            }))
            .sort((a, b) => b.weight - a.weight);

    // The snapshot also carries a closing price and periods the chart has no
    // category for, so the returns are picked by time period instead.
    const trailingPeriods = ['M1', 'M3', 'M6', 'M12', 'M36', 'M60'];
    const trailingReturns = new Map(
        securityDetailsConnector.getTable('TrailingPerformance').getRows(
            0,
            securityDetailsConnector
                .getTable('TrailingPerformance').getRowCount(),
            ['Nav_DayEnd_TimePeriod', 'Nav_DayEnd_Value']
        )
    );
    const trailingReturnData = trailingPeriods.map(
        period => trailingReturns.get(period) ?? null
    );

    // The sector and allocation components read plain category/value pairs,
    // taken from the snapshot that is already loaded above.
    const sectorBreakdownData =
        securityDetailsConnector.getTable('GlobalStockSectorBreakdown')
            .getRows(
                0,
                securityDetailsConnector
                    .getTable('GlobalStockSectorBreakdown').getRowCount(),
                ['Type', 'N']
            );

    const assetAllocationData =
        securityDetailsConnector.getTable('AssetAllocations').getRows(
            0,
            securityDetailsConnector
                .getTable('AssetAllocations').getRowCount(),
            ['MorningstarEUR3_Type', 'MorningstarEUR3_N']
        );

    const chartSharedOptions = categories => ({
        chart: {
            type: 'column'
        },
        title: {
            margin: 30
        },
        legend: {
            enabled: false
        },
        xAxis: [{
            grid: {
                enabled: true,
                borderColor: 'var(--highcharts-neutral-color-20)'
            },
            categories: categories,
            labels: {
                format: '{value.name}'
            }
        }, {
            grid: {
                enabled: true,
                borderColor: 'var(--highcharts-neutral-color-20)'
            },
            categories: categories,
            labels: {
                format: '{value.y:.2f}%',
                align: 'right',
                x: -5
            },
            linkedTo: 0
        }],
        yAxis: {
            labels: {
                format: '{value:.2f}%'
            }
        },
        plotOptions: {
            series: {
                minPointLength: 3,
                borderWidth: 1,
                color: '#274FE0',
                borderColor: 'var(--highcharts-neutral-color-20)'
            }
        },
        tooltip: {
            followPointer: true,
            headerFormat: '<span style="font-size: 10px">{series.name}' +
                '</span><br/>',
            pointFormat: '<span style="color:{point.color}">\u25CF</span> ' +
                '{point.name}<b> {point.y:.2f}%</b><br/>'
        }
    });

    Dashboards.board('container', {
        dataPool: {
            connectors: [{
                id: 'portfolio-holdings',
                type: 'JSON',
                data: [
                    ['name', 'isin', 'weight', 'marketValue'],
                    ...holdingsData.map(
                        ({ name, isin, weight, marketValue }) =>
                            [name, isin, weight, marketValue]
                    )
                ]
            }, {
                id: 'sector-table',
                type: 'JSON',
                data: [
                    ['Type', 'N'],
                    ...sectorBreakdownData
                ]
            }, {
                id: 'allocation-table',
                type: 'JSON',
                data: [
                    ['MorningstarEUR3_Type', 'MorningstarEUR3_N'],
                    ...assetAllocationData
                ]
            }, {
                id: 'growth-series',
                type: 'MorningstarTimeSeries',
                api,
                currencyId: 'GBP',
                series: {
                    type: 'Growth'
                },
                securities: [{
                    id: 'F0GBR052QA',
                    idType: 'MSID'
                }],
                startDate: '2016-01-01'
            }]
        },
        gui: {
            layouts: [{
                id: 'layout',
                rows: [{
                    cells: [{
                        id: 'growth'
                    }]
                }, {
                    cells: [{
                        id: 'pie-chart'
                    }, {
                        id: 'year-return'
                    }, {
                        id: 'barometer'
                    }, {
                        id: 'sector-breakdown-table'
                    }, {
                        id: 'trailing-return'
                    }, {
                        id: 'asset-allocation'
                    }]
                }, {
                    cells: [{
                        id: 'underlying-holdings-table'
                    }]
                }, {
                    cells: [{
                        id: 'region-breakdown'
                    }]
                }, {
                    cells: [{
                        id: 'country-exposure'
                    }]
                }]
            }]
        },
        components: [{
            type: 'Highcharts',
            renderTo: 'pie-chart',
            sync: {
                highlight: {
                    enabled: true,
                    group: 'First'
                }
            },
            connector: {
                id: 'sector-table',
                columnAssignment: [{
                    seriesId: 'Sector breakdown',
                    data: ['Type', 'N']
                }]
            },
            chartOptions: {
                chart: {
                    type: 'pie',
                    marginBottom: 0
                },
                title: {
                    text: 'Sector Breakdown'
                },
                subtitle: {
                    text: `Distribution of investments across various industry
                    sectors, showing their relative weight in the portfolio or
                    index`
                },
                tooltip: {
                    backgroundColor: '#001A33',
                    shadow: false,
                    borderRadius: 8,
                    padding: 10,
                    useHTML: true,
                    animation: 0,
                    format: `
                        <span style="color: #9CA6B0; font-size: 1.1em;">
                            {translateGlobalSector point.name}
                        </span>
                        <br/>
                        <div style="height: 4px;"></div>
                        <b>
                            <span style="color: #FFFFFF; font-size: 1.3em;">
                                {#unless point.isNull}{point.y:.2f}%{/unless}
                            </span>
                        </b>
                    `,
                    style: {
                        color: '#FFFFFF'
                    }
                },
                plotOptions: {
                    pie: {
                        size: '100%',
                        borderWidth: 1,
                        borderColor: 'var(--highcharts-neutral-color-20)',
                        colors: [
                            'light-dark(#818f96, #8a97a0)',
                            'light-dark(#94a1a8, #78858e)',
                            'light-dark(#abb3ba, #68747c)',
                            'light-dark(#bcc3c8, #5a656d)',
                            'light-dark(#c9cfd3, #4d575e)',
                            'light-dark(#d6dbde, #414a50)',
                            'light-dark(#e5e7e9, #363e43)',
                            'light-dark(#ebedee, #2d3438)',
                            'light-dark(#f2f3f4, #262c30)',
                            'light-dark(#f8f9f9, #212629)',
                            'light-dark(#ffffff, #1c2022)'
                        ],
                        states: {
                            hover: {
                                color: '#014CE5',
                                borderColor: '#014CE5'
                            }
                        },
                        dataLabels: {
                            enabled: false
                        }
                    }
                },
                credits: {
                    enabled: false
                }
            }
        }, {
            type: 'Grid',
            renderTo: 'sector-breakdown-table',
            title: {
                text: ''
            },
            sync: {
                highlight: {
                    enabled: true,
                    group: 'First'
                }
            },
            connector: {
                id: 'sector-table'
            },
            gridOptions: {
                rendering: {
                    header: {
                        enabled: false
                    },
                    theme: 'theme-piechart'
                },
                credits: {
                    enabled: false
                },
                editable: false,
                // Display only the columns in the header array.
                header: [{
                    columnId: 'Type'
                }, {
                    columnId: 'N'
                }],
                columns: [{
                    id: 'Type',
                    cells: {
                        className: 'name-col',
                        format: '{translateGlobalSector value}'
                    }
                }, {
                    id: 'N',
                    cells: {
                        className: 'net-value-col',
                        format: '{#if value}{value:.2f}%{/if}'
                    }
                }]
            }
        }, {
            type: 'Highcharts',
            renderTo: 'year-return',
            chartOptions: {
                chart: {
                    type: 'column'
                },
                title: {
                    text: 'Calendar Year Returns (%)'
                },
                xAxis: {
                    title: {
                        text: 'Year'
                    },
                    categories: calendarYearReturnData.map(
                        ([year]) => `${year}`
                    )
                },
                yAxis: {
                    title: {
                        text: 'Returns'
                    },
                    labels: {
                        format: '{value}%'
                    }
                },
                tooltip: {
                    shared: true,
                    pointFormat: '<span style="color:{series.color}">' +
                    '{series.name}</span>: <b>{point.y:.2f}%</b><br/>'
                },
                plotOptions: {
                    column: {
                        pointWidth: 20,
                        color: '#014CE5'
                    }
                },
                legend: {
                    enabled: false
                },
                series: [{
                    name: 'Calendar Year Returns',
                    data: calendarYearReturnData.map(([, value]) => value)
                }]
            }
        }, {
            type: 'Highcharts',
            renderTo: 'barometer',
            chartOptions: {
                chart: {
                    type: 'heatmap'
                },
                title: {
                    text: 'Stock Style'
                },
                xAxis: {
                    categories: ['Value', 'Blend', 'Growth'],
                    lineWidth: 0,
                    gridLineWidth: 0,
                    opposite: true,
                    labels: {
                        style: {
                            fontSize: '1rem',
                            color: 'var(--highcharts-neutral-color-60)'
                        }
                    }
                },
                yAxis: {
                    categories: ['Small', 'Medium', 'Large'],
                    gridLineWidth: 0,
                    title: {
                        text: ''
                    },
                    labels: {
                        rotation: -90,
                        style: {
                            fontSize: '1rem',
                            color: 'var(--highcharts-neutral-color-60)'
                        }
                    }
                },
                legend: {
                    layout: 'vertical',
                    verticalAlign: 'top',
                    align: 'right',
                    y: 75,
                    symbolRadius: 0,
                    itemMarginTop: 9,
                    itemMarginBottom: 9
                },
                colorAxis: {
                    dataClasses: [{
                        from: 59,
                        color: '#014ce5',
                        name: '50+'
                    }, {
                        from: 24,
                        to: 49,
                        color: '#487cea',
                        name: '25-49'
                    }, {
                        from: 9,
                        to: 24,
                        color: 'light-dark(#acc2f3, #1d3a72)',
                        name: '10-24'
                    }, {
                        from: 0,
                        to: 9,
                        color: 'light-dark(#eef2fb, #16233d)',
                        name: '0-9'
                    }]
                },
                tooltip: {
                    pointFormat: '<b> {series.yAxis.categories.(point.y)} ' +
                        '{series.xAxis.categories.(point.x)}</b>: ' +
                        '{point.value}%'
                },
                series: [{
                    name: 'Portfolio Weight',
                    id: 'StockStyle',
                    keys: ['name', 'value', 'x', 'y'],
                    data: securityDetailsConnector
                        .getTable('StyleBoxBreakdown')
                        .getRows(0, 9, ['Type', 'N', 'Style', 'Size']),
                    borderWidth: 1,
                    borderColor: 'var(--highcharts-neutral-color-20)',
                    dataLabels: {
                        enabled: true,
                        format: '{value:.0f}%',
                        style: {
                            fontSize: '1rem',
                            textOutline: 'none'
                        }
                    }
                }]
            }
        }, {
            type: 'Highcharts',
            renderTo: 'trailing-return',
            chartOptions: {
                chart: {
                    type: 'column'
                },
                title: {
                    text: 'Trailing Returns (%)'
                },
                yAxis: {
                    title: {
                        text: 'Returns'
                    },
                    labels: {
                        format: '{value}%'
                    }
                },
                xAxis: {
                    categories: [
                        '1M',
                        '3M',
                        '6M',
                        '1Y (ann)',
                        '3Y (ann)',
                        '5Y (ann)'
                    ],
                    title: {
                        text: 'Time Period'
                    },
                    max: 5
                },
                tooltip: {
                    shared: true,
                    pointFormat: '<span style="color:{series.color}">' +
                    '{series.name}</span>: <b>{point.y:.2f}%</b><br/>'
                },
                legend: {
                    enabled: false
                },
                plotOptions: {
                    series: {
                        color: '#014CE5'
                    }
                },
                series: [{
                    name: 'Trailing Returns',
                    data: trailingReturnData
                }]
            }
        }, {
            type: 'Highcharts',
            renderTo: 'asset-allocation',
            connector: {
                id: 'allocation-table',
                columnAssignment: [{
                    seriesId: 'Asset Allocation',
                    data: {
                        name: 'MorningstarEUR3_Type',
                        y: 'MorningstarEUR3_N'
                    }
                }]
            },
            chartOptions: {
                chart: {
                    type: 'bar'
                },
                title: {
                    text: 'Asset Allocation (Net)'
                },
                yAxis: {
                    labels: {
                        format: '{value}%'
                    },
                    title: {
                        text: 'Asset Allocation'
                    }
                },
                xAxis: {
                    type: 'category',
                    min: 0,
                    max: 4,
                    labels: {
                        format: '{translateAssetAllocation value}'
                    }
                },
                legend: {
                    enabled: false
                },
                tooltip: {
                    valueDecimals: 2,
                    valueSuffix: '%',
                    headerFormat: 'Asset Allocation<br>',
                    pointFormat: '<span style="color:{point.color}">\u25CF' +
                    '</span> <b>{translateAssetAllocation point.key}:</b> ' +
                    '{point.y}'
                },
                plotOptions: {
                    series: {
                        colors: [
                            '#8132F8',
                            '#5A6B7D',
                            '#10B981',
                            '#EA293C',
                            '#014CE5'
                        ],
                        minPointLength: 2,
                        colorByPoint: true,
                        legendType: 'point'
                    }
                }
            }
        }, {
            type: 'Grid',
            renderTo: 'underlying-holdings-table',
            connector: {
                id: 'portfolio-holdings'
            },
            title: {
                text: 'Underlying Holdings'
            },
            gridOptions: {
                credits: {
                    enabled: false
                },
                rendering: {
                    theme: 'theme-holdings'
                },
                header: [{
                    columnId: 'name',
                    format: 'Name'
                }, {
                    columnId: 'isin',
                    format: 'ISIN'
                }, {
                    columnId: 'weight',
                    format: 'Weight (%)'
                }, {
                    columnId: 'marketValue',
                    format: 'Market Value'
                }],
                columns: [{
                    id: 'weight',
                    cells: {
                        className: 'numeric-val-col',
                        format: '{value:.2f} <span style="color: ' +
                            'var(--highcharts-neutral-color-60)">%</span>'
                    }
                }, {
                    id: 'marketValue',
                    cells: {
                        className: 'numeric-val-col',
                        format: '{value:,.0f} <span style="color: ' +
                            'var(--highcharts-neutral-color-60)">GBP</span>'
                    }
                }]
            }
        }, {
            type: 'Highcharts',
            renderTo: 'region-breakdown',
            chartOptions: {
                ...chartSharedOptions(regionBreakdownData),
                yAxis: {
                    min: 0,
                    title: {
                        text: 'Region weight'
                    },
                    labels: {
                        format: '{value:.2f}%'
                    }
                },
                title: {
                    text: 'Region Breakdown Chart'
                },
                series: [{
                    name: 'Aviva Investors Multi-asset Plus Fund III',
                    data: regionBreakdownData
                }]
            }
        }, {
            type: 'Highcharts',
            renderTo: 'country-exposure',
            chartOptions: {
                ...chartSharedOptions(countryExposureData),
                title: {
                    text: 'Country Exposure Chart'
                },
                subtitle: {
                    text: 'Top 15 countries by equity weight'
                },
                yAxis: {
                    title: {
                        text: 'Country weight'
                    }
                },
                series: [{
                    name: 'Aviva Investors Multi-asset Plus Fund III',
                    data: countryExposureData
                }]
            }
        }, {
            type: 'Highcharts',
            renderTo: 'growth',
            connector: {
                id: 'growth-series',
                columnAssignment: [{
                    seriesId: 'Aviva Investors Multi-asset Plus Fund III time',
                    data: {
                        x: 'Date',
                        y: 'F0GBR052QA'
                    }
                }]
            },
            chartConstructor: 'stockChart',
            chartOptions: {
                chart: {
                    plotBorderColor: 'var(--highcharts-neutral-color-20)',
                    plotBorderWidth: 1,
                    events: {
                        render: function () {
                            const { rangeSelector, renderer } = this;
                            const {
                                zoomText,
                                buttonGroup,
                                inputGroup,
                                group
                            } = rangeSelector;
                            const borderAttribs = {
                                stroke: 'var(--highcharts-neutral-color-20)',
                                'stroke-width': 1,
                                r: 5
                            };
                            const zoomBBox = zoomText.getBBox();
                            const buttonsBBox = buttonGroup.getBBox();
                            const inputBBox = inputGroup.getBBox();

                            // Create or update buttons border
                            if (!rangeSelector.buttonsBorder) {
                                rangeSelector.buttonsBorder = renderer
                                    .rect(0, 0, 0, 0)
                                    .attr(borderAttribs)
                                    .add();
                            }

                            rangeSelector.buttonsBorder.attr({
                                x: zoomBBox.x + zoomBBox.width + 3,
                                y: group.translateY -
                                    3 +
                                    zoomBBox.height / 2,
                                width: buttonsBBox.width - zoomBBox.width,
                                height: buttonsBBox.height + 4
                            });

                            // Create or update input border
                            if (!rangeSelector.inputBorder) {
                                rangeSelector.inputBorder = renderer
                                    .rect(0, 0, 0, 0)
                                    .attr(borderAttribs)
                                    .add();
                            }

                            rangeSelector.inputBorder.attr({
                                x: inputGroup.translateX - 5,
                                y: inputGroup.translateY +
                                    group.translateY -
                                    3,
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
                    x: 50,
                    style: {
                        fontSize: '22px'
                    }
                },
                rangeSelector: {
                    // Sits in the space the legend used to take.
                    inputPosition: {
                        align: 'right',
                        x: -5,
                        y: 4
                    },
                    buttonPosition: {
                        align: 'left'
                    },
                    buttonTheme: {
                        fill: 'none',
                        r: 5,
                        style: {
                            color: 'var(--highcharts-neutral-color-80)',
                            fontWeight: 'bold'
                        },
                        states: {
                            hover: {
                                fill: '#EA293C',
                                style: {
                                    color: '#FFFFFF'
                                }
                            },
                            select: {
                                fill: '#EA293C',
                                style: {
                                    color: '#FFFFFF'
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
                        color: 'var(--highcharts-neutral-color-80)',
                        fontWeight: 'bold'
                    },
                    labelStyle: {
                        color: 'var(--highcharts-neutral-color-80)'
                    }
                },
                xAxis: {
                    lineWidth: 0,
                    tickColor: 'var(--highcharts-neutral-color-20)',
                    crosshair: {
                        dashStyle: 'dash',
                        color: 'var(--highcharts-neutral-color-100)'
                    }
                },
                yAxis: {
                    gridLineColor: 'var(--highcharts-neutral-color-20)',
                    opposite: false,
                    labels: {
                        format: '${value:,.0f}'
                    },
                    plotLines: [{
                        value: 10000,
                        width: 1,
                        color: 'var(--highcharts-neutral-color-60)'
                    }]
                },
                navigator: {
                    maskFill: '#274FE026',
                    outlineColor: 'var(--highcharts-neutral-color-20)',
                    height: 73,
                    xAxis: {
                        gridLineColor: 'var(--highcharts-neutral-color-20)'
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
                        backgroundColor: 'var(--highcharts-neutral-color-5)',
                        borderColor: 'var(--highcharts-neutral-color-20)',
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
                    borderColor: 'var(--highcharts-neutral-color-20)',
                    borderWidth: 1,
                    style: {
                        textAlign: 'right'
                    },
                    headerFormat: '<strong>{point.key}</strong><br/>',
                    pointFormat: `<b>{series.name} <span style="color:
                            var(--highcharts-neutral-color-60)">
                        $ {point.y:,.2f}</span></b> <span style="
                            color:{series.color}; font-weight:bold;">&#8213;
                        </span><br/>`
                },
                plotOptions: {
                    series: {
                        color: '#014CE5',
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
                legend: {
                    enabled: false
                },
                responsive: {
                    rules: [{
                        condition: {
                            maxWidth: 400
                        },
                        chartOptions: {
                            title: {
                                x: 0,
                                style: {
                                    fontSize: '16px'
                                }
                            },
                            yAxis: {
                                labels: {
                                    format: '${value:,.0f}',
                                    align: 'left',
                                    x: 0,
                                    y: -4
                                }
                            }
                        }
                    }]
                }
            }
        }]
    });
}

renderDashboard();
