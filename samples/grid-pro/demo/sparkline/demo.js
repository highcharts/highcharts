Grid.grid('container', {
    dataTable: {
        columns: {
            line: [
                '[1, 5, 2, 4, 3, 6]',
                '[5, 2, 3, 4, 7, 2]',
                '[1, 5, 2, 3, 3, 4]',
                '[7, 5, 4, 3, 4, 6]',
                '[1, 5, 2, 6, 3, 2]'
            ],
            area: [
                '[5, 2, 4, 3, 5, 2]',
                '[1, 2, 3, 2, 4, 6]',
                '[7, 3, 3, 4, 5, 8]',
                '[2, 4, 3, 7, 3, 3]',
                '[10, 9, 2, 6, 5, 7]'
            ],
            bar: [
                '[1, 4, 2]',
                '[1, 1, 1]',
                '[0, 1, 5]',
                '[0, 5, 6]',
                '[10, 1, 10]'
            ],
            column: [
                '[1, 1, 2, 2, 3, 3, 4, 4]',
                '[5, 3, 4, 5, 5, 4, 3, 5]',
                '[1, 1, 6, 2, 1, 1, 5, 2]',
                '[5, 2, 3, 5, 6, 4, 5, 5]',
                '[1, 2, 1, 3, 2, 4, 5, 2]'
            ],
            pieA: [20, 10, 1, 25, 5],
            pieB: [50, 50, 90, 25, 85],
            pieC: [30, 40, 9, 50, 10],
            singleBar: [-5, 10, 4, -8, 9]
        }
    },
    columns: [{
        id: 'line',
        header: {
            format: 'Line'
        },
        cells: {
            renderer: {
                type: 'sparkline'
            }
        }
    }, {
        id: 'area',
        header: {
            format: 'Area'
        },
        cells: {
            renderer: {
                type: 'sparkline',
                chartOptions: {
                    chart: {
                        type: 'area'
                    }
                }
            }
        }
    }, {
        id: 'bar',
        header: {
            format: 'Bar'
        },
        cells: {
            renderer: {
                type: 'sparkline',
                chartOptions: {
                    chart: {
                        type: 'bar'
                    }
                }
            }
        }
    }, {
        id: 'column',
        header: {
            format: 'Column'
        },
        cells: {
            renderer: {
                type: 'sparkline',
                chartOptions: {
                    chart: {
                        type: 'column'
                    }
                }
            }
        }
    }, {
        id: 'pieA',
        header: {
            format: 'Pie'
        },
        cells: {
            renderer: {
                type: 'sparkline',
                chartOptions: function () {
                    const rowData = this.row.data;
                    return {
                        chart: {
                            animation: true
                        },
                        series: [{
                            type: 'pie',
                            data: [
                                rowData.pieA,
                                rowData.pieB,
                                rowData.pieC
                            ]
                        }]
                    };
                }
            }
        },
        width: 70
    }, {
        id: 'pieB',
        enabled: false
    }, {
        id: 'pieC',
        enabled: false
    }, {
        id: 'singleBar',
        header: {
            format: 'Custom'
        },
        cells: {
            renderer: {
                type: 'sparkline',
                chartOptions: {
                    chart: {
                        type: 'bar'
                    },
                    yAxis: {
                        min: -10,
                        max: 10
                    },
                    plotOptions: {
                        bar: {
                            negativeColor: '#f00',
                            dataLabels: {
                                enabled: true
                            }
                        }
                    }
                }
            }
        }
    }]
}, true).then(grid => {
    const updaters = {
        pieA: cell => {
            ['pieA', 'pieB', 'pieC'].forEach(colId => {
                const value = Math.round(Math.random() * 100);
                grid.dataTable.setCell(colId, cell.row.id, value);
            });
            cell.row.loadData();
            cell.content.update();
        },
        singleBar: cell => {
            cell.setValue(Math.round(Math.random() * 20 - 10));
        },
        default: cell => {
            const arr = JSON.parse(cell.value);
            arr.shift();
            arr.push(Math.round(Math.random() * 10));
            cell.setValue(JSON.stringify(arr));
        }
    };

    function scheduleUpdate(columnId, rowIndex) {
        const delay = Math.random() * 4000;

        setTimeout(() => {
            const column = grid.viewport.getColumn(columnId);
            if (!column) {
                return;
            }

            const cell = column.cells[rowIndex];
            if (!cell) {
                return;
            }

            const updater = updaters[columnId] || updaters.default;
            updater(cell);

            scheduleUpdate(columnId, rowIndex);
        }, delay);
    }

    for (const column of grid.viewport.columns) {
        for (const row of grid.viewport.rows) {
            scheduleUpdate(column.id, row.index);
        }
    }
});
