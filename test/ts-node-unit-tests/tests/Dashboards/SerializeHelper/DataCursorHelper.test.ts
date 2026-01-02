import { describe, it } from 'node:test';
import { deepStrictEqual } from 'node:assert';

import DataCursor from '../../../../../ts/Data/DataCursor';
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
});
