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
            }
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

// Pagination toggle
document.getElementById('pagination-toggle').addEventListener('change', e => {
    const checked = e.target.checked;
    grid.update({
        pagination: {
            enabled: checked
        }
    });
});
