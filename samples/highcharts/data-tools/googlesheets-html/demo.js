const GoogleSheetsConnector = Highcharts.DataConnector.types.GoogleSheets;
const container = document.querySelector('#container');
const keyInput = document.querySelector('#key-input');
const sheetsInput = document.querySelector('#sheets-input');
const escapeStringForHTML = Highcharts.A11yHTMLUtilities.escapeStringForHTML;


// Load Table From Google Sheets API

document.querySelector('#load-button').addEventListener('click', () => {
    const connector = new GoogleSheetsConnector({
        googleAPIKey: keyInput.value,
        googleSpreadsheetKey: sheetsInput.value.replace(/^https?:\/\/.+\/d\/|\/edit.*$/g, '')
    });

    connector
        .load()
        .then(connector => renderTable(container, connector.table))
        .catch(alert);
});


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
