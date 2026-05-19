Dashboards.board('container', {
    dataPool: {
        connectors: [
            {
                id: 'data-connector',
                type: 'JSON',
                data: {
                    kpis: { a: 1, b: 2 },
                    more: {
                        alpha: [1, 2, 3, 4, 5],
                        beta: [10, 20, 30, 40, 50]
                    }
                },
                dataTables: [{
                    key: 'more',
                    beforeParse: function ({ more }) {
                        const keys = Object.keys(more);
                        return [
                            keys,
                            ...more[keys[0]].map((_, index) =>
                                keys.map(key => more[key][index])
                            )
                        ];
                    }
                }, {
                    key: 'kpis',
                    firstRowAsNames: false,
                    columnIds: ['a', 'b'],
                    beforeParse: function ({ kpis }) {
                        return [[kpis.a, kpis.b]];
                    },
                    dataModifier: {
                        type: 'Math',
                        columnFormulas: [{
                            column: 'c',
                            formula: 'A1+B1'
                        }]
                    }
                }]
            }
        ]
    },
    gui: {
        layouts: [{
            id: 'layout-1',
            rows: [{
                cells: [{
                    id: 'dashboard-col-0'
                }, {
                    id: 'dashboard-col-1'
                }]
            }, {
                cells: [{
                    id: 'dashboard-col-2'
                }, {
                    id: 'dashboard-col-3'
                }]
            }]
        }]
    },
    components: [{
        renderTo: 'dashboard-col-0',
        type: 'Grid',
        connector: [{
            id: 'data-connector',
            dataTableKey: 'more'
        }],
        sync: {
            highlight: true,
            visibility: true
        }
    }, {
        renderTo: 'dashboard-col-1',
        type: 'Grid',
        connector: [{
            id: 'data-connector',
            dataTableKey: 'kpis'
        }],
        sync: {
            highlight: true,
            visibility: true
        }
    }, {
        renderTo: 'dashboard-col-2',
        type: 'Highcharts',
        connector: [{
            id: 'data-connector',
            dataTableKey: 'more'
        }],
        sync: {
            highlight: true,
            visibility: true
        }
    }, {
        renderTo: 'dashboard-col-3',
        type: 'Highcharts',
        connector: [{
            id: 'data-connector',
            dataTableKey: 'kpis'
        }],
        sync: {
            highlight: true,
            visibility: true
        }
    }]
});
