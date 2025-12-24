import { describe, it } from 'node:test';
import { deepStrictEqual, strictEqual, ok } from 'node:assert';

import DataCursor from '../../../../ts/Data/DataCursor';
import DataTable from '../../../../ts/Data/DataTable';

describe('DataCursor', () => {
    describe('emitCursor', () => {
        it('should emit cursor events with correct structure', async () => {
            const cursor = new DataCursor();
            const table = new DataTable({
                columns: {
                    a: [0, 1, 2],
                    b: [10, 11, 12]
                }
            });

            // Track listener calls
            let test2Called = false;
            let test3Called = false;
            let test2Scope: DataCursor | undefined;
            let test3Scope: DataCursor | undefined;
            let test2Event: DataCursor.Event | undefined;
            let test3Event: DataCursor.Event | undefined;

            cursor
                .addListener(table.id, 'test2', function (this: DataCursor, e: DataCursor.Event) {
                    test2Called = true;
                    test2Scope = this;
                    test2Event = e;
                })
                .addListener(table.id, 'test3', function (this: DataCursor, e: DataCursor.Event) {
                    test3Called = true;
                    test3Scope = this;
                    test3Event = e;
                });

            cursor
                .emitCursor(table, {
                    type: 'position',
                    column: 'a',
                    row: 1,
                    state: 'test1'
                })
                .emitCursor(table, {
                    type: 'range',
                    firstRow: 2,
                    lastRow: 9,
                    state: 'test2'
                })
                .emitCursor(table, {
                    type: 'range',
                    firstRow: 0,
                    lastRow: 2,
                    state: 'test3'
                }, undefined, true);

            // Verify test2 listener
            ok(test2Called, 'test2 listener should be called');
            strictEqual(test2Scope, cursor, 'Listener scope should be a DataCursor instance by default.');

            const expectedCursor2: DataCursor.Type = {
                type: 'range',
                firstRow: 2,
                lastRow: 9,
                state: 'test2'
            };
            deepStrictEqual(test2Event?.cursor, expectedCursor2, 'Emitted event should have expected cursor.');
            deepStrictEqual(test2Event?.cursors, [], 'Emitted event should have empty cursors array.');
            strictEqual(test2Event?.table, table, 'Emitted event should have correct table.');

            // Verify test3 listener
            ok(test3Called, 'test3 listener should be called');
            strictEqual(test3Scope, cursor, 'Listener scope should be a DataCursor instance by default.');

            const expectedCursor3: DataCursor.Type = {
                type: 'range',
                firstRow: 0,
                lastRow: 2,
                state: 'test3'
            };
            deepStrictEqual(test3Event?.cursor, expectedCursor3, 'Lasting event should have expected cursor.');
            deepStrictEqual(test3Event?.cursors, [expectedCursor3], 'Lasting event should have cursors array with cursor.');
            strictEqual(test3Event?.table, table, 'Lasting event should have correct table.');
        });
    });

    describe('isEqual', () => {
        describe('position cursors', () => {
            it('should be equal with same state', () => {
                ok(
                    DataCursor.isEqual({
                        type: 'position',
                        state: 'test1'
                    }, {
                        type: 'position',
                        state: 'test1'
                    }),
                    'Cursors should be equal.'
                );
            });

            it('should not be equal with different state', () => {
                ok(
                    !DataCursor.isEqual({
                        type: 'position',
                        state: 'test2a'
                    }, {
                        type: 'position',
                        state: 'test2b'
                    }),
                    'Cursors should not be equal.'
                );
            });

            it('should be equal with same column', () => {
                ok(
                    DataCursor.isEqual({
                        type: 'position',
                        column: 'a',
                        state: 'test3'
                    }, {
                        type: 'position',
                        column: 'a',
                        state: 'test3'
                    }),
                    'Cursors should be equal.'
                );
            });

            it('should not be equal with different column', () => {
                ok(
                    !DataCursor.isEqual({
                        type: 'position',
                        column: 'a',
                        state: 'test4'
                    }, {
                        type: 'position',
                        column: 'b',
                        state: 'test4'
                    }),
                    'Cursors should not be equal.'
                );
            });

            it('should not be equal when one has row and other does not', () => {
                ok(
                    !DataCursor.isEqual({
                        type: 'position',
                        column: 'a',
                        row: 0,
                        state: 'test5'
                    }, {
                        type: 'position',
                        column: 'a',
                        state: 'test5'
                    }),
                    'Cursors should not be equal.'
                );
            });

            it('should be equal with same row', () => {
                ok(
                    DataCursor.isEqual({
                        type: 'position',
                        column: 'a',
                        row: 0,
                        state: 'test6'
                    }, {
                        type: 'position',
                        column: 'a',
                        row: 0,
                        state: 'test6'
                    }),
                    'Cursors should be equal.'
                );
            });

            it('should not be equal with different column and row (including NaN)', () => {
                ok(
                    !DataCursor.isEqual({
                        type: 'position',
                        column: 'a',
                        row: 0,
                        state: 'test7'
                    }, {
                        type: 'position',
                        column: 'b',
                        row: NaN,
                        state: 'test7'
                    }),
                    'Cursors should not be equal.'
                );
            });
        });

        describe('mixed cursor types', () => {
            it('should not be equal when types differ', () => {
                ok(
                    !DataCursor.isEqual({
                        type: 'position',
                        column: 'a',
                        row: 0,
                        state: 'test8'
                    }, {
                        type: 'range',
                        columns: ['a'],
                        firstRow: 0,
                        lastRow: 0,
                        state: 'test8'
                    }),
                    'Cursors should not be equal.'
                );
            });
        });

        describe('range cursors', () => {
            it('should be equal with same range', () => {
                ok(
                    DataCursor.isEqual({
                        type: 'range',
                        firstRow: 0,
                        lastRow: 1,
                        state: 'test9'
                    }, {
                        type: 'range',
                        columns: void 0,
                        firstRow: 0,
                        lastRow: 1,
                        state: 'test9'
                    }),
                    'Cursors should be equal.'
                );
            });

            it('should not be equal with different range', () => {
                ok(
                    !DataCursor.isEqual({
                        type: 'range',
                        firstRow: 0,
                        lastRow: 1,
                        state: 'test10'
                    }, {
                        type: 'range',
                        firstRow: 1,
                        lastRow: 2,
                        state: 'test10'
                    }),
                    'Cursors should not be equal.'
                );
            });

            it('should be equal with empty columns arrays', () => {
                ok(
                    DataCursor.isEqual({
                        type: 'range',
                        columns: [],
                        firstRow: 0,
                        lastRow: 1,
                        state: 'test11'
                    }, {
                        type: 'range',
                        columns: [],
                        firstRow: 0,
                        lastRow: 1,
                        state: 'test11'
                    }),
                    'Cursors should be equal.'
                );
            });

            it('should not be equal with different columns', () => {
                ok(
                    !DataCursor.isEqual({
                        type: 'range',
                        columns: ['a'],
                        firstRow: 0,
                        lastRow: 1,
                        state: 'test12'
                    }, {
                        type: 'range',
                        columns: ['b'],
                        firstRow: 0,
                        lastRow: 1,
                        state: 'test12'
                    }),
                    'Cursors should not be equal.'
                );
            });
        });
    });

    describe('isInRange', () => {
        const cursorRange: DataCursor.Range = {
            type: 'range',
            columns: ['a', 'b', 'c'],
            firstRow: 0,
            lastRow: 9,
            state: 'state2'
        };

        it('should be in range with valid column', () => {
            ok(
                DataCursor.isInRange({
                    type: 'position',
                    column: 'a',
                    state: 'test1'
                }, cursorRange),
                'Cursor should be in range.'
            );
        });

        it('should not be in range with invalid column', () => {
            ok(
                !DataCursor.isInRange({
                    type: 'position',
                    column: 'z',
                    state: 'test2'
                }, cursorRange),
                'Cursor should not be in range.'
            );
        });

        it('should be in range with valid column and row', () => {
            ok(
                DataCursor.isInRange({
                    type: 'position',
                    column: 'b',
                    row: 2,
                    state: 'test3'
                }, cursorRange),
                'Cursor should be in range.'
            );
        });

        it('should not be in range with row out of range', () => {
            ok(
                !DataCursor.isInRange({
                    type: 'position',
                    column: 'b',
                    row: 20,
                    state: 'test4'
                }, cursorRange),
                'Cursor should not be in range.'
            );
        });

        it('should not be in range with invalid column and valid row', () => {
            ok(
                !DataCursor.isInRange({
                    type: 'position',
                    column: 'z',
                    row: 2,
                    state: 'test4'
                }, cursorRange),
                'Cursor should not be in range.'
            );
        });
    });

    describe('toRange', () => {
        it('should convert position with column to range', () => {
            deepStrictEqual(
                DataCursor.toRange({
                    type: 'position',
                    column: 'a',
                    state: 'test1'
                }),
                {
                    type: 'range',
                    columns: ['a'],
                    firstRow: 0,
                    lastRow: Number.MAX_VALUE,
                    state: 'test1'
                },
                'Cursor range should have expected structure.'
            );
        });

        it('should convert position with column and row to range', () => {
            deepStrictEqual(
                DataCursor.toRange({
                    type: 'position',
                    column: 'b',
                    row: 343,
                    state: 'test2'
                }),
                {
                    type: 'range',
                    columns: ['b'],
                    firstRow: 343,
                    lastRow: 343,
                    state: 'test2'
                },
                'Cursor range should have expected structure.'
            );
        });

        it('should convert position with only row to range', () => {
            deepStrictEqual(
                DataCursor.toRange({
                    type: 'position',
                    row: 729,
                    state: 'test2'
                }),
                {
                    type: 'range',
                    firstRow: 729,
                    lastRow: 729,
                    state: 'test2'
                },
                'Cursor range should have expected structure.'
            );
        });
    });
});
