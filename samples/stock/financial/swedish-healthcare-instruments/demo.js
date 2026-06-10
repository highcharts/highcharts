/**
 * Map Morningstar short codes to human-readable field names.
 */
const FIELD_MAPS = {
    S12: 'Company',
    S4596: '30-Day Avg. Volume',
    S4591: '90-Day Avg. Volume',
    S4590: '180-Day Avg. Volume',
    S4595: '10-Day Ann. Volatility',
    S4593: '30-Day Ann. Volatility',
    S4594: '60-Day Ann. Volatility',
    S4602: '90-Day Ann. Volatility',
    S4592: 'Ann. Volatility'
};

(async () => {
    // Fetch the raw data
    const json = await fetch(
            'https://cdn.jsdelivr.net/gh/highcharts/highcharts@9aef7bec3a/samples/data/morningstar/swedish-healthcare-instruments.json'
        ).then(r => r.json()),
        labelStyle = {
            color: 'var(--mstar-text-muted)',
            fontSize: '11px',
            fontWeight: '300'
        },
        bodyTextStyle = {
            color: 'var(--mstar-text-strong)',
            fontSize: '12px',
            fontWeight: '300'
        };

    // Set shared chart options
    Highcharts.setOptions({
        chart: {
            backgroundColor: 'var(--mstar-surface)',
            style: {
                fontFamily: '"MorningstarIntrinsic", "Helvetica Neue", ' +
                    'Helvetica, Arial, sans-serif'
            },
            type: 'column'
        },
        title: {
            align: 'left',
            style: {
                color: 'var(--mstar-text-strong)',
                fontSize: '22px',
                fontWeight: '500'
            }
        },
        subtitle: {
            align: 'left',
            style: {
                color: 'var(--mstar-text-muted)',
                fontSize: '12px',
                fontWeight: '300'
            }
        },
        colors: [
            'var(--mstar-s1)',
            'var(--mstar-s2)',
            'var(--mstar-s3)',
            'var(--mstar-s4)'
        ],
        credits: {
            enabled: false
        },
        caption: {
            style: labelStyle
        },
        legend: {
            itemStyle: {
                color: 'var(--mstar-text-strong)',
                fontSize: '11px',
                fontWeight: '300'
            }
        },
        plotOptions: {
            column: {
                groupPadding: 0.1
            }
        },
        tooltip: {
            backgroundColor: 'var(--mstar-surface)',
            borderColor: 'var(--mstar-line)',
            borderRadius: 4,
            borderWidth: 1,
            shadow: false,
            style: bodyTextStyle
        },
        xAxis: {
            type: 'category',
            lineColor: 'var(--mstar-line)',
            tickColor: 'var(--mstar-line)',
            labels: {
                style: labelStyle
            }
        },
        yAxis: {
            gridLineColor: 'var(--mstar-line)',
            title: {
                style: labelStyle
            },
            labels: {
                style: labelStyle
            }
        },
        accessibility: {
            keyboardNavigation: {
                focusBorder: {
                    style: {
                        color: 'var(--mstar-accent)'
                    }
                }
            }
        }
    });

    // Create the dashboard
    Dashboards.board('container', {
        dataPool: {
            connectors: [{
                id: 'instruments',
                type: 'JSON',
                firstRowAsNames: false,
                beforeParse: function (data) {
                    // Normalize the raw dataset
                    return data.map(function (row) {
                        const record = {};
                        for (const [code, name] of Object.entries(FIELD_MAPS)) {
                            const num = Number(row[code]);
                            // If value is not numeric, keep original content
                            record[name] = isNaN(num) ? row[code] : num;
                        }
                        return record;
                    });
                },
                data: json.quotes.results
            }]
        },
        components: [{
            renderTo: 'dashboard-col-volume',
            type: 'Highcharts',
            connector: {
                id: 'instruments',
                columnAssignment: [{
                    seriesId: 'vol30d',
                    data: ['Company', '30-Day Avg. Volume']
                }, {
                    seriesId: 'vol90d',
                    data: ['Company', '90-Day Avg. Volume']
                }, {
                    seriesId: 'vol180d',
                    data: ['Company', '180-Day Avg. Volume']
                }]
            },
            chartOptions: {
                title: {
                    text: 'Average Daily Trading Volume'
                },
                subtitle: {
                    text: 'Shares per day · log scale · SEK · ' +
                        'Source: Morningstar'
                },
                caption: {
                    text: 'Cantargia and Acarix dominate trading activity; ' +
                        'Biosergen averages between 1,800 and 2,600 shares ' +
                        'per day — the least liquid name in the basket.'
                },
                yAxis: {
                    type: 'logarithmic',
                    accessibility: {
                        description: 'Average daily trading volume ' +
                            'in shares, logarithmic scale'
                    },
                    title: {
                        text: 'Shares (log scale)'
                    }
                },
                tooltip: {
                    valueDecimals: 0
                },
                series: [{
                    id: 'vol30d',
                    name: '30-day avg'
                }, {
                    id: 'vol90d',
                    name: '90-day avg'
                }, {
                    id: 'vol180d',
                    name: '180-day avg'
                }]
            }
        }, {
            renderTo: 'dashboard-col-volatility',
            type: 'Highcharts',
            connector: {
                id: 'instruments',
                columnAssignment: [{
                    seriesId: 'vola10d',
                    data: ['Company', '10-Day Ann. Volatility']
                }, {
                    seriesId: 'vola30d',
                    data: ['Company', '30-Day Ann. Volatility']
                }, {
                    seriesId: 'vola60d',
                    data: ['Company', '60-Day Ann. Volatility']
                }, {
                    seriesId: 'vola90d',
                    data: ['Company', '90-Day Ann. Volatility']
                }]
            },
            chartOptions: {
                title: {
                    text: 'Annualized Price Volatility'
                },
                subtitle: {
                    text: 'Rolling window annualized volatility · % · ' +
                        'Source: Morningstar'
                },
                caption: {
                    text: '2cureX shows extreme price swings — 90-day ' +
                        'annualized volatility exceeds 131% - while Acarix ' +
                        'is the most stable name in the basket.'
                },
                yAxis: {
                    accessibility: {
                        description: 'Annualized price volatility ' +
                            'as a percentage'
                    },
                    title: {
                        text: 'Volatility (%)'
                    },
                    labels: {
                        format: '{value}%'
                    }
                },
                tooltip: {
                    valueSuffix: '%',
                    valueDecimals: 1
                },
                series: [{
                    id: 'vola10d',
                    name: '10-day'
                }, {
                    id: 'vola30d',
                    name: '30-day'
                }, {
                    id: 'vola60d',
                    name: '60-day'
                }, {
                    id: 'vola90d',
                    name: '90-day'
                }]
            }
        }, {
            renderTo: 'dashboard-col-grid',
            type: 'Grid',
            connector: {
                id: 'instruments'
            },
            title: 'Instruments Overview',
            gridOptions: {
                columnDefaults: {
                    minWidth: 75,
                    cells: {
                        format: '{value:.1f}%'
                    }
                },
                header: [
                    'Company',
                    {
                        format: 'Average Trading Volume',
                        columns: [{
                            columnId: '30-Day Avg. Volume',
                            format: '30-Day'
                        }, {
                            columnId: '90-Day Avg. Volume',
                            format: '90-Day'
                        }, {
                            columnId: '180-Day Avg. Volume',
                            format: '180-Day'
                        }]
                    }, {
                        format: 'Annualized Price Volatility',
                        columns: [{
                            columnId: '10-Day Ann. Volatility',
                            format: '10-Day'
                        }, {
                            columnId: '30-Day Ann. Volatility',
                            format: '30-Day'
                        }, {
                            columnId: '60-Day Ann. Volatility',
                            format: '60-Day'
                        }, {
                            columnId: '90-Day Ann. Volatility',
                            format: '90-Day'
                        }, {
                            columnId: 'Ann. Volatility',
                            format: 'Annualized'
                        }]
                    }
                ],
                columns: [{
                    id: 'Company',
                    minWidth: 130,
                    cells: {
                        format: '{value}'
                    }
                }, {
                    id: '30-Day Avg. Volume',
                    minWidth: 90,
                    cells: {
                        format: '{value:,.0f}'
                    }
                }, {
                    id: '90-Day Avg. Volume',
                    minWidth: 90,
                    cells: {
                        format: '{value:,.0f}'
                    }
                }, {
                    id: '180-Day Avg. Volume',
                    minWidth: 90,
                    cells: {
                        format: '{value:,.0f}'
                    }
                }]
            }
        }]
    });
})();
