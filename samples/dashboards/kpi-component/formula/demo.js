Dashboards.board('container', {
    dataPool: {
        connectors: [{
            id: 'values',
            type: 'CSV',
            options: {
                csv: `Value
                30
                NaN
                10
                40
                NaN
                50
                20`
            }
        }]
    },
    components: [{
        renderTo: 'kpi-sum',
        type: 'KPI',
        title: 'KPI sum',
        columnName: 'Value',
        formula: 'SUM',
        connector: {
            id: 'values'
        }
    }, {
        renderTo: 'kpi-average',
        type: 'KPI',
        title: 'KPI average',
        columnName: 'Value',
        formula: 'AVERAGE',
        connector: {
            id: 'values'
        }
    }, {
        renderTo: 'kpi-median',
        type: 'KPI',
        title: 'KPI median',
        columnName: 'Value',
        formula: 'MEDIAN',
        connector: {
            id: 'values'
        }
    }, {
        renderTo: 'kpi-range',
        type: 'KPI',
        title: 'KPI range (callback)',
        columnName: 'Value',
        formula: function (column) {
            const filteredColumn =
                column.slice().map(Number).filter(v => !isNaN(v));
            const min = Math.min(...filteredColumn);
            const max = Math.max(...filteredColumn);

            return max - min;
        },
        connector: {
            id: 'values'
        }
    }, {
        renderTo: 'kpi-min',
        type: 'KPI',
        title: 'KPI min',
        columnName: 'Value',
        formula: 'MIN',
        connector: {
            id: 'values'
        }
    }, {
        renderTo: 'kpi-max',
        type: 'KPI',
        title: 'KPI max',
        columnName: 'Value',
        formula: 'MAX',
        connector: {
            id: 'values'
        }
    }, {
        renderTo: 'kpi-count',
        type: 'KPI',
        title: 'KPI count',
        columnName: 'Value',
        formula: 'COUNT',
        connector: {
            id: 'values'
        }
    }, {
        renderTo: 'kpi-product',
        type: 'KPI',
        title: 'KPI product',
        columnName: 'Value',
        formula: 'PRODUCT',
        connector: {
            id: 'values'
        }
    }],
    gui: {
        layouts: [{
            rows: [{
                cells: [{
                    id: 'kpi-sum'
                }, {
                    id: 'kpi-average'
                }]
            }, {
                cells: [{
                    id: 'kpi-median'
                }, {
                    id: 'kpi-range'
                }]
            }, {
                cells: [{
                    id: 'kpi-min'
                }, {
                    id: 'kpi-max'
                }]
            }, {
                cells: [{
                    id: 'kpi-count'
                }, {
                    id: 'kpi-product'
                }]
            }]
        }]
    }
});
