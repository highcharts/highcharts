import DataTable from '/base/code/es-modules/Data/DataTable.js';
import SeriesPointsModifier from '/base/code/es-modules/Data/Modifiers/SeriesPointsModifier.js';

QUnit.test('SeriesPointsModifier.modify', function (assert) {

    const done = assert.async(),
        table = new DataTable({
            country: [ 'Norway', 'Sweden', 'Finland' ],
            population: [ 41251, 21251, new DataTable() ],
            gdp: [ 150, 950, 950 ]
        }),
        modifier = new SeriesPointsModifier({
            aliasMap: {
              x: 'population',
              y: 'gdp'
            }
        });

    modifier
        .modify(table)
        .then((table) => {
            assert.strictEqual(
                table.modified.getCell('y', 0),
                table.getCell('gdp', 0),
                'Modified table should contain copy of rows with alternative column names.'
            );
        })
        .catch((e) =>
            assert.notOk(true, e)
        )
        .then(() =>
            done()
        );

});
