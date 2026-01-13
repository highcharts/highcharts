const grid = Grid.grid('container', {
    data: {
        providerType: 'remote',
        chunkSize: 50,
        serverApi: {
            baseUrl: 'https://dataset-server-hc-production.up.railway.app/data',
            columns: [
                'employeeId',
                'firstName',
                'lastName',
                'department',
                'role',
                'city',
                'country',
                'nationality',
                'employmentType',
                'projectsAssigned',
                'remote'
            ]
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
