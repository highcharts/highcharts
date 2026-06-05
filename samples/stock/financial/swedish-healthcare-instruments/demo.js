/**
 * Map Morningstar short codes to camelCase field names.
 */
const FIELD_MAPS = {
    S4590: 'vol180d',
    S4591: 'vol90d',
    S4592: 'volAnn',
    S4593: 'vola30d',
    S4594: 'vola60d',
    S4595: 'vola10d',
    S4596: 'vol30d',
    S4602: 'vola90d',
    S9: 'currency',
    S12: 'company'
};

/**
 * Loads and normalizes the dataset from the provided JSON file.
 *
 * @return {Promise<Array<object>>} Resolves to an array of normalized rows,
 * one per instrument.
 */
async function loadDataset() {
    const json = await fetch(
        'https://cdn.jsdelivr.net/gh/highcharts/highcharts@9aef7bec3a/samples/data/morningstar/swedish-healthcare-instruments.json'
    ).then(r => r.json());

    return json.quotes.results.map(record => {
        const row = {};
        for (const [code, key] of Object.entries(FIELD_MAPS)) {
            const num = Number(record[code]);
            // If value is not a number, keep original content.
            row[key] = isNaN(num) ? record[code] : num;
        }
        return row;
    });
}


/**
 * Builds the instruments summary table for the Grid component.
 *
 * @param {Array<object>} rows Normalized instrument rows.
 * @return {Object} An object with columnIds and corresponding data arrays.
 */
function getInstrumentsTable(rows) {
    const company = [],
        vol30d = [],
        vol90d = [],
        vol180d = [],
        vola10d = [],
        vola30d = [],
        vola60d = [],
        vola90d = [],
        volAnn = [];

    for (let i = 0; i < rows.length; i++) {
        const row = rows[i];

        company.push(row.company);
        vol30d.push(row.vol30d);
        vol90d.push(row.vol90d);
        vol180d.push(row.vol180d);
        vola10d.push(row.vola10d);
        vola30d.push(row.vola30d);
        vola60d.push(row.vola60d);
        vola90d.push(row.vola90d);
        volAnn.push(row.volAnn);
    }

    return {
        columnIds: [
            'Company',
            '30-Day Avg. Volume',
            '90-Day Avg. Volume',
            '180-Day Avg. Volume',
            '10-Day Ann. Volatility',
            '30-Day Ann. Volatility',
            '60-Day Ann. Volatility',
            '90-Day Ann. Volatility',
            'Ann. Volatility'
        ],
        data: [
            company,
            vol30d, vol90d, vol180d,
            vola10d, vola30d, vola60d, vola90d,
            volAnn
        ]
    };
}

