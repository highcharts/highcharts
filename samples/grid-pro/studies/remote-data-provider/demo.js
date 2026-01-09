const dataUrl = 'https://dataset-server-hc-production.up.railway.app/data';

const grid = Grid.grid('container', {
    data: {
        providerType: 'remote',
        chunkSize: 50,
        fetchCallback: async (query, offset, limit) => {
            console.log(`fetching (offset: ${offset}, limit: ${limit})`);

            // Using RemoteFetchHelper for standardized API requests
            return Grid.RemoteFetchHelper.fetch({
                baseUrl: dataUrl,
                query,
                offset,
                limit,
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
            });
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
        enabled: true,
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

    grid.container.style.minHeight = checked ? '' : '600px';
});
