import DataTable from '/base/js/Data/DataTable.js';
import SeriesPointsModifier from '/base/js/Data/Modifiers/SeriesPointsModifier.js';

QUnit.test('SeriesPointsModifier.execute', function (assert) {

    const table = new DataTable({
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

    assert.strictEqual(
        modifier.modify(table.clone()).getCell('y', 0),
        table.getCell('gdp', 0),
        'Modified table should contain copy of rows with alternative column names.'
    );

});
