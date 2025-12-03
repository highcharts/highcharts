import { describe, it } from 'node:test';
import { deepStrictEqual, strictEqual } from 'node:assert';

import DataTable from '../../../../../ts/Data/DataTable.js';
import FilterModifier from '../../../../../ts/Data/Modifiers/FilterModifier.js';

describe('FilterModifier', () => {

    describe('queries', () => {
        it('should keep all rows when no condition is specified', async () => {
            const table = new DataTable({
                columns: {
                    x: [1, 2, 3],
                    name: ['A', 'B', 'C']
                }
            });
            const modifier = new FilterModifier();

            await modifier.modify(table);

            deepStrictEqual(
                table.getModified().getColumns(),
                { x: [1, 2, 3], name: ['A', 'B', 'C'] },
                'With no condition, all rows are kept.'
            );
        });

        it('should filter with !== operator', async () => {
            const base = [1, 2, 3, 4, 5];
            const table = new DataTable({
                columns: {
                    x: base.slice()
                }
            });
            const modifier = new FilterModifier({
                condition: {
                    operator: '!==',
                    columnId: 'x',
                    value: 3
                }
            });

            await modifier.modify(table);

            deepStrictEqual(
                table.getModified().getColumns(),
                { x: [1, 2, 4, 5] },
                'Operator ne filters out 3.'
            );
        });

        it('should filter with < operator', async () => {
            const base = [1, 2, 3, 4, 5];
            const table = new DataTable({ columns: { x: base.slice() } });
            const modifier = new FilterModifier({
                condition: {
                    operator: '<',
                    columnId: 'x',
                    value: 4
                }
            });

            await modifier.modify(table);

            deepStrictEqual(
                table.getModified().getColumns(),
                { x: [1, 2, 3] },
                'Operator lt keeps values less than 4.'
            );
        });

        it('should filter with empty operator', async () => {
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

            deepStrictEqual(
                table.modified.getColumns(),
                { name: [null, ''] },
                'Only empty strings and nulls are kept.'
            );
        });

        it('should filter dates correctly', async () => {
            // Use timestamps for dates since Date objects are not valid DataTableValue
            const date1 = new Date(2020, 0, 1).getTime();
            const date2 = new Date(2020, 0, 2).getTime();
            const date3 = new Date(2020, 0, 3).getTime();
            
            const table = new DataTable({
                columns: {
                    x: [date1, date2, date3]
                }
            });
            const modifier = new FilterModifier({
                condition: {
                    operator: '<=',
                    columnId: 'x',
                    value: date2
                }
            });

            await modifier.modify(table);

            deepStrictEqual(
                table.modified.getColumns(),
                {
                    x: [date1, date2]
                },
                'Dates (as timestamps) are compared as numbers.'
            );
        });

        it('should filter with contains operator (ignoreCase: false)', async () => {
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

            deepStrictEqual(
                table.getModified().getColumns(),
                { name: ['apricot'] },
                'contains "ap" (ignoreCase false) matches only apricot.'
            );
        });

        it('should filter with not empty operator', async () => {
            const data = ['Apple', 'banana', '', 'date', null];
            const table = new DataTable({ columns: { name: data } });
            const modifier = new FilterModifier({
                condition: {
                    operator: 'not',
                    condition: {
                        operator: 'empty',
                        columnId: 'name',
                        value: null
                    }
                }
            });

            await modifier.modify(table);

            deepStrictEqual(
                table.modified.getColumns(),
                { name: ['Apple', 'banana', 'date'] },
                'Only empty strings and nulls are kept.'
            );
        });

        it('should filter with contains operator (ignoreCase: true, default)', async () => {
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

            deepStrictEqual(
                table.getModified().getColumns(),
                { name: ['Apple', 'apricot'] },
                'contains "ap" (ignoreCase true) matches Apple & apricot.'
            );
        });

        it('should filter with not contains operator', async () => {
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

            deepStrictEqual(
                table.modified.getColumns(),
                { name: data },
                'Table should not contain "TK" and should return all rows.'
            );
        });

        it('should filter with startsWith operator', async () => {
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

            deepStrictEqual(
                table.modified.getColumns(),
                { name: ['banana'] },
                'startsWith "ban" matches only banana.'
            );
        });

        it('should filter with endsWith operator', async () => {
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

            deepStrictEqual(
                table.modified.getColumns(),
                { name: ['banana'] },
                'endsWith "na" matches only banana.'
            );
        });

        it('should filter with nested not and logical conditions', async () => {
            const rows = {
                x: [-5, -1, 0, 5],
                z: [100, 2000, 500, 3000]
            };
            const table = new DataTable({ columns: rows });
            const modifier = new FilterModifier();

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

            deepStrictEqual(
                table.getModified().getColumns(),
                {
                    x: [-5, 0, 5],
                    z: [100, 500, 3000]
                },
                'Excludes only the row where x<0 and z>1000.'
            );
        });

        it('should filter with complex or/and/not conditions', async () => {
            const rows = {
                x: [-5, -1, 0, 5],
                z: [100, 2000, 500, 3000]
            };

            // (x >= 0 or z <= 500) and not(x == 5)
            const table = new DataTable({ columns: rows });
            const modifier = new FilterModifier({
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

            deepStrictEqual(
                table.getModified().getColumns(),
                {
                    x: [-5, 0],
                    z: [100, 500]
                },
                'Keeps rows where (x>=0 or z<=500) excluding x==5.'
            );
        });

        it('should filter with complex mix of and/or for adults in US or CA', async () => {
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

            deepStrictEqual(
                table.getModified().getColumns(),
                {
                    age: [30, 45],
                    country: ['CA', 'US']
                },
                'Selects adults in US or CA.'
            );
        });
    });

    describe('index mappings', () => {
        it('should set originalRowIndexes and localRowIndexes correctly', async () => {
            const table = new DataTable({
                columns: {
                    x: [10, 20, 30, 40, 50]
                }
            });
            const modifier = new FilterModifier({
                condition: { operator: '>', columnId: 'x', value: 25 }
            });

            await modifier.modify(table);

            // Sanity check: only values > 25 are kept
            deepStrictEqual(
                table.getModified().getColumn('x'),
                [30, 40, 50],
                'Only values > 25 are kept.'
            );

            deepStrictEqual(
                (table.getModified() as any).originalRowIndexes,
                [2, 3, 4],
                'originalRowIndexes map to the original indices of the filtered rows.'
            );

            // Check sparse array values at specific positions
            const localRowIndexes = (table.getModified() as any).localRowIndexes;
            strictEqual(localRowIndexes[0], undefined, 'localRowIndexes[0] should be undefined');
            strictEqual(localRowIndexes[1], undefined, 'localRowIndexes[1] should be undefined');
            strictEqual(localRowIndexes[2], 0, 'localRowIndexes[2] should be 0');
            strictEqual(localRowIndexes[3], 1, 'localRowIndexes[3] should be 1');
            strictEqual(localRowIndexes[4], 2, 'localRowIndexes[4] should be 2');
        });
    });

});
