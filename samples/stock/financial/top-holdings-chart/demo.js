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

const globalStockSectorBreakdown = {
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

Grid.Templating.helpers.mapStockSector = value =>
    globalStockSectorBreakdown[value];

async function renderChart() {

    // Configure the connector
    const securityDetails =
        new HighchartsConnectors.Morningstar.SecurityDetailsConnector({
            api: {
                url: 'https://demo-live-data.highcharts.com',
                access: {
                    url: 'https://demo-live-data.highcharts.com/token/oauth',
                    token: 'token'
                }
            },
            converters: ['PortfolioHoldings'],
            security: {
                id: 'F0GBR052QA',
                idType: 'MSID'
            }
        });

    await securityDetails.load();

    const columnNames = [
        'SecurityName',
        'GlobalSectorId',
        'NumberOfShare',
        'MarketValue',
        'Weighting'
    ];

    const columns = [{
        id: 'SecurityName',
        header: {
            format: 'Security Name'
        },
        cells: {
            className: 'name-col',
            formatter: function () {
                const points = Highcharts.charts[0].series[0].points,
                    color = points.find(
                        point => point.name === this.value
                    ).color;
                return `<span style="color:${color};
                    font-size: 18px">\u25CF</span> ${this.value}`;
            }
        }
    }, {
        id: 'GlobalSectorId',
        header: {
            format: 'Stock Sector'
        },
        cells: {
            format: '{mapStockSector value}'
        }
    }, {
        id: 'NumberOfShare',
        header: {
            format: 'Number of Shares'
        },
        cells: {
            className: 'numeric-val-col',
            format: '{value:,.0f}'
        }
    }, {
        id: 'MarketValue',
        header: {
            format: 'Market Value'
        },
        cells: {
            className: 'numeric-val-col',
            format: '{value:,.0f} <span style="color: #75738C">GBP</span>'
        }
    }, {
        id: 'Weighting',
        header: {
            format: 'Weighting'
        },
        cells: {
            className: 'numeric-val-col',
            format: '{value:.2f} <span style="color: #75738C">%</span>'
        }
    }];

    // Retrieve the data, sort by number of shares and return top 5 holdings
    const data = securityDetails.getTable('PortfolioHoldings').getRows(
        0,
        10,
        columnNames
    )
        .sort((a, b) => b[2] - a[2])
        .slice(0, 5);

    // Create the dashboard
    Dashboards.board('container', {
        dataPool: {
            connectors: [{
                type: 'JSON',
                id: 'data',
                columnIds: columnNames,
                data,
                firstRowAsNames: false
            }]
        },
        gui: {
            layouts: [{
                id: 'layout-1',
                rows: [{
                    cells: [{
                        id: 'bubble-chart'
                    }]
                }, {
                    cells: [{
                        id: 'table'
                    }]
                }]
            }]
        },
        components: [{
            sync: {
                highlight: true
            },
            renderTo: 'table',
            connector: {
                id: 'data'
            },
            type: 'Grid',
            gridOptions: {
                credits: {
                    enabled: false
                },
                rendering: {
                    theme: 'theme-custom'
                },
                columns
            }
        }, {
            sync: {
                highlight: true
            },
            renderTo: 'bubble-chart',
            connector: {
                id: 'data',
                columnAssignment: [{
                    seriesId: 'Black Rock Income and Growth Ord',
                    data: {
                        x: 'NumberOfShare',
                        y: 'MarketValue',
                        z: 'Weighting',
                        name: 'SecurityName'
                    }
                }]
            },
            type: 'Highcharts',
            chartOptions: {
                chart: {
                    type: 'bubble',
                    plotBorderColor: '#E1E1E1',
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
                    text: 'Top 5 Portfolio Holdings',
                    align: 'left',
                    x: 80
                },
                subtitle: {
                    text: 'By Number of Shares',
                    align: 'left',
                    x: 80
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
                        text: 'Number of Shares',
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
                    gridLineColor: '#F5F5F5',
                    tickInterval: 20000
                },
                plotOptions: {
                    series: {
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
                    style: {
                        fontSize: 14,
                        fontWeight: 500
                    },
                    shape: 'rect',
                    borderRadius: 5,
                    borderWidth: 1,
                    borderColor: '#E3E3E8',
                    shadow: false,
                    headerFormat:
                        '<div style="display: inline-flex; align-items: ' +
                        'center;"><span style="color:{point.color}; ' +
                        'font-size: 18px; margin-right: 5px">\u25CF</span> ' +
                        '<b>{point.name}</b></div><br/><br/>',
                    pointFormat: `
                        <div style="display: flex;
                            justify-content: space-between; padding: 3px 0">
                            <span>Number of shares</span>
                            <span style="color:#8A8A8A;
                            margin-left: 20px">{point.x:,.0f}</span>
                        </div>
                        <div style="display: flex;
                            justify-content: space-between; padding: 3px 0">
                            <span>Market value</span>
                            <span style="color:#8A8A8A;
                            margin-left: 20px">{point.y} GBP</span>
                        </div>
                        <div style="display: flex;
                            justify-content: space-between; padding: 3px 0">
                            <span>Weighting</span>
                            <span style="color:#8A8A8A; 
                            margin-left: 20px">{point.z:.2f}%</span>
                        </div>
                    `
                }
            }
        }]
    });
}

renderChart();
