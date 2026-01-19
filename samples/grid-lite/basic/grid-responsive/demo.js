const data = {
    firstName: [
        'Liam', 'Emma', 'Noah', 'Olivia', 'Elijah', 'Ava', 'James',
        'Sophia', 'William', 'Isabella'
    ],
    lastName: [
        'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia',
        'Miller', 'Davis', 'Rodriguez', 'Martinez'
    ],
    email: [
        'liam.smith@example.com', 'emma.johnson@example.com',
        'noah.williams@example.com', 'olivia.brown@example.com',
        'elijah.jones@example.com', 'ava.garcia@example.com',
        'james.miller@example.com', 'sophia.davis@example.com',
        'william.rodriguez@example.com', 'isabella.martinez@example.com'
    ],
    mobile: [
        '213-555-0123', '312-555-0456', '713-555-0789', '602-555-1011',
        '858-555-1213', '949-555-1415', '718-555-1617', '305-555-1819',
        '408-555-2021', '303-555-2223'
    ],
    street: [
        '123 Main St', '456 Oak Ave', '789 Pine Rd', '321 Maple Dr',
        '654 Cedar Ln', '987 Elm St', '159 Washington Blvd',
        '753 Sunset Blvd', '852 Hilltop Rd', '951 2nd St'
    ],
    city: [
        'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'San Diego',
        'Irvine', 'Brooklyn', 'Miami', 'San Jose', 'Denver'
    ],
    state: ['CA', 'IL', 'TX', 'AZ', 'CA', 'CA', 'NY', 'FL', 'CA', 'CO'],
    zip: [
        '90001', '60601', '77001', '85001', '92101',
        '92602', '11201', '33101', '95101', '80201'
    ]
};

Grid.grid('container', {
    caption: { text: 'Desktop: full data set' },
    dataTable: { columns: data },
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
