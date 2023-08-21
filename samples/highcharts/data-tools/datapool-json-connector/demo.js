Dashboards.board('container', {
    dataPool: {
        connectors: [{
            type: 'JSON',
            id: 'to-parse',
            options: {
                orientation: 'columns',
                beforeParse: function (data) {
                    const res = [];
                    const response = data[0].series;
                    response.forEach(series => {
                        res.push([series.name].concat(series.data));
                    });

                    return res;
                },
                data: [{
                    series: [{
                        name: 'Series 1',
                        data: [1, 2, 3, 4]
                    }, {
                        name: 'Series 2',
                        data: [2, 3, 4, 5]
                    }]
                }]
            }
        }, {
            type: 'JSON',
            id: 'no-first-names',
            options: {
                firstRowAsNames: false,
                columnNames: ['random name', 'second random name', 'third random name'],
                data: [
                    [1, 2, 3],
                    [2, 3, 4]
                ]
            }
        }, {
            type: 'JSON',
            id: 'rows',
            options: {
                orientation: 'rows',
                data: [
                    ['a', 'b', 'c'],
                    [1, 2, 3],
                    [2, 3, 4]
                ]
            }
        }, {
            type: 'JSON',
            id: 'columns',
            options: {
                orientation: 'columns',
                data: [
                    ['a', 1, 2],
                    ['b', 2, 3],
                    ['c', 3, 4],
                    ['d', 4, 5],
                    ['e', 5, 6]
                ]
            }
        }]

    },
    components: [{
        cell: 'dg-rows',
        type: 'DataGrid',
        connector: {
            id: 'rows'
        }
    }, {
        cell: 'dg-columns',
        type: 'DataGrid',
        connector: {
            id: 'columns'
        }
    }, {
        cell: 'dg-no-first-names',
        type: 'DataGrid',
        connector: {
            id: 'no-first-names'
        }
    }, {
        cell: 'dg-to-parse',
        type: 'DataGrid',
        connector: {
            id: 'to-parse'
        }
    }],
    gui: {
        layouts: [{
            rows: [{
                cells: [{
                    id: 'dg-rows'
                }, {
                    id: 'dg-columns'
                }]
            }, {
                cells: [{
                    id: 'dg-no-first-names'
                }, {
                    id: 'dg-to-parse'
                }]
            }]
        }]
    }
});
