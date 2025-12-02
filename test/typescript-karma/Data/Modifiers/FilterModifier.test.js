import DataTable from '/base/code/es-modules/Data/DataTable.js';
import FilterModifier from '/base/code/es-modules/Data/Modifiers/FilterModifier.js';

QUnit.test('FilterModifier queries', async function (assert) {
    // No condition leaves table intact
    {
        const table = new DataTable({
            columns: {
                x: [1, 2, 3],
                name: ['A', 'B', 'C']
            }
        }),
        modifier = new FilterModifier();
        await modifier.modify(table);
        assert.deepEqual(
            table.getModified().getColumns(),
            { x: [1, 2, 3], name: ['A', 'B', 'C'] },
            'With no condition, all rows are kept.'
        );
    }

    // Numeric comparisons (!==, <)
    {
        const base = [1, 2, 3, 4, 5];
        let table, modifier;

        // x !== 3
        table = new DataTable({
            columns: {
                x: base.slice()
            }
        });
        modifier = new FilterModifier({
            condition: {
                operator: '!==',
                columnId: 'x',
                value: 3
            }
        });
        await modifier.modify(table);
        assert.deepEqual(
            table.getModified().getColumns(),
            { x: [1, 2, 4, 5] },
            'Operator ne filters out 3.'
        );

        // x < 4
        table = new DataTable({ columns: { x: base.slice() } });
        modifier = new FilterModifier({
            condition: {
                operator: '<',
                columnId: 'x',
                value: 4
            }
        });
        await modifier.modify(table);
        assert.deepEqual(
            table.getModified().getColumns(),
            { x: [1, 2, 3] },
            'Operator lt keeps values less than 4.'
        );
    }

    // Number comparison (empty)
    {
        const data = [12, null, '', 30];
        const table = new DataTable({ columns: { name: data } });
        const modifier = new FilterModifier({
            condition: {
                operator: 'empty',
                columnId: 'name',
                value: null
            }
        });
        await modifier.modify(table);
        assert.deepEqual(
            table.modified.getColumns(),
            { name: [null, ''] },
            'Only empty strings and nulls are kept.'
        );
    }

    // Date comparisons
    {
        const table = new DataTable({
            columns: {
                x: [new Date(2020, 0, 1), new Date(2020, 0, 2), new Date(2020, 0, 3)]
            }
        });
        const modifier = new FilterModifier({
            condition: {
                operator: '<=',
                columnId: 'x',
                value: new Date(2020, 0, 2)
            }
        });
        await modifier.modify(table);
        assert.deepEqual(
            table.modified.getColumns(),
            {
                x: [new Date(2020, 0, 1), new Date(2020, 0, 2)]
            },
            'Dates are compared as numbers.'
        );
    }

    // String comparison (contains with ignoreCase: false)
    {
        const data = ['Apple', 'banana', 'Cherry', 'date', 'apricot'];
        const table = new DataTable({ columns: { name: data } });
        const modifier = new FilterModifier({
            condition: {
                operator: 'contains',
                columnId: 'name',
                value: 'ap',
                ignoreCase: false
            }
        });
        await modifier.modify(table);
        assert.deepEqual(
            table.getModified().getColumns(),
            { name: ['apricot'] },
            'contains "ap" (ignoreCase false) matches only apricot.'
        );
    }

    // String comparison (not empty)
    {
        const data = ['Apple', 'banana', '', 'date', null];
        const table = new DataTable({ columns: { name: data } });
        const modifier = new FilterModifier({
            condition: {
                operator: 'not',
                condition: {
                    operator: 'empty',
                    columnId: 'name'
                }
            }
        });
        await modifier.modify(table);
        assert.deepEqual(
            table.modified.getColumns(),
            { name: ['Apple', 'banana', 'date'] },
            'Only empty strings and nulls are kept.'
        );
    }

    // String comparison (contains with default ignoreCase - true)
    {
        const data = ['Apple', 'banana', 'Cherry', 'date', 'apricot'];
        const table = new DataTable({ columns: { name: data } });
        const modifier = new FilterModifier({
            condition: {
                operator: 'contains',
                columnId: 'name',
                value: 'ap'
            }
        });
        await modifier.modify(table);
        assert.deepEqual(
            table.getModified().getColumns(),
            { name: ['Apple', 'apricot'] },
            'contains "ap" (ignoreCase true) matches Apple & apricot.'
        );
    }

    // String comparison (not contains with default ignoreCase - true)
    {
        const data = ['Apple', 'banana', 'Cherry', 'date', 'apricot'];
        const table = new DataTable({ columns: { name: data } });
        const modifier = new FilterModifier({
            condition: {
                operator: 'not',
                condition: {
                    operator: 'contains',
                    columnId: 'name',
                    value: 'TK'
                }
            }
        });
        await modifier.modify(table);
        assert.deepEqual(
            table.modified.getColumns(),
            { name: data },
            'Table should not contain "TK" and should return all rows.'
        );
    }

    // String comparison (startsWith)
    {
        const data = ['Apple', 'banana', 'Cherry', 'date', 'apricot'];
        const table = new DataTable({ columns: { name: data } });
        const modifier = new FilterModifier({
            condition: {
                operator: 'startsWith',
                columnId: 'name',
                value: 'ban'
            }
        });
        await modifier.modify(table);
        assert.deepEqual(
            table.modified.getColumns(),
            { name: ['banana'] },
            'startsWith "ban" matches only banana.'
        );
    }

    // String comparison (endsWith)
    {
        const data = ['Apple', 'banana', 'Cherry', 'date', 'apricot'];
        const table = new DataTable({ columns: { name: data } });
        const modifier = new FilterModifier({
            condition: {
                operator: 'endsWith',
                columnId: 'name',
                value: 'na'
            }
        });
        await modifier.modify(table);
        assert.deepEqual(
            table.modified.getColumns(),
            { name: ['banana'] },
            'endsWith "na" matches only banana and date.'
        );
    }

    // Nested logical and not conditions
    {
        const rows = {
            x: [-5, -1, 0, 5],
            z: [100, 2000, 500, 3000]
        };
        let table = new DataTable({ columns: rows });
        let modifier = new FilterModifier();

        // not( x < 0 and z > 1000 )
        modifier.options.condition = {
            operator: 'not',
            condition: {
                operator: 'and',
                conditions: [
                    { operator: '<', columnId: 'x', value: 0 },
                    { operator: '>', columnId: 'z', value: 1000 }
                ]
            }
        };

        await modifier.modify(table);
        assert.deepEqual(
            table.getModified().getColumns(),
            {
                x: [-5, 0, 5],
                z: [100, 500, 3000]
            },
            'Excludes only the row where x<0 and z>1000.'
        );

        // (x >= 0 or z <= 500) and not(x == 5)
        table = new DataTable({ columns: rows });
        modifier = new FilterModifier({
            condition: {
                operator: 'and',
                conditions: [{
                    operator: 'or',
                    conditions: [
                        { operator: '>=', columnId: 'x', value: 0 },
                        { operator: '<=', columnId: 'z', value: 500 }
                    ]
                }, {
                    operator: 'not',
                    condition: { operator: '===', columnId: 'x', value: 5 }
                }]
            }
        });

        await modifier.modify(table);
        assert.deepEqual(
            table.getModified().getColumns(),
            {
                x: [-5, 0],
                z: [100, 500]
            },
            'Keeps rows where (x>=0 or z<=500) excluding x==5.'
        );
    }

    // Complex mix of and/or
    {
        const rows = {
            age: [17, 18, 30, 45],
            country: ['US', 'FR', 'CA', 'US']
        };
        const table = new DataTable({ columns: rows });
        const modifier = new FilterModifier({
            condition: {
                operator: 'and',
                conditions: [
                    { operator: '>=', columnId: 'age', value: 18 },
                    {
                        operator: 'or',
                        conditions: [
                            { operator: '===', columnId: 'country', value: 'US' },
                            { operator: '===', columnId: 'country', value: 'CA' }
                        ]
                    }
                ]
            }
        });
        await modifier.modify(table);
        assert.deepEqual(
            table.getModified().getColumns(),
            {
                age: [30, 45],
                country: ['CA', 'US']
            },
            'Selects adults in US or CA.'
        );
    }
});

QUnit.test('FilterModifier index mappings', async function (assert) {
    const table = new DataTable({
            columns: {
                x: [10, 20, 30, 40, 50]
            }
        }),
        modifier = new FilterModifier({
            condition: { operator: '>', columnId: 'x', value: 25 }
        });

    await modifier.modify(table);

    // Sanity check: only values > 25 are kept
    assert.deepEqual(
        table.getModified().getColumn('x'),
        [30, 40, 50],
        'Only values > 25 are kept.'
    );

    assert.deepEqual(
        table.getModified().originalRowIndexes,
        [2, 3, 4],
        'originalRowIndexes map to the original indices of the filtered rows.'
    );

    assert.deepEqual(
        table.getModified().localRowIndexes,
        [void 0, void 0, 0, 1, 2],
        'localRowIndexes map original indices to local positions (undefined for filtered-out rows).'
    );
});
