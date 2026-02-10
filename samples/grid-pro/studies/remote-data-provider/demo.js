const topPinned = document.getElementById('topPinned');
const bottomPinned = document.getElementById('bottomPinned');

function updatePinnedSummary(grid) {
    const pinned = grid.getPinnedRows();

    if (topPinned) {
        topPinned.textContent = pinned.top.length ?
            pinned.top.join(', ') :
            'None';
    }

    if (bottomPinned) {
        bottomPinned.textContent = pinned.bottom.length ?
            pinned.bottom.join(', ') :
            'None';
    }
}

function getRowId(cell) {
    return cell.row.id ?? cell.row.data.employeeId;
}

function pinToTop(cell) {
    const grid = cell.row.viewport.grid;
    const rowId = getRowId(cell);

    void grid.pinRow(rowId, 'top').then(() => {
        updatePinnedSummary(grid);
    });
}

function pinToBottom(cell) {
    const grid = cell.row.viewport.grid;
    const rowId = getRowId(cell);

    void grid.pinRow(rowId, 'bottom').then(() => {
        updatePinnedSummary(grid);
    });
}

function unpinRow(cell) {
    const grid = cell.row.viewport.grid;
    const rowId = getRowId(cell);

    void grid.unpinRow(rowId).then(() => {
        updatePinnedSummary(grid);
    });
}

const grid = Grid.grid('container', {
    data: {
        providerType: 'remote',
        dataSource: {
            urlTemplate: 'https://demo-data-server.highstage.dev' +
                '/data?format={format}&columnsInclude=employeeId,firstName,' +
                'lastName&page={page}&pageSize={pageSize}&filter={filter}&' +
                'sortBy={sortBy}&sortOrder={sortOrder}',
            rowIdColumn: 'employeeId'
        },
        setValueCallback: async (columnId, rowId, value) => {
            console.log('Setting value:', columnId, rowId, value);
        }
    },
    columnDefaults: {
        filtering: {
            enabled: true
        },
        cells: {
            editMode: {
                enabled: true
            },
            contextMenu: {
                items: [{
                    label: 'Pin row to top',
                    icon: 'addRowAbove',
                    onClick: pinToTop
                }, {
                    label: 'Pin row to bottom',
                    icon: 'addRowBelow',
                    onClick: pinToBottom
                }, {
                    separator: true
                }, {
                    label: 'Unpin row',
                    icon: 'trash',
                    onClick: unpinRow
                }]
            }
        }
    },
    rendering: {
        rows: {
            rowIdColumn: 'employeeId'
        }
    },
    pagination: {
        enabled: false,
        pageSize: 10,
        controls: {
            pageSizeSelector: {
                enabled: true,
                options: [5, 10, 20, 50]
            },
            pageInfo: {
                enabled: true
            },
            firstLastButtons: {
                enabled: true
            },
            previousNextButtons: {
                enabled: true
            },
            pageButtons: {
                enabled: true,
                count: 5
            }
        }
    }
});

updatePinnedSummary(grid);

// Pagination toggle
document.getElementById('pagination-toggle').addEventListener('change', e => {
    const checked = e.target.checked;
    void grid.update({
        pagination: {
            enabled: checked
        }
    }).then(() => {
        updatePinnedSummary(grid);
    });
});
