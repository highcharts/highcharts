function createColumns(rowCount) {
    return {
        id: Array.from({ length: rowCount }, (_, i) => i + 1),
        product: Array.from({ length: rowCount }, (_, i) => `Product ${i + 1}`),
        category: Array.from(
            { length: rowCount },
            (_, i) => ['Fruit', 'Vegetable', 'Snack'][i % 3]
        ),
        stock: Array.from({ length: rowCount }, (_, i) => 10 + (i % 90))
    };
}

const sharedColumns = createColumns(400);

function createGrid(renderTo, virtualization) {
    return Grid.grid(renderTo, {
        data: {
            columns: sharedColumns
        },
        rendering: {
            rows: {
                virtualization
            }
        },
        columns: [{
            id: 'id',
            width: 70
        }, {
            id: 'product'
        }, {
            id: 'category'
        }, {
            id: 'stock',
            width: 90
        }]
    });
}

function countRenderedRows(containerId) {
    const tbody = document.querySelector('#' + containerId + ' tbody');
    return tbody ? tbody.querySelectorAll('tr').length : 0;
}

function updateCount(labelId, containerId) {
    document.getElementById(labelId).textContent =
        String(countRenderedRows(containerId));
}

const virtualizedGrid = createGrid('virtualized-container', true);
const regularGrid = createGrid('regular-container', false);

function refreshCounts() {
    updateCount('virtualized-count', 'virtualized-container');
    updateCount('regular-count', 'regular-container');
}

requestAnimationFrame(() => {
    refreshCounts();

    [virtualizedGrid.container, regularGrid.container].forEach(container => {
        container?.addEventListener('scroll', refreshCounts, true);
    });
});
