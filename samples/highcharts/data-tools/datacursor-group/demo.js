const container1 = document.querySelector('#container1');
const container2 = document.querySelector('#container2');
const container3 = document.querySelector('#container3');
// Main table with cursors
const table1 = new Highcharts.DataTable({
    columns: {
        Rank: [1, 2, 3, 4, 5, 6],
        City: ['Sydney', 'Melbourne', 'Brisbane', 'Perth', 'Adelaide', 'Canberra'],
        Population: [5259764, 4976157, 2568927, 2192229, 1402393, 453558]
    }
});
// Resorted tables
const sort2 = new Highcharts.DataModifier.types.Sort({
    direction: 'asc',
    orderByColumn: 'City'
});
const table2 = sort2.modifyTable(table1.clone());
const sort3 = new Highcharts.DataModifier.types.Sort({
    direction: 'asc',
    orderByColumn: 'Population'
});
const table3 = sort3.modifyTable(table1.clone());


// Render HTML Tables

function renderTable(container, table) {
    const columnNames = table.getColumnNames();
    const html = [];

    html.push('<table>');
    // Render column header
    html.push('<thead>');
    html.push('<tr>');
    for (const columnName of columnNames) {
        html.push(`<th>${columnName}</th>`);
    }
    html.push('</tr>');
    html.push('</thead>');
    // Render row body
    html.push('<tbody>');
    for (let j = 0, jEnd = table.getRowCount(), row; j < jEnd; ++j) {
        row = table.getRow(j);
        // We use the values of the "Rank" column to identify each row
        html.push(`<tr data-rank="${row[0]}">`);
        for (let i = 0, iEnd = row.length; i < iEnd; ++i) {
            html.push(
                // We use the column name to identify a cell
                `<td data-column="${columnNames[i]}">`,
                `${row[i]}`,
                '</td>'
            );
        }
        html.push('</tr>');
    }
    html.push('</tbody>');

    html.push('</table>');

    container.innerHTML = html.join('\n');
}

renderTable(container1, table1);
renderTable(container2, table2);
renderTable(container3, table3);


// Synchronize MouseOver

const cursor = new Highcharts.DataCursor();
const tbody1 = container1.querySelector('tbody');
const tbody2 = container2.querySelector('tbody');
const tbody3 = container3.querySelector('tbody');

function synchronizeMouseOver(e) {
    const group = this.group;
    const td = e.target;

    if (td.tagName !== 'TD') {
        return;
    }

    // Both tables are based on the same data
    cursor.emitCursor(table1, group, {
        column: td.dataset.column,
        // We use the values of the "Rank" column to identify the rows
        row: parseInt(td.parentNode.dataset.rank, 10),
        state: 'table.mouseover',
        type: 'position'
    }, e);
}

tbody1.addEventListener('mouseover', synchronizeMouseOver.bind({ group: 'a' }));
tbody2.addEventListener('mouseover', synchronizeMouseOver.bind({ group: 'a' }));
tbody2.addEventListener('mouseover', synchronizeMouseOver.bind({ group: 'b' }));
tbody3.addEventListener('mouseover', synchronizeMouseOver.bind({ group: 'b' }));

function synchronizeCursor(e) {
    const cursor = e.cursor;
    const column = cursor.column; // The cursor column contains the column name
    const rank = `${cursor.row}`; // The cursor row contains the Rank value
    const tbody = this.tbody; // Function is binded to one of the HTML tables

    if (e.group !== this.group) {
        return;
    }

    for (const tr of tbody.querySelectorAll('tr')) {
        // We search for the correct HTML row
        if (tr.dataset.rank === rank) {
            tr.classList.add('highlight');
        } else {
            tr.classList.remove('highlight');
        }
        for (const td of tr.querySelectorAll('td')) {
            // We search for the correct HTML cell
            if (
                tr.dataset.rank === rank &&
                td.dataset.column === column
            ) {
                td.classList.add('highlight');
            } else {
                td.classList.remove('highlight');
            }
        }
    }
}

cursor.addListener(
    table1.id,
    'table.mouseover',
    synchronizeCursor.bind({ group: 'a', tbody: tbody1 })
);
cursor.addListener(
    table1.id,
    'table.mouseover',
    synchronizeCursor.bind({ group: 'a', tbody: tbody2 })
);
cursor.addListener(
    table1.id,
    'table.mouseover',
    synchronizeCursor.bind({ group: 'b', tbody: tbody2 })
);
cursor.addListener(
    table1.id,
    'table.mouseover',
    synchronizeCursor.bind({ group: 'b', tbody: tbody3 })
);
