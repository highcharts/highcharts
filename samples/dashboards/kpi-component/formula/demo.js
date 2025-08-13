Dashboards.board('container', {
    dataPool: {
        connectors: [{
            id: 'values',
            type: 'CSV',
            csv: `Value
                30
                NaN
                10
                40
                NaN
                50
                20`
        }]
    },
    components: [{
        renderTo: 'kpi-sum',
        type: 'KPI',
        title: 'KPI sum',
        columnId: 'Value',
        formula: 'SUM',
        connector: {
            id: 'values'
        }
    }, {
        renderTo: 'kpi-average',
        type: 'KPI',
        title: 'KPI average',
        columnId: 'Value',
        formula: 'AVERAGE',
        connector: {
            id: 'values'
        }
    }, {
        renderTo: 'kpi-median',
        type: 'KPI',
        title: 'KPI median',
        columnId: 'Value',
        formula: 'MEDIAN',
        connector: {
            id: 'values'
        }
    }, {
        renderTo: 'kpi-range',
        type: 'KPI',
        title: 'KPI range (callback)',
        columnId: 'Value',
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
        columnId: 'Value',
        formula: 'MIN',
        connector: {
            id: 'values'
        }
    }, {
        renderTo: 'kpi-max',
        type: 'KPI',
        title: 'KPI max',
        columnId: 'Value',
        formula: 'MAX',
        connector: {
            id: 'values'
        }
    }, {
        renderTo: 'kpi-count',
        type: 'KPI',
        title: 'KPI count',
        columnId: 'Value',
        formula: 'COUNT',
        connector: {
            id: 'values'
        }
    }, {
        renderTo: 'kpi-product',
        type: 'KPI',
        title: 'KPI product',
        columnId: 'Value',
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
