const grid = Grid.grid('container', {
    data: {
        providerType: 'remote',
        dataSource: {
            urlTemplate: 'https://dataset-server-hc-production.up.railway.app' +
                '/data?format={format}&columnsInclude={columns}&page={page}' +
                '&pageSize={pageSize}',
            templateVariables: {
                columns: 'employeeId,firstName,lastName'
            }
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
