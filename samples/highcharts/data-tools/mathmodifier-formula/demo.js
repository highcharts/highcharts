const container1 = document.querySelector('#container');
const container2 = document.querySelector('#container2');
const cursor = new Highcharts.DataCursor();
const escapeStringForHTML = Highcharts.A11yHTMLUtilities.escapeStringForHTML;
const MathModifier = Highcharts.DataModifier.types.Math;
const table = new Highcharts.DataTable({
    columns: {
        'Day of Week': [1, 2, 3, 4, 5, 6, 7, 'Average:'],
        'Sold meals': [10, 20, 30, 40, 50, 60, '-', '=AVERAGE(B1:B6)'],
        'Disposed meals': [1, 2, 4, 8, 16, 32, '-', '=AVERAGE(C1:C6)'],
        'Total meals': [
            '=SUM(B1:C1)', '=SUM(B2:C2)', '=SUM(B3:C3)', '=SUM(B4:C4)',
            '=SUM(B5:C5)', '=SUM(B6:C6)', '-',
            '=SUM(B8:C8)'
        ]
    }
});


// Setup & Render Table

table.setModifier(new MathModifier());

renderTable(container1, table, true);
renderTable(container2, table.modified);


// Add Change Listener

function onChange(e) {
    if (e.key === 'Enter') {
        const td = e.target;
        const column = Array
            .from(td.parentNode.childNodes)
            .indexOf(td);
        const row = Array
            .from(td.parentNode.parentNode.childNodes)
            .indexOf(td.parentNode);
        const value = parseFloat(td.innerText);

        e.preventDefault();
        td.blur();

        table.setCell(
            table.getColumnNames()[column],
            row,
            (isNaN(value) ? td.innerText : value)
        );

        renderTable(container2, table.modified);

        cursor.emitCursor(table, {
            column: Array
                .from(td.parentNode.childNodes)
                .indexOf(td),
            row: Array
                .from(td.parentNode.parentNode.childNodes)
                .indexOf(td.parentNode),
            state: 'table.mouseover',
            type: 'position'
        }, e);
    }
}

container1.querySelector('tbody').addEventListener('keydown', onChange);


// Synchronize MouseOver

function synchronizeMouseOver(e) {
    const td = e.target;

    if (td.tagName !== 'TD') {
        return;
    }

    cursor.emitCursor(table, {
        column: Array
            .from(td.parentNode.childNodes)
            .indexOf(td),
        row: Array
            .from(td.parentNode.parentNode.childNodes)
            .indexOf(td.parentNode),
        state: 'table.mouseover',
        type: 'position'
    }, e);
}

container1.addEventListener('mouseover', synchronizeMouseOver);
container2.addEventListener('mouseover', synchronizeMouseOver);

function synchronizeCursor(e) {
    const cursor = e.cursor;

    synchronizeHighlight(container1, cursor);
    synchronizeHighlight(container2, cursor);
}

cursor.addListener(table.id, 'table.mouseover', synchronizeCursor);

function synchronizeHighlight(container, cursor) {
    const tbody = container.querySelector('tbody');
    const trs = tbody.querySelectorAll('tr');
    const trHighlight = trs[cursor.row];
    const tdHighlight = trHighlight.querySelectorAll('td')[cursor.column];

    for (const tr of trs) {
        // We search for the correct HTML row
        tr.classList.toggle('highlight', tr === trHighlight);
        for (const td of tr.querySelectorAll('td')) {
            // We search for the correct HTML cell
            td.classList.toggle('highlight', td === tdHighlight);
        }
    }
}


// Render Simple HTML Table

function renderTable(container, table, editable) {
    const html = [];

    html.push('<table>');
    html.push('<thead>');
    html.push('<tr>');
    for (const column of table.getColumnNames()) {
        html.push(
            editable ? '<th contenteditable>' : '<th>',
            escapeStringForHTML(column),
            '</th>'
        );
    }
    html.push('</tr>');
    html.push('</thead>');
    html.push('<tbody>');
    for (const row of table.getRows()) {
        html.push('<tr>');
        for (const value of row) {
            html.push(
                editable ? '<td contenteditable>' : '<td>',
                (
                    typeof value === 'undefined' ?
                        '' :
                        escapeStringForHTML('' + value)
                ),
                '</td>'
            );
        }
        html.push('</tr>');
    }
    html.push('</tbody>');
    html.push('</table>');

    container.innerHTML = html.join('');
}
