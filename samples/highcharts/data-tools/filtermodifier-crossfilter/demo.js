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
                    columnName: 'City',
                    operator: '>=',
                    value: 'Aa'
                }, {
                    columnName: 'City',
                    operator: '<=',
                    value: 'Zz'
                }, {
                    columnName: 'Elevation',
                    operator: '>=',
                    value: 1
                }, {
                    columnName: 'Elevation',
                    operator: '<=',
                    value: 3490
                }, {
                    columnName: 'Longitude',
                    operator: '>=',
                    value: -180
                }, {
                    columnName: 'Longitude',
                    operator: '<=',
                    value: +180
                }]
            }
        }
    });

    await csv.load();

    renderTable(container, csv.table.modified);

    form.querySelectorAll('input').forEach(input => {
        input.onchange = () => updateRange(csv.table, input);
    });

    console.log(csv.table);

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

    renderTable(container, table.modified);
}

// Render Simple HTML Table

function renderTable(container, table) {
    const html = [];

    html.push('<table>');
    html.push('<thead>');
    html.push('<tr>');
    for (const column of table.getColumnNames()) {
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
