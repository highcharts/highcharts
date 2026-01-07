const CSVConnector = Highcharts.DataConnector.types.CSV;
const escapeStringForHTML = Highcharts.A11yHTMLUtilities.escapeStringForHTML;

const container = document.getElementById('container');
const form = document.getElementById('filter');

(async () => {
    const csv = new CSVConnector({
        csv: document.querySelector('noscript').innerText,
        dataModifier: {
            type: 'Filter',
            condition: {
                operator: 'and',
                conditions: [{
                    columnId: 'City',
                    operator: '>=',
                    value: 'Aa'
                }, {
                    columnId: 'City',
                    operator: '<=',
                    value: 'Zz'
                }, {
                    columnId: 'Elevation',
                    operator: '>=',
                    value: 1
                }, {
                    columnId: 'Elevation',
                    operator: '<=',
                    value: 3490
                }, {
                    columnId: 'Longitude',
                    operator: '>=',
                    value: -180
                }, {
                    columnId: 'Longitude',
                    operator: '<=',
                    value: +180
                }]
            }
        }
    });

    await csv.load();
    const table = csv.getTable();

    renderTable(container, table.getModified());

    form.querySelectorAll('input').forEach(input => {
        input.onchange = () => updateRange(csv.table, input);
    });

})();

// Updates Range

async function updateRange(table, input) {
    const modifier = table.getModifier();
    const inputIndex = [
        'filter-city-min',
        'filter-city-max',
        'filter-elevation-min',
        'filter-elevation-max',
        'filter-lon-min',
        'filter-lon-max'
    ].indexOf(input.id);

    const v = input.value;
    modifier.options.condition.conditions[inputIndex].value = isNaN(v) ? v : +v;

    await table.setModifier(modifier);

    renderTable(container, table.getModified());
}

// Render Simple HTML Table

function renderTable(container, table) {
    const html = [];

    html.push('<table>');
    html.push('<thead>');
    html.push('<tr>');
    for (const column of table.getColumnIds()) {
        html.push('<th>', escapeStringForHTML(column), '</th>');
    }
    html.push('</tr>');
    html.push('</thead>');
    html.push('<tbody>');
    for (const row of table.getRows()) {
        html.push('<tr>');
        for (const value of row) {
            html.push('<td>', escapeStringForHTML('' + value), '</td>');
        }
        html.push('</tr>');
    }
    html.push('</tbody>');
    html.push('</table>');

    container.innerHTML = html.join('');
}
