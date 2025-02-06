Dashboards.board('container', {
    dataPool: {
        connectors: [{
            id: 'values',
            type: 'CSV',
            options: {
                csv: `Value
                300
                200
                300
                400
                100`
            }
        }]
    },
    components: [{
        renderTo: 'kpi-sum',
        type: 'KPI',
        title: 'KPI sum',
        columnName: 'Value',
        calculateValueAs: 'sum',
        connector: {
            id: 'values'
        }
    }, {
        renderTo: 'kpi-average',
        type: 'KPI',
        title: 'KPI average',
        columnName: 'Value',
        calculateValueAs: 'average',
        connector: {
            id: 'values'
        }
    }, {
        renderTo: 'kpi-median',
        type: 'KPI',
        title: 'KPI median',
        columnName: 'Value',
        calculateValueAs: 'median',
        connector: {
            id: 'values'
        }
    }, {
        renderTo: 'kpi-range',
        type: 'KPI',
        title: 'KPI range (callback)',
        columnName: 'Value',
        calculateValueAs(column) {
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
