import DataTable from '/base/js/Data/DataTable.js';
import SeriesPointsModifier from '/base/js/Data/Modifiers/SeriesPointsModifier.js';

QUnit.test('SeriesPointsModifier.execute', function (assert) {

    const tableJSON = {
            $class: 'DataTable',
            rows: [{
                $class: 'DataTableRow',
                id: 'Norway',
                population: 41251,
                gdp: 150
            }, {
                $class: 'DataTableRow',
                id: 'Sweden',
                population: 21251,
                gdp: 950
            }, {
                $class: 'DataTableRow',
                id: 'Finland',
                population: (new DataTable()).toJSON(),
                gdp: 950
            }]
        },
        table = DataTable.fromJSON(tableJSON),
        modifier = new SeriesPointsModifier({
            aliasMap: {
              x: 'population',
              y: 'gdp'
            }
        }),
        modifiedTable = modifier.execute(table);

    assert.ok(
        modifiedTable !== table &&
        modifiedTable.getRow(0) !== table.getRow(0) &&
        table.getRowCell(0, 'gdp') === modifiedTable.getRowCell(0, 'y'),
        'Modified table should contain copy of rows with alternative column names.'
    );
});
