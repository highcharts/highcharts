import DataTable from '/base/code/es-modules/Data/DataTable.js';
import RangeModifier from '/base/code/es-modules/Data/Modifiers/RangeModifier.js';

QUnit.test('RangeModifier.modify', function (assert) {

    const done = assert.async(),
        table = new DataTable({
            columns: {
                x: [ -2, -1, 0, 1, 2 ],
                y: [ 'a', 'b', 'c', 'd', 'e' ]
            }
        }),
        modifier = new RangeModifier({});

    modifier
        .modify(table)
        .then((table) => {
            assert.deepEqual(
                table.modified.getRow(0),
                table.getRow(0),
                'Filtered table should contain same rows.'
            );
            return table;
        })
        .then((table) => {
            modifier.options.ranges.push({
                column: 'y',
                minValue: 'A',
                maxValue: 'b'
            });
            return modifier.modify(table);
        })
        .then((table) => {
            assert.deepEqual(
                table.modified.getColumns(),
                {
                    x: [ -2, -1 ],
                    y: [ 'a', 'b' ]
                },
                'Filtered table should contain reduced number of rows.'
            );
            return table;
        })
        .catch((e) =>
            assert.notOk(true, e)
        )
        .then(() =>
            done()
        );

});

QUnit.test('RangeModifier.modifyCell', function (assert) {

    const done = assert.async(),
        modifier = new RangeModifier({
            ranges: [{
                column: 'x',
                minValue: -10,
                maxValue: -2
            }, {
                column: 'y',
                minValue: 'e',
                maxValue: 'z'
            }]
        }),
        table = new DataTable({
            columns: {
                x: [ -2, -1, 0, 1, 2 ],
                y: [ 'a', 'b', 'c', 'd', 'e' ]
            }
        });

    table
        .setModifier(modifier)
        .then((table) => {

            assert.deepEqual(
                table.modified.getRowObjects(),
                [{ x: -2, y: 'a' }, { x: 2, y: 'e' }],
                'Modified table should contain two rows.'
            );

            table.setCell('x', 0, -1.5);

            assert.deepEqual(
                table.modified.getRowObjects(),
                [{ x: 2, y: 'e' }],
                'Modified table should contain one row.'
            );

        })
        .catch((e) =>
            assert.notOk(true, e)
        )
        .then(() =>
            done()
        );
});

QUnit.test('RangeModifier.modifyColumns', function (assert) {

    const done = assert.async(),
        modifier = new RangeModifier({
            ranges: [{
                column: 'x',
                minValue: -10,
                maxValue: -2
            }, {
                column: 'y',
                minValue: 'e',
                maxValue: 'z'
            }]
        }),
        table = new DataTable({
            columns: {
                x: [ -2, -1, 0, 1, 2 ],
                y: [ 'a', 'b', 'c', 'd', 'e' ]
            }
        });

    table
        .setModifier(modifier)
        .then((table) => {

            assert.deepEqual(
                table.modified.getRowObjects(),
                [{ x: -2, y: 'a' }, { x: 2, y: 'e' }],
                'Modified table should contain two rows.'
            );

            table.setColumns({ x: [-3, -2, 0] });

            assert.deepEqual(
                table.modified.getRowObjects(),
                [{ x: -3, y: 'a' }, { x: -2, y: 'b' }],
                'Modified table should contain two rows with valid values.'
            );

        })
        .catch((e) =>
            assert.notOk(true, e)
        )
        .then(() =>
            done()
        );

});

QUnit.test('RangeModifier.modifyRows', function (assert) {

    const done = assert.async(),
        modifier = new RangeModifier({
            ranges: [{
                column: 'x',
                minValue: -10,
                maxValue: -2
            }, {
                column: 'y',
                minValue: 'e',
                maxValue: 'z'
            }]
        }),
        table = new DataTable({
            columns: {
                x: [ -2, -1, 0, 1, 2 ],
                y: [ 'a', 'b', 'c', 'd', 'e' ]
            }
        });

    table
        .setModifier(modifier)
        .then((table) => {

            assert.deepEqual(
                table.modified.getRowObjects(),
                [{ x: -2, y: 'a' }, { x: 2, y: 'e' }],
                'Modified table should contain two rows.'
            );

            table.setRows([{ x: -1.5 }], 0);

            assert.deepEqual(
                table.modified.getRowObjects(),
                [{ x: 2, y: 'e' }],
                'Modified table should contain one row.'
            );

        })
        .catch((e) =>
            assert.notOk(true, e)
        )
        .then(() =>
            done()
        );

});
