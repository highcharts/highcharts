const data = {
    firstName: [
        'Liam', 'Emma', 'Noah', 'Olivia', 'Elijah',
        'Ava', 'Lucas', 'Sophia', 'Mason', 'Isabella'
    ],
    lastName: [
        'Smith', 'Johnson', 'Williams', 'Brown', 'Jones',
        'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'
    ],
    email: [
        'liam.smith@example.com', 'emma.johnson@example.com',
        'noah.williams@example.com', 'olivia.brown@example.com',
        'elijah.jones@example.com', 'ava.garcia@example.com',
        'lucas.miller@example.com', 'sophia.davis@example.com',
        'mason.rodriguez@example.com', 'isabella.martinez@example.com'
    ],
    mobile: [
        '213-555-0123', '312-555-0456', '713-555-0789', '602-555-1011',
        '415-555-1213', '305-555-1415', '206-555-1617', '512-555-1819',
        '720-555-2021', '614-555-2223'
    ],
    street: [
        'Veldstraat 10', 'Česká 5', 'Coolsingel 8', 'Yliopistonkatu 2',
        'Gran Vía 28', 'Kärntner Str. 12', 'Bahnhofstrasse 1',
        'Strøget 14', 'Nowy Świat 22', 'Via del Corso 3'
    ],
    city: [
        'Ghent', 'Brno', 'Rotterdam', 'Turku', 'Madrid',
        'Vienna', 'Zurich', 'Copenhagen', 'Warsaw', 'Rome'
    ],
    state: ['BE', 'CZ', 'NL', 'FI', 'ES', 'AT', 'CH', 'DK', 'PL', 'IT'],
    zip: [
        '9000', '602 00', '3011', '20100', '28013',
        '1010', '8001', '1160', '00-692', '00186'
    ]
};

Grid.grid('container', {
    caption: { text: 'Desktop: full data set' },
    data: { columns: data },
    columns: [{
        id: 'firstName',
        header: { format: 'First Name' }
    }, {
        id: 'lastName',
        header: { format: 'Last Name' }
    }, {
        id: 'email',
        header: { format: 'E-mail' }
    }, {
        id: 'mobile',
        header: { format: 'Mobile' }
    }, {
        id: 'street',
        header: { format: 'Street' }
    }, {
        id: 'city',
        header: { format: 'City' }
    }, {
        id: 'state',
        header: { format: 'State' }
    }, {
        id: 'zip',
        header: { format: 'ZIP' }
    }],
    responsive: {
        rules: [{
            condition: {
                maxWidth: 800
            },
            gridOptions: {
                caption: { text: 'Tablet: fewer columns' },
                header: ['firstName', 'email', 'mobile', 'street'],
                columns: [{
                    id: 'firstName',
                    header: { format: 'Name' },
                    cells: { format: '{value} {row.data.lastName}' }
                }, {
                    id: 'street',
                    header: { format: 'Address' },
                    cells: {
                        format:
                            '{value}<br/>{row.data.city}, ' +
                            '{row.data.state} {row.data.zip}'
                    }
                }]
            }
        }, {
            condition: {
                maxWidth: 500
            },
            gridOptions: {
                caption: { text: 'Mobile: compact view' },
                header: ['firstName', 'mobile', 'street'],
                rendering: {
                    theme: 'hcg-theme-default theme-mobile'
                },
                columns: [{
                    id: 'firstName',
                    cells: {
                        format:
                            '<a href="mailto:{row.data.email}">' +
                            '{value} {row.data.lastName}</a>'
                    }
                }]
            }
        }]
    }
});
