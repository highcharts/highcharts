const myGrid = Grid.grid('container', {
    data: {
        columns: {
            ID: [1, 2, 3],
            Name: ['Alice', 'Bob', 'Charlie'],
            Trend: ['1,2,3', '3,2,1', '2,2,2']
        }
    },
    columnDefaults: {
        cells: {
            editMode: {
                enabled: true
            }
        }
    },
    columns: [
        {
            id: 'Trend',
            cells: {
                renderer: {
                    type: 'sparkline'
                }
            }
        }
    ]
});

function getNextId() {
    const ids = myGrid.dataTable.getColumn('ID');
    const nextId = Math.max(...ids) + 1;
    return nextId;
}

function addRow() {
    const nextId = getNextId();
    myGrid.dataTable.setRow({ ID: nextId });
    myGrid.viewport.updateRows();
}

document
    .getElementById('addRow')
    ?.addEventListener('click', addRow);
