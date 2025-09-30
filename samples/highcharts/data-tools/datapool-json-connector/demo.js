Dashboards.board('container', {
    dataPool: {
        connectors: [{
            type: 'JSON',
            id: 'array-of-objects',
            data: [{
                name: 'John',
                age: 23,
                weight: 70
            }, {
                name: 'Jane',
                age: 25,
                weight: 65
            }, {
                name: 'Joe',
                age: 21,
                weight: 68
            }, {
                name: 'Jack',
                age: 26,
                weight: 72
            }]
        }, {
            type: 'JSON',
            id: 'to-parse',
            orientation: 'columns',
            beforeParse: function (data) {
                const res = [],
                    response = data[0].series;
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
        }, {
            type: 'JSON',
            id: 'no-first-names',
            firstRowAsNames: false,
            columnIds: [
                'random name', 'second random name', 'third random name'
            ],
            data: [
                [1, 2, 3],
                [2, 3, 4]
            ]
        }, {
            type: 'JSON',
            id: 'rows',
            data: [
                ['a', 'b', 'c'],
                [1, 2, 3],
                [2, 3, 4]
            ]
        }, {
            type: 'JSON',
            id: 'columns',
            orientation: 'columns',
            data: [
                ['a', 1, 2],
                ['b', 2, 3],
                ['c', 3, 4],
                ['d', 4, 5],
                ['e', 5, 6]
            ]
        }]

    },
    components: [{
        renderTo: 'dg-rows',
        type: 'Grid',
        connector: {
            id: 'rows'
        }
    }, {
        renderTo: 'dg-columns',
        type: 'Grid',
        connector: {
            id: 'columns'
        }
    }, {
        renderTo: 'dg-no-first-names',
        type: 'Grid',
        connector: {
            id: 'no-first-names'
        }
    }, {
        renderTo: 'dg-to-parse',
        type: 'Grid',
        connector: {
            id: 'to-parse'
        }
    }, {
        renderTo: 'dg-array-of-objects',
        type: 'Grid',
        connector: {
            id: 'array-of-objects'
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
            }, {
                cells: [{
                    id: 'dg-array-of-objects'
                }]
            }]
        }]
    }
});
