/* eslint-disable max-len */
Grid.grid('container', {
    data: {
        columns: {
            // Data for the sparkline charts can be provided in various ways.
            // The simplest way is to provide it as a string of comma-separated
            // numbers, which will be parsed by the sparkline renderer.
            line: [
                '1, 5, 2, 4, 3, 6',
                '5, 2, 3, 4, 7, 2',
                '1, 5, 2, 3, 3, 4',
                '7, 5, 4, 3, 4, 6',
                '1, 5, 2, 6, 3, 2'
            ],
            // Data can be provided as a JSON 1D array of numbers.
            area: [
                '[5, 2, 4, 3, 5, 2]',
                '[1, 2, 3, 2, 4, 6]',
                '[7, 3, 3, 4, 5, 8]',
                '[2, 4, 3, 7, 3, 3]',
                '[10, 9, 2, 6, 5, 7]'
            ],
            // But it can also be provided as JSON array of objects.
            bar: [
                '[{ "x": 0, "y": 1, "color": "#91C8E4" }, { "x": 1, "y": 4, "color": "#749BC2" }, { "x": 2, "y": 2, "color": "#4682A9" }]',
                '[{ "x": 0, "y": 1, "color": "#91C8E4" }, { "x": 1, "y": 1, "color": "#749BC2" }, { "x": 2, "y": 1, "color": "#4682A9" }]',
                '[{ "x": 0, "y": 2, "color": "#91C8E4" }, { "x": 1, "y": 1, "color": "#749BC2" }, { "x": 2, "y": 5, "color": "#4682A9" }]',
                '[{ "x": 0, "y": 10, "color": "#91C8E4" }, { "x": 1, "y": 1, "color": "#749BC2" }, { "x": 2, "y": 10, "color": "#4682A9" }]',
                '[{ "x": 0, "y": 10, "color": "#91C8E4" }, { "x": 1, "y": 1, "color": "#749BC2" }, { "x": 2, "y": 10, "color": "#4682A9" }]'
            ],
            // Or 2D arrays, which can be interpreted using series.keys.
            column: [
                '[[0, 1, "#EAA64D"], [1, 1, "#0D5EA6"], [2, 2, "#EAA64D"], [3, 2, "#0D5EA6"], [4, 3, "#EAA64D"], [5, 3, "#0D5EA6"], [6, 4, "#EAA64D"], [7, 4, "#0D5EA6"]]',
                '[[0, 5, "#EAA64D"], [1, 3, "#0D5EA6"], [2, 4, "#EAA64D"], [3, 5, "#0D5EA6"], [4, 5, "#EAA64D"], [5, 4, "#0D5EA6"], [6, 3, "#EAA64D"], [7, 5, "#0D5EA6"]]',
                '[[0, 1, "#EAA64D"], [1, 1, "#0D5EA6"], [2, 6, "#EAA64D"], [3, 2, "#0D5EA6"], [4, 1, "#EAA64D"], [5, 1, "#0D5EA6"], [6, 5, "#EAA64D"], [7, 2, "#0D5EA6"]]',
                '[[0, 5, "#EAA64D"], [1, 2, "#0D5EA6"], [2, 3, "#EAA64D"], [3, 5, "#0D5EA6"], [4, 6, "#EAA64D"], [5, 4, "#0D5EA6"], [6, 5, "#EAA64D"], [7, 5, "#0D5EA6"]]',
                '[[0, 1, "#EAA64D"], [1, 2, "#0D5EA6"], [2, 1, "#EAA64D"], [3, 3, "#0D5EA6"], [4, 2, "#EAA64D"], [5, 4, "#0D5EA6"], [6, 5, "#EAA64D"], [7, 2, "#0D5EA6"]]'
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
                // To change the chart type, we need to specify it in
                // chartOptions
                chartOptions: {
                    chart: {
                        type: 'area',
                        // Take note that the animation is enabled by
                        // default for sparkline charts, but we can disable
                        // it if we want to.
                        animation: false
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
                    },
                    plotOptions: {
                        column: {
                            keys: ['x', 'y', 'color']
                        }
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
                // chartOptions can be an object, or a function that returns the
                // options. The context of the function is the cell, the first
                // argument is the raw cell value (not used in this case).
                chartOptions: function () {
                    const rowData = this.row.data;
                    return {
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
    // The following is for demo purposes only.
    // Schedule updates for the specific columns' cells. The updaters are
    // functions that modify the cell value and update its content.
    const updaters = {
        line: cell => {
            // For the line charts, we just set a random value in the
            // comma-separated string, so the updater function will have to
            // parse it differently.
            const arr = cell.value.split(',').map(Number);
            arr.shift();
            arr.push(Math.round(Math.random() * 10));
            cell.setValue(arr.join(','), true);
        },
        default: cell => {
            const arr = JSON.parse(cell.value);
            const rnd = Math.round(Math.random() * 10);
            const lastPoint = arr[arr.length - 1];
            let cachedPoint = arr.shift();

            if (typeof cachedPoint === 'number') {
                cachedPoint = rnd;
            } else if (Array.isArray(cachedPoint)) {
                cachedPoint[1] = rnd;
                cachedPoint[0] = lastPoint[0] + 1;
            } else if (Object.hasOwn(cachedPoint, 'y')) {
                cachedPoint.y = rnd;

                if (Object.hasOwn(lastPoint, 'x')) {
                    cachedPoint.x = lastPoint.x + 1;
                }
            }

            arr.push(cachedPoint);
            cell.setValue(JSON.stringify(arr), true);
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
        singleBar: cell => {
            // For the single bar chart, we just set a random value
            // between -10 and 10. `setValue` is a method that updates the
            // cell value and re-renders the cell content at once.
            cell.setValue(Math.round(Math.random() * 20 - 10), true);
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
