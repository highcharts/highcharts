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
                useHTML: true,
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
            <span class="highcharts-color-{colorIndex}">&#9679;</span>&nbsp;
            {series.name}: {(divide y 1000000):.2f}M
        `
    },
    plotOptions: {
        column: {
            point: {
                events: {
                    click: () => {
                        togglePopup(true);
                    }
                }
            }
        }
    }
};

const board = Dashboards.board('container', {
    dataPool: {
        connectors: [{
            type: 'CSV',
            id: 'data',
            options: {
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
                        return `<span style="font-size: 10px">${date}</span><br>
                            ${color('&#9679;', 0)}&nbsp;
                            Result: ${color(format(points[0].y), 0)}
                        `;
                    }

                    return `<span style="font-size: 10px">
                            Forecast for ${date}
                        </span><br>
                        ${color('&#10138;', 2)}&nbsp;
                        Optimistically: ${color(format(points[2].y), 2)}<br>
                        ${color('&#9679;', 0)}&nbsp;
                        Average: ${color(format(points[0].y), 0)}<br>
                        ${color('&#10136;', 1)}&nbsp;
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
    const table = res.dataPool.connectors.data.table.modified.columns;

    const revKPI = res.mountedComponents[0].component;
    const revForecast = res.mountedComponents[1].component;
    const revGoalForecast = res.mountedComponents[2].component;
    const costKPI = res.mountedComponents[3].component;
    const costForecast = res.mountedComponents[4].component;
    const costGoalForecast = res.mountedComponents[5].component;
    const resKPI = res.mountedComponents[6].component;
    const resForecast = res.mountedComponents[7].component;
    const resGoalForecast = res.mountedComponents[8].component;

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

/**
 * Popup
 */

const popup = document.getElementById('popup');

popup.addEventListener('click', e => {
    if (e.target === popup || e.target.className === 'close') {
        togglePopup(false);
    }
});

document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && popup.style.display !== 'none') {
        popup.style.display = 'none';
    }
});

async function togglePopup(open) {
    if (!open) {
        popup.style.display = 'none';
        return;
    }
    popup.style.display = 'flex';

    popup.children[0].children['datagrid-container'].innerHTML = '';

    const formatNumbers = function () {
        return Highcharts.isNumber(this.value) ? `$${(
            this.value / 1e6
        ).toFixed(2)}M` : '-';
    };

    // eslint-disable-next-line no-new
    new DataGrid.DataGrid('datagrid-container', {
        dataTable: (await board).dataPool.connectors.data.table,
        editable: false,
        columns: {
            Date: {
                cellFormatter: function () {
                    return this.value ? (
                        new Date(this.value)
                            .toISOString()
                            .substring(0, 10)
                    ) : '?';
                }
            },
            Budget: {
                show: true,
                cellFormatter: formatNumbers
            },
            Cost: {
                show: true,
                cellFormatter: formatNumbers
            },
            Revenue: {
                show: true,
                cellFormatter: formatNumbers
            },
            Result: {
                show: true,
                cellFormatter: formatNumbers
            },
            CostPredP: {
                show: false
            },
            RevPredP: {
                show: false
            },
            CostPredO: {
                show: false
            },
            RevPredO: {
                show: false
            },
            AccResult: {
                show: false
            },
            CostPredA: {
                show: false
            },
            RevPredA: {
                show: false
            },
            AccResPredP: {
                show: false
            },
            AccResPredO: {
                show: false
            },
            ResPredA: {
                show: false
            },
            AccResPredA: {
                show: false
            }
        }
    });
}
