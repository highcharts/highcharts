import DataStates from '/base/code/es-modules/Data/DataStates.js';
import DataStatesHelper from '/base/code/es-modules/Dashboards/SerializeHelper/DataStatesHelper.js';

QUnit.test('DataStatesHelper.toJSON', function (assert) {

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
        states = new DataStates(stateMap);

    assert.deepEqual(
        DataStatesHelper.toJSON(states),
        {
            $class: 'Data.DataStates',
            stateMap
        },
        'DataStates.JSON should have expected structure.'
    );

    assert.deepEqual(
        DataStatesHelper.toJSON(
            DataStatesHelper.fromJSON(
                DataStatesHelper.toJSON(states)
            )
        ),
        {
            $class: 'Data.DataStates',
            stateMap
        },
        'DataStates.JSON should keep a consisten structure.'
    );

});
