const columns = {
    product: ['Apples', 'Pears', 'Plums', 'Bananas'],
    weight: [100, 40, 0.5, 200],
    price: [1.5, 2.53, 5, 4.5]
};

const columnIds = ['product', 'weight', 'price'];
const tableTitle = 'Fruit inventory parity table';
const tableDescription =
    'A side-by-side comparison of native table and Grid announcements.';
const headerLabels = {
    product: 'Product',
    weight: 'Weight',
    price: 'Price'
};

function renderNativeParityTable() {
    const table = document.getElementById('native-table');

    const caption = document.createElement('caption');
    caption.textContent = tableTitle;
    table.appendChild(caption);

    const thead = table.createTHead();
    const headerRow = thead.insertRow();

    columnIds.forEach((columnId, columnIndex) => {
        const headerCell = document.createElement('th');
        headerCell.id = `native-col-${columnId}`;
        headerCell.scope = 'col';
        headerCell.textContent = headerLabels[columnId];
        headerCell.dataset.row = '0';
        headerCell.dataset.col = String(columnIndex);
        headerCell.dataset.columnId = columnId;
        headerCell.tabIndex = -1;
        headerRow.appendChild(headerCell);
    });

    const tbody = table.createTBody();
    const rowCount = columns.product.length;

    for (let rowIndex = 0; rowIndex < rowCount; ++rowIndex) {
        const row = tbody.insertRow();
        row.dataset.rowIndex = String(rowIndex);

        columnIds.forEach((columnId, columnIndex) => {
            const isRowHeader = columnIndex === 0;
            const cell = document.createElement(isRowHeader ? 'th' : 'td');
            const value = columns[columnId][rowIndex];

            cell.textContent = String(value);
            cell.dataset.row = String(rowIndex + 1);
            cell.dataset.col = String(columnIndex);
            cell.dataset.columnId = columnId;
            cell.tabIndex = -1;

            if (isRowHeader) {
                cell.id = `native-row-${rowIndex}`;
                cell.scope = 'row';
            } else {
                cell.setAttribute(
                    'headers',
                    `native-row-${rowIndex} native-col-${columnId}`
                );
            }

            row.appendChild(cell);
        });
    }

    makeTableNavigable(table);
}

function getNativeMatrix(table) {
    return [
        Array.from(table.tHead.rows[0].cells),
        ...Array.from(table.tBodies[0].rows).map(row => Array.from(row.cells))
    ];
}

function updateNativeFocusTarget(table, target) {
    getNativeMatrix(table)
        .flat()
        .forEach(cell => {
            cell.tabIndex = cell === target ? 0 : -1;
        });
}

function makeTableNavigable(table) {
    const matrix = () => getNativeMatrix(table);
    const firstHeaderCell = matrix()[0][0];

    updateNativeFocusTarget(table, firstHeaderCell);

    table.addEventListener('focusin', event => {
        const target = event.target.closest('th, td');

        if (!target || !table.contains(target)) {
            return;
        }

        updateNativeFocusTarget(table, target);
    });

    table.addEventListener('keydown', event => {
        const target = event.target.closest('th, td');

        if (!target || !table.contains(target)) {
            return;
        }

        const rowIndex = Number(target.dataset.row);
        const columnIndex = Number(target.dataset.col);
        const nextPosition = {
            row: rowIndex,
            col: columnIndex
        };

        switch (event.key) {
        case 'ArrowDown':
            nextPosition.row += 1;
            break;
        case 'ArrowUp':
            nextPosition.row -= 1;
            break;
        case 'ArrowRight':
            nextPosition.col += 1;
            break;
        case 'ArrowLeft':
            nextPosition.col -= 1;
            break;
        default:
            return;
        }

        const cells = matrix();
        const nextCell = cells[nextPosition.row]?.[nextPosition.col];

        if (!nextCell) {
            return;
        }

        event.preventDefault();
        updateNativeFocusTarget(table, nextCell);
        nextCell.focus();
    });
}

window.parityData = {
    columns,
    columnIds,
    headerLabels,
    tableTitle,
    tableDescription
};

renderNativeParityTable();

window.grid = Grid.grid('grid-container', {
    id: 'parity-grid',
    caption: {
        text: tableTitle
    },
    description: {
        text: tableDescription
    },
    dataTable: {
        columns
    },
    columns: columnIds.map(columnId => ({
        id: columnId,
        header: {
            format: headerLabels[columnId]
        }
    }))
});
