const currentMonth = Date.UTC(2023, 9);
const data = [
    ['Date', 'Budget', 'Cost', 'Revenue'],
    [Date.UTC(2019, 0), 7000000, 6200000, 8200000],
    [Date.UTC(2019, 1), 7500000, 5800000, 8700000],
    [Date.UTC(2019, 2), 7000000, 7500000, 8200000],
    [Date.UTC(2019, 3), 7000000, 6400000, 8200000],
    [Date.UTC(2019, 4), 7500000, 6700000, 8700000],
    [Date.UTC(2019, 5), 7000000, 7300000, 8200000],
    [Date.UTC(2019, 6), 7500000, 6900000, 8700000],
    [Date.UTC(2019, 7), 7000000, 7100000, 8200000],
    [Date.UTC(2019, 8), 7500000, 6800000, 8700000],
    [Date.UTC(2019, 9), 7000000, 5900000, 8200000],
    [Date.UTC(2019, 10), 7000000, 6300000, 8200000],
    [Date.UTC(2019, 11), 7500000, 6500000, 8700000],
    [Date.UTC(2020, 0), 7000000, 7200000, 8200000],
    [Date.UTC(2020, 1), 7000000, 6600000, 8200000],
    [Date.UTC(2020, 2), 7500000, 5700000, 8700000],
    [Date.UTC(2020, 3), 7000000, 7000000, 8200000],
    [Date.UTC(2020, 4), 7500000, 6300000, 8700000],
    [Date.UTC(2020, 5), 7000000, 6800000, 8200000],
    [Date.UTC(2020, 6), 7500000, 6200000, 8700000],
    [Date.UTC(2020, 7), 7000000, 7400000, 8200000],
    [Date.UTC(2020, 8), 7500000, 6900000, 8700000],
    [Date.UTC(2020, 9), 7000000, 7100000, 8200000],
    [Date.UTC(2020, 10), 7500000, 7300000, 8700000],
    [Date.UTC(2020, 11), 7000000, 6800000, 8200000],
    [Date.UTC(2021, 0), 7500000, 6200000, 8700000],
    [Date.UTC(2021, 1), 7000000, 6500000, 8200000],
    [Date.UTC(2021, 2), 7500000, 6700000, 8700000],
    [Date.UTC(2021, 3), 7000000, 7200000, 8200000],
    [Date.UTC(2021, 4), 7500000, 6400000, 8700000],
    [Date.UTC(2021, 5), 7000000, 5900000, 8200000],
    [Date.UTC(2021, 6), 7500000, 6100000, 8700000],
    [Date.UTC(2021, 7), 8000000, 6300000, 9200000],
    [Date.UTC(2021, 8), 8500000, 7000000, 9700000],
    [Date.UTC(2021, 9), 8000000, 8500000, 9200000],
    [Date.UTC(2021, 10), 8500000, 8000000, 9700000],
    [Date.UTC(2021, 11), 8000000, 8300000, 9200000],
    [Date.UTC(2022, 0), 8500000, 8600000, 9700000],
    [Date.UTC(2022, 1), 8000000, 8800000, 9200000],
    [Date.UTC(2022, 2), 8500000, 8500000, 9700000],
    [Date.UTC(2022, 3), 8000000, 7500000, 9200000],
    [Date.UTC(2022, 4), 8500000, 8700000, 9700000],
    [Date.UTC(2022, 5), 8000000, 9500000, 10200000],
    [Date.UTC(2022, 6), 8500000, 8200000, 8700000],
    [Date.UTC(2022, 7), 8000000, 8900000, 10700000],
    [Date.UTC(2022, 8), 8500000, 9200000, 9200000],
    [Date.UTC(2022, 9), 8000000, 7800000, 7800000],
    [Date.UTC(2022, 10), 8500000, 8500000, 8000000],
    [Date.UTC(2022, 11), 8000000, 7800000, 8000000],
    [Date.UTC(2023, 0), 8500000, 6900000, 8700000],
    [Date.UTC(2023, 1), 8000000, 7100000, 8900000],
    [Date.UTC(2023, 2), 8500000, 7200000, 8000000],
    [Date.UTC(2023, 3), 8000000, 7400000, 8000000],
    [Date.UTC(2023, 4), 8500000, 6900000, 8700000],
    [Date.UTC(2023, 5), 8000000, 7100000, 8900000],
    [Date.UTC(2023, 6), 8500000, 7500000, 8000000],
    [Date.UTC(2023, 7), 8000000, 7300000, 8700000],
    [Date.UTC(2023, 8), 8500000, 7600000, 8900000],
    [Date.UTC(2023, 9), 8000000, 7600000, 8900000],
    [Date.UTC(2023, 10), 7500000, null, null],
    [Date.UTC(2023, 11), 7600000, null, null]
];

const commonGaugeOptions = {
    chart: {
        height: 150,
        type: 'gauge',
        className: 'gauge'
    },
    subtitle: {
        floating: true,
        verticalAlign: 'bottom',
        y: 20
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
            distance: 12
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
                format: '<div><span class="unit">MNOK</span> {y}</div>'
            }
        }
    }
};

