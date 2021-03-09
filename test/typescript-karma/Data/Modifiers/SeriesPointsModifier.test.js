import DataTable from '/base/js/Data/DataTable.js';
import DataTableRow from '/base/js/Data/DataTableRow.js';
import SeriesPointsModifier from '/base/js/Data/Modifiers/SeriesPointsModifier.js';

QUnit.test('SeriesPointsModifier.execute', function (assert) {

    const table = new DataTable([
            new DataTableRow({
                id: 'Norway',
                population: 41251,
                gdp: 150
            }),
            new DataTableRow({
                id: 'Sweden',
                population: 21251,
                gdp: 950
            }),
            new DataTableRow({
                id: 'Finland',
                population: (new DataTable()).toJSON(),
                gdp: 950
            })
        ]),
        modifier = new SeriesPointsModifier({
            aliasMap: {
              x: 'population',
              y: 'gdp'
            }
        }),
        modifiedTable = modifier.execute(table);

    assert.strictEqual(
        table.getRowCell(0, 'gdp'),
        modifiedTable.getRowCell(0, 'y'),
        'Modified table should contain copy of rows with alternative column names.'
    );

});
