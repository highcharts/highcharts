import { describe, it } from 'node:test';
import { deepStrictEqual, notStrictEqual, strictEqual, ok } from 'node:assert';

import DataTable from '../../../../ts/Data/DataTable.js';
import SortModifier from '../../../../ts/Data/Modifiers/SortModifier.js';

describe('DataTable', () => {

    describe('clone', () => {
        it('should create a new instance with same data', () => {
            const table = new DataTable({ id: 'table' });

            table.setRows([['row1', 1]]);
            table.setCell('1', 0, 100);

            const tableClone = table.clone();

            notStrictEqual(
                table,
                tableClone,
                'Cloned table should be a new instance.'
            );

            strictEqual(
                (table as any).converter,
                (tableClone as any).converter,
                'Cloned and original table should have the same converter reference.'
            );

            deepStrictEqual(
                (table as any).hcEvents,
                (tableClone as any).hcEvents,
                'Cloned and original table should have the same events.'
            );

            strictEqual(
                table.id,
                tableClone.id,
                'Cloned and original table should have the same id.'
            );

            strictEqual(
                (table as any).versionTag,
                (tableClone as any).versionTag,
                'Cloned and original table should have the same versionTag.'
            );
        });
    });

    describe('Column Rename', () => {
        it('should move cells of a column to a new column', () => {
            const table = new DataTable({
                columns: {
                    column1: [true],
                    existingColumn: [true]
                }
            });

            ok(
                table.changeColumnId('column1', 'newColumn'),
                'Table should move cells of a column to a new column.'
            );
            deepStrictEqual(
                table.getColumns(['column1', 'newColumn']),
                { newColumn: [true] },
                'Table should only return renamed column.'
            );
        });

        it('should move cell of a column to an existing column (with force)', () => {
            const table = new DataTable({
                columns: {
                    column1: [true],
                    existingColumn: [true]
                }
            });

            // First rename
            table.changeColumnId('column1', 'newColumn');

            ok(
                table.changeColumnId('newColumn', 'existingColumn'),
                'Table should move cell of a column to an existing column (with force).'
            );
            deepStrictEqual(
                table.getColumns(['newColumn', 'existingColumn']),
                { existingColumn: [true] }
            );
        });

        it('should fail when trying to move a non-existing column', () => {
            const table = new DataTable({
                columns: {
                    column1: [true],
                    existingColumn: [true]
                }
            });

            table.setColumn('existingColumn', [true]);

            strictEqual(
                table.changeColumnId('nonexistant', 'existingColumn'),
                false,
                'Table should fail when trying to move a non-existant column.'
            );

            deepStrictEqual(
                table.getColumns(['nonexistant', 'existingColumn']),
                { existingColumn: [true] },
                'Table should retrieve only existing column.'
            );
        });
    });

    describe('Column Retrieve', () => {
        it('should retrieve columns with correct structure', () => {
            const table = new DataTable({
                columns: {
                    id: [0, 1],
                    a: ['a0', 'a1'],
                    b: [0.0002, 'b1'],
                    c: ['c0', 'c1']
                }
            });
            const columns = table.getColumns();

            deepStrictEqual(
                Object.keys(columns),
                ['id', 'a', 'b', 'c'],
                'Result has column names in correct order.'
            );

            Object
                .values(columns)
                .forEach(column => strictEqual(
                    column.length,
                    2,
                    'Result has correct amount of column cells.'
                ));
        });
    });

    describe('Events', () => {
        it('should fire events for setRows', () => {
            const registeredEvents: string[] = [];

            function registerEvent(e: { type: string }) {
                registeredEvents.push(e.type);
            }

            const table = new DataTable({
                columns: {
                    id: ['a'],
                    text: ['text']
                }
            });

            table.on('setRows', registerEvent);
            table.on('afterSetRows', registerEvent);

            registeredEvents.length = 0;
            table.setRows([
                ['b', 'text'],
                {
                    id: 'c',
                    text: 'text'
                }
            ]);
            deepStrictEqual(
                registeredEvents,
                [
                    'setRows',
                    'afterSetRows'
                ],
                'Events for DataTable.setRows should be in expected order.'
            );
        });

        it('should fire events for setCell', () => {
            const registeredEvents: string[] = [];

            function registerEvent(e: { type: string }) {
                registeredEvents.push(e.type);
            }

            const table = new DataTable({
                columns: {
                    id: ['a'],
                    text: ['text']
                }
            });

            table.on('setCell', registerEvent);
            table.on('afterSetCell', registerEvent);

            table.setCell('text', table.getRowIndexBy('id', 'a')!, 'test');
            deepStrictEqual(
                registeredEvents,
                [
                    'setCell',
                    'afterSetCell'
                ],
                'Events for DataTable.setCell should be in expected order.'
            );
        });

        it('should fire events for deleteRows', () => {
            const registeredEvents: string[] = [];

            function registerEvent(e: { type: string }) {
                registeredEvents.push(e.type);
            }

            const table = new DataTable({
                columns: {
                    id: ['a', 'b', 'c'],
                    text: ['text1', 'text2', 'text3']
                }
            });

            table.on('deleteRows', registerEvent);
            table.on('afterDeleteRows', registerEvent);

            strictEqual(
                table.getRowCount(),
                3,
                'DataTable should contain three rows.'
            );
            table.deleteRows(0);
            strictEqual(
                table.getRowCount(),
                2,
                'DataTable should contain two rows.'
            );
            deepStrictEqual(
                registeredEvents,
                [
                    'deleteRows',
                    'afterDeleteRows'
                ],
                'Events for DataTable.deleteRows should be in expected order.'
            );
        });

        it('should fire events for setColumn', () => {
            const registeredEvents: string[] = [];

            function registerEvent(e: { type: string }) {
                registeredEvents.push(e.type);
            }

            const table = new DataTable({
                columns: {
                    id: ['a'],
                    text: ['text']
                }
            });

            table.on('setColumns', registerEvent);
            table.on('afterSetColumns', registerEvent);

            table.setColumn('new', ['new']);
            deepStrictEqual(
                registeredEvents,
                [
                    'setColumns',
                    'afterSetColumns'
                ],
                'Events for DataTable.setColumn should be in expected order.'
            );
        });

        it('should fire events for deleteColumns', () => {
            const registeredEvents: string[] = [];

            function registerEvent(e: { type: string }) {
                registeredEvents.push(e.type);
            }

            const table = new DataTable({
                columns: {
                    id: ['a'],
                    text: ['text'],
                    extra: ['extra']
                }
            });

            table.on('deleteColumns', registerEvent);
            table.on('afterDeleteColumns', registerEvent);

            table.deleteColumns(['extra']);
            deepStrictEqual(
                registeredEvents,
                [
                    'deleteColumns',
                    'afterDeleteColumns'
                ],
                'Events for DataTable.deleteColumns should be in expected order.'
            );
        });

        it('should fire events for clone', () => {
            const registeredEvents: string[] = [];

            function registerEvent(e: { type: string }) {
                registeredEvents.push(e.type);
            }

            const table = new DataTable({
                columns: {
                    id: ['a'],
                    text: ['text']
                }
            });

            table.on('cloneTable', registerEvent);
            table.on('afterCloneTable', registerEvent);

            table.clone();
            deepStrictEqual(
                registeredEvents,
                [
                    'cloneTable',
                    'afterCloneTable'
                ],
                'Events for DataTable.clone should be in expected order.'
            );
        });

        it('should fire events for setModifier', async () => {
            const registeredEvents: string[] = [];

            function registerEvent(e: { type: string }) {
                registeredEvents.push(e.type);
            }

            const table = new DataTable({
                columns: {
                    id: ['a'],
                    text: ['text']
                }
            });

            table.on('setModifier', registerEvent);
            table.on('afterSetModifier', registerEvent);
            table.on('cloneTable', registerEvent);
            table.on('afterCloneTable', registerEvent);

            await table.setModifier(new SortModifier());

            deepStrictEqual(
                registeredEvents,
                [
                    'setModifier',
                    'cloneTable',
                    'afterCloneTable',
                    'afterSetModifier'
                ],
                'Events for DataTable.setModifier should be in expected order.'
            );
        });

        it('should fire events for setModifier when clearing modifier', async () => {
            const registeredEvents: string[] = [];

            function registerEvent(e: { type: string }) {
                registeredEvents.push(e.type);
            }

            const table = new DataTable({
                columns: {
                    id: ['a'],
                    text: ['text']
                }
            });

            await table.setModifier(new SortModifier());

            table.on('setModifier', registerEvent);
            table.on('afterSetModifier', registerEvent);

            await table.setModifier();

            deepStrictEqual(
                registeredEvents,
                [
                    'setModifier',
                    'afterSetModifier'
                ],
                'Events for DataTable.setModifier should be in expected order.'
            );
        });
    });

    describe('deleteRows', () => {
        const createTable = () => new DataTable({
            columns: {
                id: [3, 2, 1, 5, 3, 9, 0, 7, 6, 8, 4, 1, 7]
            }
        });

        it('should delete all rows when called without arguments', () => {
            const table = createTable();
            table.deleteRows();
            strictEqual(
                table.getRowCount(),
                0,
                'deleteRows() should delete all rows.'
            );
        });

        it('should delete row at specific index', () => {
            const table = createTable();
            table.deleteRows(5);
            deepStrictEqual(
                table.getColumn('id'),
                [3, 2, 1, 5, 3, 0, 7, 6, 8, 4, 1, 7],
                'deleteRows(5) should remove row at index 5.'
            );
        });

        it('should delete multiple consecutive rows', () => {
            const table = createTable();
            table.deleteRows(5, 2);
            deepStrictEqual(
                table.getColumn('id'),
                [3, 2, 1, 5, 3, 7, 6, 8, 4, 1, 7],
                'deleteRows(5, 2) should remove rows at indices 5 and 6.'
            );
        });

        it('should delete rows at multiple indices (array form)', () => {
            const table = createTable();
            table.deleteRows([2, 0, 3, 2]);
            deepStrictEqual(
                table.getColumn('id'),
                [2, 3, 9, 0, 7, 6, 8, 4, 1, 7],
                'deleteRows([2, 0, 3, 2]) should remove rows at indices 0, 2, 3.'
            );
        });

        it('should not delete any rows for out-of-bounds index', () => {
            const table = createTable();
            table.deleteRows(999);
            strictEqual(
                table.getRowCount(),
                13,
                'deleteRows(999) should not delete any rows.'
            );
        });

        it('should not delete any rows when count is 0', () => {
            const table = createTable();
            table.deleteRows(5, 0);
            strictEqual(
                table.getRowCount(),
                13,
                'deleteRows(5, 0) should not delete any rows.'
            );
        });

        it('should not delete any rows for out-of-bounds array indices', () => {
            const table = createTable();
            table.deleteRows([999, 1000]);
            strictEqual(
                table.getRowCount(),
                13,
                'deleteRows([999, 1000]) should not delete any rows.'
            );
        });

        it('should not delete any rows for negative indices', () => {
            const table = createTable();
            table.deleteRows([-5]);
            strictEqual(
                table.getRowCount(),
                13,
                'deleteRows([-5]) should not delete any rows.'
            );
        });

        it('should not delete any rows for empty array', () => {
            const table = createTable();
            table.deleteRows([]);
            strictEqual(
                table.getRowCount(),
                13,
                'deleteRows([]) should not delete any rows.'
            );
        });
    });

    describe('getRows', () => {
        it('should return row with non-existing column', () => {
            const table = new DataTable({ columns: { 'a': [0] } });

            const rowObject = table.getRowObject(undefined as any, ['Non-Existing Column']);

            deepStrictEqual(
                Object.keys(rowObject!),
                ['Non-Existing Column'],
                'Table should return row with non-existing column.'
            );

            const cellArray = table.getRow(undefined as any, ['Non-Existing Column']);

            deepStrictEqual(
                cellArray,
                [undefined],
                'Table should return row with non-existing column.'
            );
        });
    });

    describe('setRows', () => {
        it('should maintain row data when cloning and resetting', () => {
            const table = new DataTable({
                columns: {
                    column1: [true],
                    existingColumn: [true]
                }
            });
            const tableClone = table.clone();

            strictEqual(
                tableClone.getRowCount(),
                table.getRowCount(),
                'Cloned table should have same rows length.'
            );

            tableClone.deleteRows();

            deepStrictEqual(
                tableClone.getRowCount(),
                0,
                'Clone is empty and has no rows.'
            );

            tableClone.setRows(table.getRows());

            deepStrictEqual(
                tableClone.getRow(0),
                table.getRow(0),
                'Row values are the same after clone.'
            );
        });
    });

    describe('setColumns', () => {
        it('should set columns at specific index', () => {
            const table = new DataTable({
                columns: {
                    x: [0, 1, 2],
                    y: [3, 1, 2]
                }
            });

            table.setColumns({
                x: [8, 9],
                y: [0, 1]
            }, 0);

            deepStrictEqual(
                table.getColumns(),
                {
                    x: [8, 9, 2],
                    y: [0, 1, 2]
                },
                'Table should contain three rows of valid values.'
            );
        });

        it('should truncate columns when setting shorter columns', () => {
            const table = new DataTable({
                columns: {
                    x: [0, 1, 2],
                    y: [3, 1, 2]
                }
            });

            table.setColumns({
                x: [8, 9],
                y: [0, 1]
            }, 0);

            table.setColumns({
                x: [8, 7]
            });

            deepStrictEqual(
                table.getColumns(),
                {
                    x: [8, 7],
                    y: [0, 1]
                },
                'Table should contain two rows of valid values.'
            );
        });

        it('should preserve Float32Array type', () => {
            const table = new DataTable({
                columns: {
                    x: [0, 1, 2],
                    y: [3, 1, 2]
                }
            });

            table.setColumns({
                x: new Float32Array([10, 9, 8, 7, 6, 5])
            });

            const columns = table.getColumns();

            ok(
                columns.x instanceof Float32Array,
                'x column should be a Float32Array.'
            );

            strictEqual(
                columns.x.length,
                6,
                'x column should contain 6 values.'
            );
        });

        it('should preserve Float32Array type when typeAsOriginal is true', () => {
            // This test needs the table state from prior tests - replicate that setup
            const table = new DataTable({
                columns: {
                    x: [0, 1, 2],
                    y: [3, 1, 2]
                }
            });

            // First modifications (from prior tests)
            table.setColumns({
                x: [8, 9],
                y: [0, 1]
            }, 0);

            table.setColumns({
                x: [8, 7]
            });

            // Now set Float32Array
            table.setColumns({
                x: new Float32Array([10, 9, 8, 7, 6, 5])
            });

            table.setColumns({
                x: [0, 1, 2]
            }, 0, void 0, true);

            const columns = table.getColumns();

            ok(
                columns.x instanceof Float32Array,
                'x column should stay a Float32Array when typeAsOriginal is true.'
            );

            // Get all columns as arrays
            const columnsAsArrays = table.getColumns(void 0, false, true);

            // Check x column
            deepStrictEqual(
                columnsAsArrays.x,
                [0, 1, 2, 7, 6, 5],
                'x column should have correct values.'
            );

            // Check y column length and specific values (sparse array handling)
            strictEqual(columnsAsArrays.y.length, 6, 'y column should have 6 elements');
            strictEqual(columnsAsArrays.y[0], 0, 'y[0] should be 0');
            strictEqual(columnsAsArrays.y[1], 1, 'y[1] should be 1');
            strictEqual(columnsAsArrays.y[2], undefined, 'y[2] should be undefined');
            strictEqual(columnsAsArrays.y[3], undefined, 'y[3] should be undefined');
            strictEqual(columnsAsArrays.y[4], undefined, 'y[4] should be undefined');
            strictEqual(columnsAsArrays.y[5], undefined, 'y[5] should be undefined');
        });

        it('should transform to conventional array when needed', () => {
            // This test needs the table state from prior tests - replicate that setup
            const table = new DataTable({
                columns: {
                    x: [0, 1, 2],
                    y: [3, 1, 2]
                }
            });

            // First modifications (from prior tests)
            table.setColumns({
                x: [8, 9],
                y: [0, 1]
            }, 0);

            table.setColumns({
                x: [8, 7]
            });

            // Set Float32Array
            table.setColumns({
                x: new Float32Array([10, 9, 8, 7, 6, 5])
            });

            table.setColumns({
                x: [0, 1, 2]
            }, 0, void 0, true);

            // Now transform to regular array
            table.setColumns({
                x: [5, 5, 5]
            }, 0);

            const columns = table.getColumns();

            ok(
                Array.isArray(columns.x),
                'x column should be transformed to a conventional array.'
            );

            // Check x column
            deepStrictEqual(
                columns.x,
                [5, 5, 5, 7, 6, 5],
                'x column should have correct values.'
            );

            // Check y column length and specific values (sparse array handling)
            strictEqual(columns.y.length, 6, 'y column should have 6 elements');
            strictEqual(columns.y[0], 0, 'y[0] should be 0');
            strictEqual(columns.y[1], 1, 'y[1] should be 1');
            strictEqual(columns.y[2], undefined, 'y[2] should be undefined');
            strictEqual(columns.y[3], undefined, 'y[3] should be undefined');
            strictEqual(columns.y[4], undefined, 'y[4] should be undefined');
            strictEqual(columns.y[5], undefined, 'y[5] should be undefined');
        });
    });

    describe('setModifier', () => {
        it('should return unsorted columns before modifier is applied', () => {
            const table = new DataTable({
                columns: {
                    x: [0, 1, 2],
                    y: [3, 1, 2]
                }
            });

            deepStrictEqual(
                table.getModified().getColumns(),
                {
                    x: [0, 1, 2],
                    y: [3, 1, 2]
                },
                'Modified table should contain unsorted columns.'
            );
        });

        it('should sort columns with orderInColumn option', async () => {
            const modifier = new SortModifier({
                direction: 'asc',
                orderByColumn: 'y',
                orderInColumn: 'x'
            });
            const table = new DataTable({
                columns: {
                    x: [0, 1, 2],
                    y: [3, 1, 2]
                }
            });

            await table.setModifier(modifier);

            deepStrictEqual(
                table.getModified().getColumns(),
                {
                    x: [2, 0, 1],
                    y: [3, 1, 2]
                },
                'Modified table should contain sorted columns.'
            );

            // Access private properties via any cast for testing internal state
            const modified = table.getModified() as any;
            deepStrictEqual(
                [
                    modified.originalRowIndexes,
                    modified.localRowIndexes
                ],
                [void 0, void 0],
                'Table sorted with `orderInColumn` option should not change ' +
                'the row indexes of the original table.'
            );
        });

        it('should sort columns in descending order', async () => {
            const modifier = new SortModifier({
                direction: 'desc',
                orderByColumn: 'y'
            });
            const table = new DataTable({
                columns: {
                    x: [0, 1, 2],
                    y: [3, 1, 2]
                }
            });

            await table.setModifier(modifier);

            deepStrictEqual(
                table.getModified().getColumns(),
                {
                    x: [0, 2, 1],
                    y: [3, 2, 1]
                },
                'Modified table should contain sorted columns.'
            );

            strictEqual(
                table.getModified().getLocalRowIndex(1), 2,
                'Sorted table should allow to retrieve the local row index' +
                'from the original row index.'
            );

            strictEqual(
                table.getModified().getOriginalRowIndex(2), 1,
                'Sorted table should allow to retrieve the original row index' +
                'from the local row index.'
            );
        });

        it('should remove row index references with deleteRowIndexReferences', async () => {
            const modifier = new SortModifier({
                direction: 'desc',
                orderByColumn: 'y'
            });
            const table = new DataTable({
                columns: {
                    x: [0, 1, 2],
                    y: [3, 1, 2]
                }
            });

            await table.setModifier(modifier);

            table.getModified().deleteRowIndexReferences();
            
            // Access private properties via any cast for testing internal state
            const modified = table.getModified() as any;
            deepStrictEqual(
                [
                    modified.originalRowIndexes,
                    modified.localRowIndexes
                ],
                [void 0, void 0],
                'The `deleteRowIndexReferences` method should remove row ' +
                'index references.'
            );
        });
    });

    describe('setRow insert argument', () => {
        it('should insert a new row at position 0', () => {
            const table = new DataTable({
                columns: {
                    ID: [1, 2, 3],
                    Name: ['John', 'Jane', 'Alice']
                }
            });

            deepStrictEqual(
                table.getColumn('ID'),
                [1, 2, 3],
                'Initial ID column values are correct.'
            );

            // Insert a new row at position 0 (beginning)
            table.setRow({ ID: 99 }, 0, true);

            deepStrictEqual(
                table.getColumn('ID'),
                [99, 1, 2, 3],
                'New row inserted at the beginning when insert=true.'
            );

            deepStrictEqual(
                table.getColumn('Name'),
                [null, 'John', 'Jane', 'Alice'],
                'If no value is provided, the new row is filled with `null`.'
            );
        });
    });

    describe('Metadata in a cloned table', () => {
        it('should be a shallow copy', () => {
            // Note: We use an object value in metadata to properly test shallow copy behavior
            const metadataValue = { dataType: 'number' };
            const table = new DataTable({
                columns: {
                    ID: [1, 2, 3]
                },
                metadata: {
                    ID: metadataValue as any
                }
            });

            const tableClone = table.clone();

            notStrictEqual(
                tableClone.metadata,
                table.metadata,
                'Metadata object should be a new shallow copy.'
            );
            strictEqual(
                tableClone.metadata!.ID,
                table.metadata!.ID,
                'Nested metadata objects should still reference the same object.'
            );
            deepStrictEqual(
                tableClone.metadata,
                table.metadata,
                'Cloned metadata should have equal structure and values.'
            );
        });
    });

});
