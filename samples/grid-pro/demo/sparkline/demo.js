Grid.grid('container', {
    dataTable: {
        columns: {
            // Data for the sparkline charts is stored in the Data Table
            // as JSON strings. The sparkline renderer will parse the JSON
            // and render the chart based on the data.
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
            // Data can be provided differently, even in separate columns, but
            // then it needs to be handled correctly in the renderer.
            pieA: [20, 10, 1, 25, 5],
            pieB: [50, 50, 90, 25, 85],
            pieC: [30, 40, 9, 50, 10],
            // Data can be provided as a single value for a single bar chart.
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
                // Default chart type is 'line', so it can be omitted
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
                // To change the chart type, we need to specify it in the
                // chartOptions
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
                // The chartOptions can be a function that returns the options.
                // The context of the function is the cell, the first argument
                // is the raw cell value (not used in this case).
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
        // The rest of the columns storing pie data can be hidden
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
                // You can of course specify more complex chart options
                // for the sparkline, like in the common Highcharts charts.
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

    // Schedule updates for the specific columns' cells. The updaters are
    // functions that modify the cell value and update its content.
    const updaters = {
        singleBar: cell => {
            // For the single bar chart, we just set a random value
            // between -10 and 10. `setValue` is a method that updates the
            // cell value and re-renders the cell content at once.
            cell.setValue(Math.round(Math.random() * 20 - 10));
        },
        pieA: cell => {
            // For the pie charts that are composed of data from multiple
            // columns, we need to update the values directly in the Data Table
            // and then call `loadData` to update the row data.
            ['pieA', 'pieB', 'pieC'].forEach(colId => {
                const value = Math.round(Math.random() * 100);
                grid.dataTable.setCell(colId, cell.row.id, value);
            });
            cell.row.loadData();

            // After updating the row data, we need to update the cell content
            // to reflect the changes in the pie chart.
            cell.content.update();
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
