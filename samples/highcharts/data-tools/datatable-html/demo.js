const container = document.querySelector('#container');
const escapeStringForHTML = Highcharts.A11yHTMLUtilities.escapeStringForHTML;
const table = new Highcharts.DataTable({ y: [7, 42] });

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
renderTable(container, table);


// Add Column

const addColumnButton = document.querySelector('#add-column-button');
const addColumnInput = document.querySelector('#add-column-input');

function addColumn() {
    // Set column name; second parameter can be an array of cell values.
    table.setColumn(addColumnInput.value);
    // Render changed table.
    renderTable(container, table.modified);
    // Reset input field
    addColumnInput.value = '';
}

addColumnButton.addEventListener('click', addColumn);


// Add Row

const addRowButton = document.querySelector('#add-row-button');
const addRowInput = document.querySelector('#add-row-input');

function addRow() {
    // Set row values from input string splitted by `,` and `;`.
    table.setRow(
        addRowInput.value
            .split(/[,;]/g)
            // check for numbers in cell string and convert them
            .map(cell => (/^[.\d\s]+$/.test(cell) ? parseFloat(cell) : cell))
    );
    // Render changed table.
    renderTable(container, table.modified);
    // Reset input field
    addRowInput.value = '';
}

addRowButton.addEventListener('click', addRow);


// Modifiers

const setModifierSelect = document.querySelector('#set-modifier');

const DataModifierTypes = Highcharts.DataModifier.types;

async function setModifier() {
    const type = setModifierSelect.value;

    if (type !== 'off') {
        await table.setModifier(new DataModifierTypes[type]({}));
    } else {
        await table.setModifier();
    }

    // without modifier table.modified = table
    renderTable(container, table.modified);
}

setModifierSelect.addEventListener('change', setModifier);
