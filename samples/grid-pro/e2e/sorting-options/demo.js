const columnSelectEl = document.getElementById('select-column');
const orderSelectEl = document.getElementById('select-order');
const applyBtnEl = document.getElementById('apply-btn');

Grid.grid('container', {
    dataTable: {
        columns: {
            product: ['Apples', 'Pears', 'Plums', 'Bananas'],
            weight: [100, 40, 0.5, 200],
            price: [1.5, 2.53, 5, 4.5],
            metaData: ['a', 'b', 'c', 'd'],
            icon: ['Apples URL', 'Pears URL', 'Plums URL', 'Bananas URL']
        }
    },
    columnDefaults: {
        cells: {
            editMode: {
                enabled: true
            }
        }
    },
    columns: [{
        id: 'icon',
        sorting: {
            enabled: false
        }
    }, {
        id: 'price',
        sorting: {
            order: 'asc'
        }
    }],
    events: {
        column: {
            afterSort: function () {
                const { sorting } = this.viewport.grid.querying;

                columnSelectEl.value = this.id;
                orderSelectEl.value = sorting.currentSorting.order || '';
            }
        }
    }
}, true).then(grid => {
    window.grid = grid;

    const currentSorting = grid.querying.sorting.currentSorting;

    grid.enabledColumns.forEach(columnId => {
        let selected = '';

        if (currentSorting.columnId === columnId) {
            selected = 'selected';
        }

        columnSelectEl.innerHTML += `
            <option value="${columnId}" ${selected}>${columnId}</option>
        `;
    });

    if (currentSorting.order) {
        orderSelectEl.value = currentSorting.order;
    }

    applyBtnEl.addEventListener('click', () => {
        grid.viewport.getColumn(columnSelectEl.value).sorting.setOrder(
            orderSelectEl.value
        );
    });
});
