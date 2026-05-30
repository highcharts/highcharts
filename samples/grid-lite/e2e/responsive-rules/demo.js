const data = {
    firstName: ['Liam', 'Emma', 'Noah', 'Olivia'],
    lastName: ['Smith', 'Johnson', 'Williams', 'Brown'],
    email: [
        'liam.smith@example.com', 'emma.johnson@example.com',
        'noah.williams@example.com', 'olivia.brown@example.com'
    ],
    mobile: ['213-555-0123', '312-555-0456', '713-555-0789', '602-555-1011'],
    street: ['Veldstraat 10', 'Česká 5', 'Coolsingel 8', 'Yliopistonkatu 2'],
    city: ['Ghent', 'Brno', 'Rotterdam', 'Turku'],
    state: ['BE', 'CZ', 'NL', 'FI'],
    zip: ['15245', '15232', '30123', '20100']
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
