const handler = function () {
    const { chart, board } = this;

    const handleCursor = e => {
        const table = this.connector && this.connector.table;

        if (!table) {
            return;
        }

        if (chart && chart.series.length) {
            const cursor = e.cursor;
            if (cursor.type === 'position') {
                const [series] = chart.series.length > 1 && cursor.column ?
                    chart.series.filter(
                        series => series.name === cursor.column
                    ) : chart.series;

                if (series && series.visible && cursor.row !== void 0) {
                    const point = series.points[cursor.row];

                    if (point) {
                        chart.hoverPoint = point;
                        point.setState('hover');
                    }
                }
            }
        }
    };

    const handleCursorOut = () => {
        if (chart && chart.hoverPoint) {
            chart.hoverPoint.setState();
            chart.hoverPoint = void 0;
        }
    };

    const registerCursorListeners = () => {
        const { dataCursor: cursor } = board;

        // @todo wrap in a listener on component.update with
        // connector change
        if (cursor) {
            const table = this.connector && this.connector.table;

            if (table) {
                cursor.addListener(table.id, 'point.mouseOver', handleCursor);
                cursor.addListener(table.id, 'point.mouseOut', handleCursorOut);
            }
        }
    };

    const unregisterCursorListeners = () => {
        const table = this.connector && this.connector.table;

        if (table) {
            board.dataCursor.removeListener(table.id, 'point.mouseOver', handleCursor);
            board.dataCursor.removeListener(table.id, 'point.mouseOut', handleCursorOut);
        }
    };

    if (board) {
        registerCursorListeners();

        this.on('setConnector', () => unregisterCursorListeners());
        this.on('afterSetConnector', () => registerCursorListeners());
    }
};

const emitter = function () {
    if (this.type === 'Highcharts') {
        const { chart, board } = this;

        if (board) {
            const { dataCursor: cursor } = board;

            this.on('afterRender', () => {
                const table = this.connector && this.connector.table;
                if (chart && chart.series && table) {
                    chart.series.forEach(series => {
                        series.update({
                            point: {
                                events: {
                                    // Emit table cursor
                                    mouseOver: function () {
                                        cursor.emitCursor(table, {
                                            type: 'position',
                                            row: this.index,
                                            column: series.name,
                                            state: 'point.mouseOver'
                                        });
                                    },
                                    mouseOut: function () {
                                        cursor.emitCursor(table, {
                                            type: 'position',
                                            row: this.index,
                                            column: series.name,
                                            state: 'point.mouseOut'
                                        });
                                    }
                                }
                            }
                        });
                    });
                }
            });


            // Return function that handles cleanup
            return function () {
                if (chart && chart.series) {
                    chart.series.forEach(series => {
                        series.update({
                            point: {
                                events: {
                                    mouseOver: void 0,
                                    mouseOut: void 0
                                }
                            }
                        });
                    });

                }
            };
        }
    }
};

Dashboards.board('container', {
    dataPool: {
        connectors: [{
            id: 'micro-element',
            type: 'JSON',
            options: {
                firstRowAsNames: false,
                columnNames: ['Food', 'Vitamin A',  'Iron'],
                data: [
                    ['Beef Liver', 6421, 6.5],
                    ['Lamb Liver', 2122, 6.5],
                    ['Cod Liver Oil', 1350, 0.9],
                    ['Mackerel', 388, 1],
                    ['Tuna', 214, 0.6]
                ]
            }
        }]
    },
    gui: {
        layouts: [{
            rows: [{
                cells: [{
                    id: 'dashboard-col-0'
                }, {
                    id: 'dashboard-col-1'
                }]
            }]
        }]
    },
    components: [{
        sync: {
            highlightMarker: {
                handler: handler,
                emitter: emitter
            }
        },
        connector: {
            id: 'micro-element'
        },
        cell: 'dashboard-col-0',
        type: 'Highcharts',
        columnAssignment: {
            Food: 'x',
            'Vitamin A': 'value'
        },
        chartOptions: {
            chart: {
                animation: false
            },
            title: {
                text: 'Vitamin A'
            },
            xAxis: {
                type: 'category'
            }
        }
    },
    {
        cell: 'dashboard-col-1',
        sync: {
            highlightMarker: {
                handler: handler,
                emitter: emitter
            }
        },
        connector: {
            id: 'micro-element'
        },
        type: 'Highcharts',
        columnAssignment: {
            Food: 'x',
            Iron: 'y'
        },
        chartOptions: {
            chart: {
                animation: false
            },
            title: {
                text: 'Iron'
            },
            xAxis: {
                type: 'category'
            }
        }
    }]
}, true);
