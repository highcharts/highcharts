import { describe, it } from 'node:test';
import { deepStrictEqual, strictEqual } from 'node:assert';

import DataCursor from '../../../../../ts/Data/DataCursor';
import type DataTable from '../../../../../ts/Data/DataTable';
import DataCursorHelper from '../../../../../ts/Dashboards/SerializeHelper/DataCursorHelper';

describe('DataCursorHelper', () => {
    it('should serialize DataCursor to JSON with expected structure', () => {
        const stateMap: DataCursor.StateMap = {
            'table-1': {
                'point.selected': [{
                    type: 'position',
                    column: 'a',
                    row: 1,
                    state: 'point.selected',
                }]
            },
            'table-2': {
                '': [{
                    type: 'range',
                    firstRow: 2,
                    lastRow: 9,
                    state: '',
                }]
            }
        };
        const states = new DataCursor(stateMap);

        deepStrictEqual(
            DataCursorHelper.toJSON(states),
            {
                $class: 'Data.DataCursor',
                stateMap
            },
            'DataCursor.JSON should have expected structure.'
        );
    });

    it('should maintain consistent structure through serialization round-trip', () => {
        const stateMap: DataCursor.StateMap = {
            'table-1': {
                'point.selected': [{
                    type: 'position',
                    column: 'a',
                    row: 1,
                    state: 'point.selected',
                }]
            },
            'table-2': {
                '': [{
                    type: 'range',
                    firstRow: 2,
                    lastRow: 9,
                    state: '',
                }]
            }
        };
        const states = new DataCursor(stateMap);

        deepStrictEqual(
            DataCursorHelper.toJSON(
                DataCursorHelper.fromJSON(
                    DataCursorHelper.toJSON(states)
                )
            ),
            {
                $class: 'Data.DataCursor',
                stateMap
            },
            'DataCursor.JSON should keep a consistent structure.'
        );
    });

    it('should keep the state map prototype-less after deserialization', () => {
        const cursor = DataCursorHelper.fromJSON(JSON.parse(
            '{"$class":"Data.DataCursor","stateMap":{"table-1":{"":[]}}}'
        ));

        strictEqual(
            Object.getPrototypeOf(cursor.stateMap),
            null,
            'The deserialized state map should have no prototype.'
        );
        strictEqual(
            Object.getPrototypeOf(cursor.stateMap['table-1']),
            null,
            'The deserialized states of a table should have no prototype.'
        );

        // A table-like object skips the ID check in DataTableCore.
        for (const id of ['__proto__', 'constructor']) {
            const table = { id } as unknown as DataTable;

            cursor.addListener(id, 'hover', (): void => {});
            cursor.emitCursor(
                table,
                { type: 'position', row: 1, state: 'hover' },
                void 0,
                true
            );
        }

        strictEqual(
            Object.prototype.hasOwnProperty.call(Object.prototype, 'hover'),
            false,
            'A `__proto__` table ID should not change Object.prototype.'
        );
        strictEqual(
            Object.prototype.hasOwnProperty.call(Object, 'hover'),
            false,
            'A `constructor` table ID should not change Object.'
        );
    });
});