(async () => {
    const rows = await loadDataset(),
        companies = rows.map(r => r.company),
        instrumentsTable = getInstrumentsTable(rows),
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

    const sharedChartOptions = {
        chart: {
            backgroundColor: 'var(--mstar-surface)',
            style: {
                fontFamily: '"MorningstarIntrinsic", "Helvetica Neue", ' +
                    'Helvetica, Arial, sans-serif'
            },
            type: 'column'
        },
        credits: {
            enabled: false
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
            categories: companies,
            lineColor: 'var(--mstar-line)',
            tickColor: 'var(--mstar-line)',
            labels: {
                style: labelStyle
            }
        },
        legend: {
            itemStyle: {
                color: 'var(--mstar-text-strong)',
                fontSize: '11px',
                fontWeight: '300'
            },
            itemHoverStyle: {
                color: 'var(--mstar-text-strong)'
            }
        },
        plotOptions: {
            column: {
                groupPadding: 0.1
            }
        },
        accessibility: {
            keyboardNavigation: {
                focusBorder: {
                    enabled: true,
                    style: {
                        color: 'var(--mstar-accent)',
                        lineWidth: 2
                    }
                }
            }
        }
    };

    Dashboards.board('container', {
        dataPool: {
            connectors: [{
                id: 'instruments',
                type: 'JSON',
                columnIds: instrumentsTable.columnIds,
                data: instrumentsTable.data,
                orientation: 'columns',
                firstRowAsNames: false
            }]
        },
        components: [{
            renderTo: 'dashboard-col-volume',
            type: 'Highcharts',
            chartOptions: {
                ...sharedChartOptions,
                title: {
                    text: 'Average Daily Trading Volume',
                    align: 'left',
                    style: {
                        color: 'var(--mstar-text-strong)',
                        fontSize: '16px',
                        fontWeight: '500'
                    }
                },
                subtitle: {
                    text: 'Shares per day · log scale · SEK · ' +
                        'Source: Morningstar',
                    align: 'left',
                    style: {
                        color: 'var(--mstar-text-muted)',
                        fontSize: '12px',
                        fontWeight: '300'
                    }
                },
                caption: {
                    text: 'Cantargia and Acarix dominate trading activity; ' +
                        'Biosergen averages fewer than 2,000 shares per day ' +
                        'across all windows.',
                    style: labelStyle
                },
                yAxis: {
                    type: 'logarithmic',
                    gridLineColor: 'var(--mstar-line)',
                    accessibility: {
                        description: 'Average daily trading volume ' +
                            'in shares, logarithmic scale'
                    },
                    title: {
                        text: 'Shares (log scale)',
                        style: labelStyle
                    },
                    labels: {
                        style: labelStyle
                    }
                },
                tooltip: {
                    ...sharedChartOptions.tooltip,
                    valueDecimals: 0
                },
                series: [{
                    name: '30-day avg',
                    color: 'var(--mstar-s1)',
                    data: rows.map(r => r.vol30d)
                }, {
                    name: '90-day avg',
                    color: 'var(--mstar-s2)',
                    data: rows.map(r => r.vol90d)
                }, {
                    name: '180-day avg',
                    color: 'var(--mstar-s3)',
                    data: rows.map(r => r.vol180d)
                }]
            }
        }, {
            renderTo: 'dashboard-col-volatility',
            type: 'Highcharts',
            chartOptions: {
                ...sharedChartOptions,
                title: {
                    text: 'Annualized Price Volatility',
                    align: 'left',
                    style: {
                        color: 'var(--mstar-text-strong)',
                        fontSize: '16px',
                        fontWeight: '500'
                    }
                },
                subtitle: {
                    text: 'Rolling window annualized volatility · % · ' +
                        'Source: Morningstar',
                    align: 'left',
                    style: {
                        color: 'var(--mstar-text-muted)',
                        fontSize: '12px',
                        fontWeight: '300'
                    }
                },
                caption: {
                    text: '2cureX shows extreme price swings — 90-day ' +
                        'annualized volatility exceeds 131% - while Acarix ' +
                        'is the most stable name in the basket.',
                    style: labelStyle
                },
                yAxis: {
                    gridLineColor: 'var(--mstar-line)',
                    accessibility: {
                        description: 'Annualized price volatility ' +
                            'as a percentage'
                    },
                    title: {
                        text: 'Volatility (%)',
                        style: labelStyle
                    },
                    labels: {
                        format: '{value}%',
                        style: labelStyle
                    }
                },
                tooltip: {
                    ...sharedChartOptions.tooltip,
                    valueSuffix: '%',
                    valueDecimals: 1
                },
                series: [{
                    name: '10-day',
                    color: 'var(--mstar-s1)',
                    data: rows.map(r => r.vola10d)
                }, {
                    name: '30-day',
                    color: 'var(--mstar-s2)',
                    data: rows.map(r => r.vola30d)
                }, {
                    name: '60-day',
                    color: 'var(--mstar-s3)',
                    data: rows.map(r => r.vola60d)
                }, {
                    name: '90-day',
                    color: 'var(--mstar-s4)',
                    data: rows.map(r => r.vola90d)
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
                    cells: {
                        format: '{value:.1f}%'
                    }
                },
                columns: [{
                    id: 'Company',
                    cells: {
                        format: '{value}'
                    }
                }, {
                    id: '30-Day Avg. Volume',
                    cells: {
                        format: '{value:,.0f}'
                    }
                }, {
                    id: '90-Day Avg. Volume',
                    cells: {
                        format: '{value:,.0f}'
                    }
                }, {
                    id: '180-Day Avg. Volume',
                    cells: {
                        format: '{value:,.0f}'
                    }
                }]
            }
        }]
    });
})();
