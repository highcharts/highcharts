const container = document.getElementById('container');
const escapeStringForHTML = Highcharts.A11yHTMLUtilities.escapeStringForHTML;
const table = new Highcharts.DataTable();


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

    container.innerHTML = html.join('\n');
}


// Add Column

const addColumnButton = document.getElementById('add-column-button');
const addColumnInput = document.getElementById('add-column-input');

function addColumn() {
    // Set column name; second parameter can be an array of cell values.
    table.setColumn(addColumnInput.value);
    // Render changed table.
    renderTable(container, table);
    // Reset input field
    addColumnInput.value = '';
}

addColumnButton.addEventListener('click', addColumn);
addColumnInput.addEventListener('change', addColumn);


// Add Row

const addRowButton = document.getElementById('add-row-button');
const addRowInput = document.getElementById('add-row-input');

function addRow() {
    // Set row values from input string splitted by `,` and `;`.
    table.setRow(addRowInput.value.split(/[,;]/g));
    // Render changed table.
    renderTable(container, table);
    // Reset input field
    addRowInput.value = '';
}

addRowButton.addEventListener('click', addRow);
addRowInput.addEventListener('change', addRow);
