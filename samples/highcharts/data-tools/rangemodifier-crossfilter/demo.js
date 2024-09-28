const CSVConnector = Highcharts.DataConnector.types.CSV;
const escapeStringForHTML = Highcharts.A11yHTMLUtilities.escapeStringForHTML;

const container = document.getElementById('container');
const form = document.getElementById('filter');

(async () => {
    const csv = new CSVConnector({
        csv: document.querySelector('noscript').innerText,
        dataModifier: {
            type: 'Range',
            ranges: [{
                column: 'City',
                minValue: 'Aa',
                maxValue: 'Zz'
            }, {
                column: 'Elevation',
                minValue: 1,
                maxValue: 3490
            }, {
                column: 'Longitude',
                minValue: -180,
                maxValue: +180
            }]
        }
    });

    await csv.load();

    renderTable(container, csv.table.modified);

    form.querySelectorAll('input').forEach(input => {
        input.onchange = () => updateRange(csv.table, input.parentElement);
    });

    console.log(csv.table);

})();

// Updates Range

async function updateRange(table, fieldset) {
    const inputs = fieldset.querySelectorAll('input');
    const legend = fieldset.querySelector('legend').innerText;
    const modifier = table.getModifier();
    const range = [
        'City Filter',
        'Elevation Filter',
        'Longitude Filter'
    ].indexOf(legend);

    let min = inputs[0].value;
    let max = inputs[1].value;

    if (range > 0) {
        min = parseInt(min, 10);
        max = parseInt(max, 10);
    }

    modifier.options.ranges[range].maxValue = max;
    modifier.options.ranges[range].minValue = min;

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
