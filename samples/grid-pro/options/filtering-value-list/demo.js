Grid.grid('container', {
    data: {
        columns: {
            country: [
                'Poland', 'Norway', 'Poland', 'Germany', null,
                'Norway', 'Germany', 'Poland', 'Norway', 'Germany'
            ],
            city: [
                'Kraków', 'Oslo', 'Warsaw', 'Berlin', 'Bergen',
                'Bergen', 'Hamburg', 'Warsaw', 'Oslo', 'Berlin'
            ],
            status: [
                'Delivered', 'Pending', 'Delivered', 'Cancelled', 'Pending',
                'Delivered', 'Pending', 'Delivered', 'Cancelled', 'Delivered'
            ],
            orders: [12, 4, 31, 8, 17, 23, 5, 44, 9, 15]
        }
    },
    columnDefaults: {
        filtering: {
            enabled: true
        }
    },
    columns: [{
        id: 'country',
        filtering: {
            operators: ['oneOf']
        }
    }, {
        id: 'city',
        filtering: {
            operators: ['oneOf']
        }
    }, {
        id: 'status',
        filtering: {
            // The listed values are fixed, so they stay complete even when
            // the loaded data holds only some of them.
            operators: ['oneOf'],
            values: ['Delivered', 'Pending', 'Cancelled', 'Returned']
        }
    }]
});
