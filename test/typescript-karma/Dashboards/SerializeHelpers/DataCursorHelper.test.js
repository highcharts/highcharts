import DataCursor from '/base/code/es-modules/Data/DataCursor.js';
import DataCursorHelper from '/base/code/dashboards/es-modules/Dashboards/SerializeHelper/DataCursorHelper.js';

QUnit.test('DataCursorHelper.toJSON', function (assert) {

    const stateMap = {
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
        },
        states = new DataCursor(stateMap);

    assert.deepEqual(
        DataCursorHelper.toJSON(states),
        {
            $class: 'Data.DataCursor',
            stateMap
        },
        'DataCursor.JSON should have expected structure.'
    );

    assert.deepEqual(
        DataCursorHelper.toJSON(
            DataCursorHelper.fromJSON(
                DataCursorHelper.toJSON(states)
            )
        ),
        {
            $class: 'Data.DataCursor',
            stateMap
        },
        'DataCursor.JSON should keep a consisten structure.'
    );

});
