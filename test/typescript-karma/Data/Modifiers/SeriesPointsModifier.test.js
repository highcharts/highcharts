import OldTownTable from '/base/js/Data/OldTownTable.js';
import OldTownTableRow from '/base/js/Data/OldTownTableRow.js';
import SeriesPointsModifier from '/base/js/Data/Modifiers/SeriesPointsModifier.js';

QUnit.test('SeriesPointsModifier.execute', function (assert) {

    const table = new OldTownTable([
            new OldTownTableRow({
                id: 'Norway',
                population: 41251,
                gdp: 150
            }),
            new OldTownTableRow({
                id: 'Sweden',
                population: 21251,
                gdp: 950
            }),
            new OldTownTableRow({
                id: 'Finland',
                population: (new OldTownTable()).toJSON(),
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
