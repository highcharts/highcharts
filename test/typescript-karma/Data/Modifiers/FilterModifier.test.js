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
            table.modified.getColumns(),
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
                columnName: 'x',
                value: 3
            }
        });
        await modifier.modify(table);
        assert.deepEqual(
            table.modified.getColumns(),
            { x: [1, 2, 4, 5] },
            'Operator ne filters out 3.'
        );

        // x < 4
        table = new DataTable({ columns: { x: base.slice() } });
        modifier = new FilterModifier({
            condition: {
                operator: '<',
                columnName: 'x',
                value: 4
            }
        });
        await modifier.modify(table);
        assert.deepEqual(
            table.modified.getColumns(),
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
                columnName: 'name',
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
                columnName: 'x',
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
                columnName: 'name',
                value: 'ap',
                ignoreCase: false
            }
        });
        await modifier.modify(table);
        assert.deepEqual(
            table.modified.getColumns(),
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
                    columnName: 'name'
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
                columnName: 'name',
                value: 'ap'
            }
        });
        await modifier.modify(table);
        assert.deepEqual(
            table.modified.getColumns(),
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
                    columnName: 'name',
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
                columnName: 'name',
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
                columnName: 'name',
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
                    { operator: '<', columnName: 'x', value: 0 },
                    { operator: '>', columnName: 'z', value: 1000 }
                ]
            }
        };

        await modifier.modify(table);
        assert.deepEqual(
            table.modified.getColumns(),
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
                        { operator: '>=', columnName: 'x', value: 0 },
                        { operator: '<=', columnName: 'z', value: 500 }
                    ]
                }, {
                    operator: 'not',
                    condition: { operator: '===', columnName: 'x', value: 5 }
                }]
            }
        });

        await modifier.modify(table);
        assert.deepEqual(
            table.modified.getColumns(),
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
                    { operator: '>=', columnName: 'age', value: 18 },
                    {
                        operator: 'or',
                        conditions: [
                            { operator: '===', columnName: 'country', value: 'US' },
                            { operator: '===', columnName: 'country', value: 'CA' }
                        ]
                    }
                ]
            }
        });
        await modifier.modify(table);
        assert.deepEqual(
            table.modified.getColumns(),
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
            condition: { operator: '>', columnName: 'x', value: 25 }
        });

    await modifier.modify(table);

    // Sanity check: only values > 25 are kept
    assert.deepEqual(
        table.modified.getColumn('x'),
        [30, 40, 50],
        'Only values > 25 are kept.'
    );

    assert.deepEqual(
        table.modified.originalRowIndexes,
        [2, 3, 4],
        'originalRowIndexes map to the original indices of the filtered rows.'
    );

    assert.deepEqual(
        table.modified.localRowIndexes,
        [void 0, void 0, 0, 1, 2],
        'localRowIndexes map original indices to local positions (undefined for filtered-out rows).'
    );
});
