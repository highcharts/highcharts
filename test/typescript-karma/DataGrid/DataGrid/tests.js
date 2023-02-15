import DataGrid from '/base/code/es-modules/DataGrid/DataGrid.js';

QUnit.test('DataGrid constructor', function (assert) {

    const container = document.createElement('div'),
        dataGrid = new DataGrid(container, {
            // nothing here yet
        });

    assert.strictEqual(
        dataGrid.container,
        container,
        'DataGrid container should be the provided container element.'
    );

});
