const status = document.getElementById('status');

function sortColumn(cell, context, order) {
    void context.grid.update({
        columns: [{
            id: cell.column.id,
            sorting: { order: order }
        }]
    });

    status.textContent = order ?
        'Sorted ' + cell.column.id + ' ' + order + 'ending.' :
        'Cleared the sorting of ' + cell.column.id + '.';
}

Grid.grid('container', {
    data: {
        columns: {
            Product: ['Apples', 'Pears', 'Plums', 'Bananas', 'Oranges'],
            Weight: [100, 40, 0.5, 200, 120],
            Price: [1.5, 2.53, 5, 4.5, 3.2]
        }
    },
    columnDefaults: {
        cells: {
            contextMenu: {
                items: [{
                    label: 'Copy value',
                    icon: 'clipboard',
                    onClick: function (cell) {
                        navigator.clipboard
                            .writeText(String(cell.value))
                            .then(function () {
                                status.textContent =
                                    'Copied "' + cell.value + '".';
                            })
                            .catch(function () {
                                status.textContent =
                                    'The clipboard is not available here.';
                            });
                    }
                }, {
                    separator: true
                }, {
                    label: 'Sort column',
                    icon: 'arrowUpDown',
                    items: [{
                        label: 'Ascending',
                        icon: 'arrowUp',
                        onClick: function (cell, context) {
                            sortColumn(cell, context, 'asc');
                        }
                    }, {
                        label: 'Descending',
                        icon: 'arrowDown',
                        onClick: function (cell, context) {
                            sortColumn(cell, context, 'desc');
                        }
                    }, {
                        label: 'Clear',
                        onClick: function (cell, context) {
                            sortColumn(cell, context, null);
                        }
                    }]
                }]
            }
        }
    }
});
