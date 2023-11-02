const sortModifier = new Highcharts.DataModifier.types.Sort();
const rangeModifier = new Highcharts.DataModifier.types.Range();
const mathModifier = new Highcharts.DataModifier.types.Math();
const invertModifier = new Highcharts.DataModifier.types.Invert();
const chainModifier = new Highcharts.DataModifier.types.Chain();

const table = new Highcharts.DataTable({
    columns: {
        name: ['Bakso', 'Dahipuri', 'Mochi', 'Imqaret', 'Mochi', 'Bakso', 'Empanada', 'Kebab', 'Rustico', 'Obatzda'],
        x: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
        y: [28, 30, 13, 9, 39, 2, 31, 11, 18, 15]
    }
});


// "Run Modifiers" Button

document.querySelector('#modify').addEventListener('click', async () => {
    const sortModifierActivate = document.querySelector('#sortmodifier-activate');
    const rangeModifierActivate = document.querySelector('#rangemodifier-activate');
    const mathModifierActivate = document.querySelector('#mathmodifier-activate');
    const invertModifierActivate = document.querySelector('#invertmodifier-activate');

    // reset chain
    chainModifier.clear();

    // add sort to chain
    if (sortModifierActivate.checked) {
        sortModifier.options.direction = document
            .querySelector('#sortmodifier-direction').value;
        sortModifier.options.orderByColumn = document
            .querySelector('#sortmodifier-orderbycolumn').value;
        sortModifier.options.orderInColumn = document
            .querySelector('#sortmodifier-orderincolumn').value || void 0;
        chainModifier.add(sortModifier);
    }

    // add range to chain
    if (rangeModifierActivate.checked) {
        rangeModifier.options.ranges = [{
            column: document.querySelector('#rangemodifier-ranges-column')
                .value,
            maxValue: document.querySelector('#rangemodifier-ranges-maxvalue')
                .value || void 0,
            minValue: document.querySelector('#rangemodifier-ranges-minvalue')
                .value || void 0
        }];
        rangeModifier.options.strict = document
            .querySelector('#rangemodifier-strict').value === 'true';
        chainModifier.add(rangeModifier);
    }

    // add math to chain
    if (mathModifierActivate.checked) {
        mathModifier.options.columnFormulas = [{
            column: document
                .querySelector('#mathmodifier-columnformulas-column')
                .value,
            formula: document
                .querySelector('#mathmodifier-columnformulas-formula')
                .value
        }];
        chainModifier.add(mathModifier);
    }

    // add invert to chain
    if (invertModifierActivate.checked) {
        chainModifier.add(invertModifier);
    }

    // apply modifier changes
    await table.setModifier(chainModifier);
    console.log(table);

    // render results
    renderTable(document.querySelector('#container'), table);
    renderTable(document.querySelector('#container2'), table.modified);
});


// Render Simple HTML Table

function renderTable(container, table) {
    const html = [];

    html.push('<table>');
    html.push('<thead>');
    html.push('<tr>');
    for (const column of table.getColumnNames()) {
        html.push('<th>', `${column}`, '</th>');
    }
    html.push('</tr>');
    html.push('</thead>');
    html.push('<tbody>');
    for (const row of table.getRows()) {
        html.push('<tr>');
        for (const value of row) {
            if (value instanceof Highcharts.DataTable) {
                const td = document.createElement('td');
                renderTable(td, value);
                html.push('<td>', `${td.innerHTML}`, '</td>');
            } else {
                html.push('<td>', `${value}`, '</td>');
            }
        }
        html.push('</tr>');
    }
    html.push('</tbody>');
    html.push('</table>');

    container.innerHTML = html.join('\n');
}
