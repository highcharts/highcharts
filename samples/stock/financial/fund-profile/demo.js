// Add fillOpacity handler for hovered bubble points
(function (H) {
    H.wrap(
        H.Series.types.bubble.prototype,
        'pointAttribs',
        function (proceed, _point, state) {
            this.options.marker.fillOpacity = state === 'hover' ? 1 : 0.6;
            const ret = proceed.apply(
                this,
                Array.prototype.slice.call(arguments, 1)
            );

            return ret;
        }
    );
}(Highcharts));


const countryExposureMap = {
    AUT: 'Austria',
    BEL: 'Belgium',
    CHE: 'Switzerland',
    DEU: 'Germany',
    DNK: 'Denmark',
    ESP: 'Spain',
    FIN: 'Finland',
    FRA: 'France',
    GBR: 'United Kingdom',
    IRL: 'Ireland',
    ITA: 'Italy',
    LUX: 'Luxembourg',
    NLD: 'Netherlands',
    NOR: 'Norway',
    POL: 'Poland',
    PRT: 'Portugal',
    SWE: 'Sweden',
    USA: 'United States'
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

    const holdings = [{
        id: 'F0GBR052QA',
        idType: 'MSID',
        type: 'FO',
        weight: '100',
        name: 'BlackRock Income and Growth Ord',
        holdingType: 'weight'
    }];

    const xRayConnector = new HighchartsConnectors.Morningstar.XRayConnector({
        api: {
            url: 'https://demo-live-data.highcharts.com',
            access: {
                url: 'https://demo-live-data.highcharts.com/token/oauth',
                token: 'token'
            }
        },
        currencyId: 'GBP',
        frequency: 'annual',
        dataPoints: {
            type: 'portfolio',
            dataPoints: ['StyleBox', 'RegionalExposure']
        },
        holdings
    });

    const securityDetailsConnector =
        new HighchartsConnectors.Morningstar.SecurityDetailsConnector({
            api: {
                url: 'https://demo-live-data.highcharts.com',
                access: {
                    url: 'https://demo-live-data.highcharts.com/token/oauth',
                    token: 'token'
                }
            },
            converters: ['CountryExposure'],
            security: {
                id: holdings[0].id,
                idType: holdings[0].idType
            }
        });

    await xRayConnector.load();
    await securityDetailsConnector.load();

    // Apply title dynamically
    document.querySelector('h2').textContent = holdings[0].name;

    // Parse data into Highcharts format
    const regionBreakdownData =
        xRayConnector.getTable('RegionalExposure').getRows().map(
            ([key, value], index) => ({
                name: globalRegionClassification[key],
                x: index,
                y: value
            })
        );

    // Parse data into Highcharts format
    const countryExposureData =
        securityDetailsConnector.getTable('CountryExposure')
            .getRows(
                0,
                securityDetailsConnector.getTable('CountryExposure')
                    .getRowCount(),
                ['Type', 'Equity_N']
            ).map(([key, value], index) => ({
                name: countryExposureMap[key],
                x: index,
                y: value
            }));

    const chartSharedOptions = categories => ({
        chart: {
            type: 'column'
        },
        title: {
            margin: 30
        },
        legend: {
            align: 'right',
            verticalAlign: 'top'
        },
        xAxis: [{
            grid: {
                enabled: true,
                borderColor: '#E1E1E1'
            },
            categories: categories,
            labels: {
                format: '{value.name}'
            }
        }, {
            grid: {
                enabled: true,
                borderColor: '#E1E1E1'
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
                borderColor: '#0001C'
            }
        },
        tooltip: {
            followPointer: true,
            headerFormat:
                '<span style="font-size: 10px">{series.name}</span><br/>',
            pointFormat:
                '<span style="color:{point.color}">\u25CF</span> ' +
                '{point.name}<b> {point.y:.2f}%</b><br/>'
        }
    });

    Dashboards.board('container', {
        dataPool: {
            connectors: [{
                id: 'regional-exposure',
                type: 'JSON',
                options: {
                    firstRowAsNames: false,
                    data: regionBreakdownData
                }
            }, {
                id: 'xray',
                type: 'MorningstarXRay',
                api: {
                    url: 'https://demo-live-data.highcharts.com',
                    access: {
                        url: 'https://demo-live-data.highcharts.com/token/oauth',
                        token: 'token'
                    }
                },
                currencyId: 'GBP',
                dataPoints: {
                    type: 'portfolio',
                    dataPoints: [
                        'UnderlyingHolding',
                        'AssetAllocationMorningstarEUR3',
                        'GlobalStockSector',
                        'RegionalExposure',
                        [
                            'HistoricalPerformanceSeries',
                            'TotalReturn',
                            'M12'
                        ],
                        [
                            'PerformanceReturn',
                            'M1',
                            'M3',
                            'M6',
                            'M12',
                            'M36',
                            'M60'
                        ]
                    ]
                },
                holdings
            }, {
                id: 'growth-series',
                type: 'MorningstarTimeSeries',
                api: {
                    url: 'https://demo-live-data.highcharts.com',
                    access: {
                        url: 'https://demo-live-data.highcharts.com/token/oauth',
                        token: 'token'
                    }
                },
                currencyId: 'GBP',
                series: {
                    type: 'Growth'
                },
                securities: [{
                    id: holdings[0].id,
                    idType: holdings[0].idType
                }],
                startDate: '2016-01-01'
            }]
        },
        gui: {
            layouts: [{
                id: 'layout',
                rows: [{
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
                    }, {
                        id: 'bubble-chart'
                    }]
                }, {
                    cells: [{
                        id: 'region-breakdown'
                    }]
                }, {
                    cells: [{
                        id: 'country-exposure'
                    }]
                }, {
                    cells: [{
                        id: 'growth'
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
                id: 'xray',
                dataTableKey: 'GlobalStockSector',
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
                    text:
                        'Distribution of investments across various ' +
                        'industry sectors, showing their relative weight ' +
                        'in the portfolio or index'
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
                            <span style="color: #fff; font-size: 1.3em;">
                                {#unless point.isNull}{point.y:.2f}%{/unless}
                            </span>
                        </b>
                    `,
                    style: {
                        color: '#fff'
                    }
                },
                plotOptions: {
                    pie: {
                        size: '100%',
                        borderWidth: 1,
                        colors: [
                            '#818f96',
                            '#94A1A8',
                            '#ABB3BA',
                            '#BCC3C8',
                            '#C9CFD3',
                            '#D6DBDE',
                            '#E5E7E9',
                            '#EBEDEE',
                            '#F2F3F4',
                            '#F8F9F9',
                            '#fff'
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
                id: 'xray',
                dataTableKey: 'GlobalStockSector'
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
            connector: {
                id: 'xray',
                dataTableKey: 'HistoricalPerformanceSeries',
                columnAssignment: [{
                    seriesId: 'Calendar Year Returns',
                    data: [
                        'TotalReturn_M12_Annual_Date',
                        'TotalReturn_M12_Annual_Value'
                    ]
                }]
            },
            chartOptions: {
                chart: {
                    type: 'column'
                },
                title: {
                    text: 'Calendar Year Returns (%)'
                },
                xAxis: {
                    type: 'datetime',
                    title: {
                        text: 'Year'
                    },
                    min: '2015-10-01',
                    max: '2025-03-31',
                    tickInterval: Highcharts.timeUnits.year
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
                    xDateFormat: '%Y',
                    pointFormat:
                        '<span style="color:{series.color}">{series.name}' +
                        '</span>: <b>{point.y:.2f}%</b><br/>'
                },
                plotOptions: {
                    column: {
                        pointWidth: 20,
                        color: '#014CE5'
                    }
                },
                legend: {
                    enabled: false
                }
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
                            color: '#6e7481'
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
                            color: '#6e7481'
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
                        color: '#acc2f3',
                        name: '10-24'
                    }, {
                        from: 0,
                        to: 9,
                        color: '#fafafa',
                        name: '0-9'
                    }]
                },
                tooltip: {
                    pointFormat:
                        '<b> {series.yAxis.categories.(point.y)} ' +
                        '{series.xAxis.categories.(point.x)}</b>: ' +
                        '{point.value}%'
                },
                series: [{
                    name: 'Portfolio Weight',
                    id: 'StockStyle',
                    keys: ['name', 'value', 'x', 'y'],
                    data: xRayConnector.getTable('StyleBox').getRows(0, 9),
                    borderWidth: 1,
                    borderColor: '#e5e7e9',
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
            connector: {
                id: 'xray',
                dataTableKey: 'TrailingPerformance',
                columnAssignment: [{
                    seriesId: 'Trailing Returns',
                    data: [
                        'TotalReturn_MonthEnd_TimePeriod',
                        'TotalReturn_MonthEnd_Value'
                    ]
                }]
            },
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
                    pointFormat:
                        '<span style="color:{series.color}">{series.name}' +
                        '</span>: <b>{point.y:.2f}%</b><br/>'
                },
                legend: {
                    enabled: false
                },
                plotOptions: {
                    series: {
                        color: '#014CE5'
                    }
                }
            }
        }, {
            type: 'Highcharts',
            renderTo: 'asset-allocation',
            connector: {
                id: 'xray',
                dataTableKey: 'AssetAllocation',
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
                    pointFormat:
                        '<span style="color:{point.color}">\u25CF</span> ' +
                        '<b>{translateAssetAllocation point.key}:</b> {point.y}'
                },
                plotOptions: {
                    series: {
                        colors: [
                            '#8132F8',
                            '#000',
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
            sync: {
                highlight: {
                    enabled: true,
                    group: 'Second'
                }
            },
            connector: {
                id: 'xray',
                dataTableKey: 'UnderlyHoldings'
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
                    columnId: 'weight',
                    format: 'Weight (%)'
                }, {
                    columnId: 'marketValue',
                    format: 'Market Value'
                }, {
                    columnId: 'globalSectorId',
                    format: 'Stock Sector'
                }],
                columns: [{
                    id: 'name',
                    cells: {
                        className: 'name-col',
                        formatter: function () {
                            const component = Dashboards.boards[0]
                                    .getComponentByCellId('bubble-chart'),
                                points =
                                    component.chart.series[0].points,
                                color = points.find(
                                    point => point.name === this.value
                                ).color;
                            return `<span style="color:${color};
                                font-size: 18px">\u25CF</span> ${this.value}`;
                        }
                    }
                }, {
                    id: 'globalSectorId',
                    cells: {
                        format: '{translateGlobalSector value}'
                    }
                }, {
                    id: 'weight',
                    cells: {
                        className: 'numeric-val-col',
                        format:
                            '{value:.2f} <span style="color: #75738C">%</span>'
                    }
                }, {
                    id: 'marketValue',
                    cells: {
                        className: 'numeric-val-col',
                        format:
                            '{value:,.0f} <span style="color: ' +
                            '#75738C">GBP</span>'
                    }
                }]
            }
        }, {
            type: 'Highcharts',
            renderTo: 'bubble-chart',
            sync: {
                highlight: {
                    enabled: true,
                    group: 'Second'
                }
            },
            connector: {
                id: 'xray',
                dataTableKey: 'UnderlyHoldings',
                columnAssignment: [{
                    seriesId: 'Black Rock Income and Growth Ord',
                    data: {
                        y: 'marketValue',
                        z: 'weight',
                        name: 'name'
                    }
                }]
            },
            chartOptions: {
                chart: {
                    type: 'bubble',
                    plotBorderColor: '#E1E1E1',
                    height: 500,
                    plotBorderWidth: 1,
                    events: {
                        load() {
                            if (!this.hasLoaded) {
                                this.plotBorder.attr({
                                    rx: 10,
                                    ry: 10
                                });
                            }
                        }
                    }
                },
                colors: [
                    '#8132F8',
                    '#000',
                    '#10B981',
                    '#EA293C',
                    '#014CE5'
                ],
                credits: {
                    enabled: false
                },
                title: {
                    text: 'Underlying Holdings',
                    x: 60
                },
                subtitle: {
                    text: 'By Portfolio Weight',
                    x: 60
                },
                legend: {
                    enabled: false
                },
                yAxis: {
                    startOnTick: false,
                    endOnTick: false,
                    title: {
                        text: 'Market Value (GBP)',
                        style: {
                            color: '#141414'
                        }
                    },
                    labels: {
                        style: {
                            color: '#141414'
                        }
                    }
                },
                xAxis: {
                    title: {
                        text: 'Index Position',
                        style: {
                            color: '#141414'
                        }
                    },
                    labels: {
                        style: {
                            color: '#141414'
                        }
                    },
                    lineWidth: 0,
                    tickColor: '#E1E1E1',
                    gridLineColor: '#F5F5F5'
                },
                plotOptions: {
                    series: {
                        maxSize: '12%',
                        minSize: '5%',
                        colorByPoint: true,
                        states: {
                            hover: {
                                halo: {
                                    size: 8
                                }
                            }
                        }
                    }
                },
                tooltip: {
                    useHTML: true,
                    shape: 'rect',
                    borderRadius: 5,
                    borderWidth: 1,
                    borderColor: '#E3E3E8',
                    shadow: false,
                    headerFormat:
                        '<span style="color:{point.color}; font-size: 18px;">' +
                        '\u25CF</span> <b>{point.name}</b><br/><br/>',
                    pointFormat: `
                        <div style="display: flex;
                            justify-content: space-between;">
                            <span>Market value</span>
                            <span style="color:#8A8A8A;
                                margin-left: 20px">{point.y} GBP</span>
                        </div>
                        <div style="display: flex;
                            justify-content: space-between;">
                            <span>Weighting</span>
                            <span style="color:#8A8A8A;
                                margin-left: 20px">{point.z:.2f}%</span>
                        </div>
                    `
                }
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
                    name: 'Black Rock Income and Growth Ord',
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
                yAxis: {
                    title: {
                        text: 'Country weight'
                    }
                },
                series: [{
                    name: 'Black Rock Income and Growth Ord',
                    data: countryExposureData
                }]
            }
        }, {
            type: 'Highcharts',
            renderTo: 'growth',
            connector: {
                id: 'growth-series',
                columnAssignment: [{
                    seriesId: 'Black Rock Income and Growth Ord time',
                    data: {
                        x: 'Date',
                        y: 'F0GBR052QA'
                    }
                }]
            },
            chartConstructor: 'stockChart',
            chartOptions: {
                chart: {
                    plotBorderColor: '#E1E1E1',
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
                                    .attr({
                                        stroke: '#E1E1E1',
                                        'stroke-width': 1,
                                        r: 5
                                    })
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
                        '$ {point.y:,.2f}</span></b> <span style="color:' +
                        '{series.color}; font-weight:bold;">&#8213;</span><br/>'
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
            }
        }]
    });
}

renderDashboard();