const commonColumnOptions = {
    chart: {
        className: 'column',
        type: 'column',
        events: {
            click: () => {
                togglePopup(true);
            }
        }
    },
    xAxis: {
        type: 'datetime',
        min: Date.UTC(2023)
    },
    yAxis: {
        tickInterval: 2e6
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
            type: 'JSON',
            id: 'data',
            options: {
                data: data,
                dataModifier: {
                    type: 'Math',
                    columnFormulas: [{
                        column: 'Result',
                        formula: 'D1-C1'
                    }, {
                        column: 'AccResult',
                        formula: 'SUM(E$1:E1)'
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
                                id: 'rev-chart-kpi',
                                width: '55%'
                            }, {
                                id: 'rev-forecast-kpi',
                                width: '45%'
                            }]
                        }, {
                            cells: [{
                                id: 'cost-chart-kpi',
                                width: '55%'
                            }, {
                                id: 'cost-forecast-kpi',
                                width: '45%'
                            }]
                        }, {
                            cells: [{
                                id: 'res-chart-kpi',
                                width: '55%'
                            }, {
                                id: 'res-forecast-kpi',
                                width: '45%'
                            }]
                        }]
                    },
                    responsive: {
                        large: {
                            width: 470
                        },
                        medium: {
                            width: '50%'
                        },
                        small: {
                            width: '100%'
                        }
                    }
                }, {
                    id: 'stock-cell'
                }]
            }, {
                cells: [{
                    id: 'rev-chart',
                    responsive: {
                        large: {
                            width: '50%'
                        },
                        medium: {
                            width: '100%'
                        },
                        small: {
                            width: '100%'
                        }
                    }
                }, {
                    id: 'cost-chart'
                }]
            }]
        }]
    },
    components: [{
        cell: 'rev-chart-kpi',
        type: 'KPI',
        value: 76.3,
        chartOptions: Highcharts.merge(commonGaugeOptions, {
            title: {
                text: 'Revenue (YTD)'
            },
            subtitle: {
                text: '89% of target'
            },
            yAxis: {
                max: 96,
                tickPositions: [59, 72, 83, 96],
                plotBands: [{
                    from: 0,
                    to: 59,
                    className: 'null-band'
                }, {
                    from: 59,
                    to: 72,
                    className: 'warn-band'
                }, {
                    from: 72,
                    to: 83,
                    className: 'opt-band'
                }, {
                    from: 83,
                    to: 96,
                    className: 'high-band'
                }]
            },
            series: [{
                data: [76.3]
            }]
        })
    }, {
        cell: 'rev-forecast-kpi',
        type: 'KPI',
        title: 'Forecast is MNOK 89,7',
        value: 90,
        valueFormat: '{value}%',
        subtitle: 'of target'
    }, {
        cell: 'cost-chart-kpi',
        type: 'KPI',
        value: 61.3,
        chartOptions: Highcharts.merge(commonGaugeOptions, {
            title: {
                text: 'Cost (YTD)'
            },
            subtitle: {
                text: '84% of target'
            },
            yAxis: {
                max: 75,
                tickPositions: [50, 59, 67, 75],
                plotBands: [{
                    from: 0,
                    to: 50,
                    className: 'null-band'
                }, {
                    from: 50,
                    to: 59,
                    className: 'warn-band'
                }, {
                    from: 59,
                    to: 67,
                    className: 'opt-band'
                }, {
                    from: 67,
                    to: 75,
                    className: 'warn-band'
                }]
            },
            series: [{
                data: [61.3]
            }]
        })
    }, {
        cell: 'cost-forecast-kpi',
        type: 'KPI',
        title: 'Forecast is MNOK 74,5',
        value: 92,
        valueFormat: '{value}%',
        subtitle: 'of target'
    }, {
        cell: 'res-chart-kpi',
        type: 'KPI',
        value: 14.9,
        chartOptions: Highcharts.merge(commonGaugeOptions, {
            title: {
                text: 'Result (YTD)'
            },
            subtitle: {
                text: '78% of target'
            },
            yAxis: {
                max: 21,
                tickPositions: [9, 13, 16, 21],
                plotBands: [{
                    from: 0,
                    to: 9,
                    className: 'null-band'
                }, {
                    from: 9,
                    to: 13,
                    className: 'warn-band'
                }, {
                    from: 13,
                    to: 16,
                    className: 'opt-band'
                }, {
                    from: 16,
                    to: 21,
                    className: 'high-band'
                }]
            },
            series: [{
                data: [14.9]
            }]
        })
    }, {
        cell: 'res-forecast-kpi',
        type: 'KPI',
        title: 'Forecast is MNOK 15,3',
        value: 78,
        valueFormat: '{value}%',
        subtitle: 'of target'
    }, {
        cell: 'rev-chart',
        type: 'Highcharts',
        connector: {
            id: 'data'
        },
        columnAssignment: {
            Date: 'x',
            Budget: 'y',
            Revenue: 'y'
        },
        chartOptions: Highcharts.merge(commonColumnOptions, {
            title: {
                text: 'Revenue'
            }
        })
    }, {
        cell: 'cost-chart',
        type: 'Highcharts',
        connector: {
            id: 'data'
        },
        columnAssignment: {
            Date: 'x',
            Budget: 'y',
            Cost: 'y'
        },
        chartOptions: Highcharts.merge(commonColumnOptions, {
            title: {
                text: 'Cost'
            }
        })
    }, {
        cell: 'stock-cell',
        type: 'Highcharts',
        chartConstructor: 'stockChart',
        connector: {
            id: 'data'
        },
        columnAssignment: {
            Date: 'x',
            AccResult: 'y'
        },
        chartOptions: {
            xAxis: {
                plotLines: [{
                    value: currentMonth,
                    label: {
                        text: 'current month'
                    }
                }]
            }
        }
    }]
}, true);


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

    // eslint-disable-next-line no-new
    new DataGrid.DataGrid('datagrid-container', {
        dataTable: (await board).dataPool.connectors.data.table,
        columns: {
            Date: {
                cellFormatter: function () {
                    return this.value ? (
                        new Date(this.value)
                            .toISOString()
                            .substring(0, 10)
                    ) : '?';
                }
            }
        }
    });
}