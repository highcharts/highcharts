const dataUrl = 'https://dataset-server-hc-production.up.railway.app/data';

Grid.grid('container', {
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
        }
    }
    // pagination: {
    //     enabled: true,
    //     pageSize: 22,
    //     totalItems: 100,
    //     controls: {
    //         pageSizeSelector: { // boolean
    //             enabled: true,
    //             options: [10, 20, 50, 100]
    //         },
    //         pageInfo: {  // boolean
    //             enabled: true
    //         },
    //         firstLastButtons: {  // boolean
    //             enabled: true
    //         },
    //         previousNextButtons: {  // boolean
    //             enabled: true
    //         },
    //         pageButtons: {  // boolean
    //             enabled: true,
    //             count: 5
    //         }
    //     }
    // }
});
