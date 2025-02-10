Dashboards.board('container', {
    dataPool: {
        connectors: [{
            id: 'values',
            type: 'CSV',
            options: {
                csv: `Value
                100
                200
                300
                400
                500`
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
            const min = Math.min(...column);
            const max = Math.max(...column);
            return max - min;
        },
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
            }]
        }]
    }
});
