Grid.grid('container', {
    dataTable: {
        columns: {
            productName: [
                'Phone',
                'Bread',
                'Shirt',
                'Laptop',
                'Milk',
                'Jeans',
                'Tablet'
            ],
            sku: [
                'ELE-001',
                'FOO-123',
                'CLO-456',
                'ELE-002',
                'FOO-456',
                'CLO-789',
                'ELE-003'
            ],
            category: [
                'Electronics',
                'Food',
                'Clothing',
                'Electronics',
                'Food',
                'Clothing',
                'Electronics'
            ],
            price: [699.99, 10.5, 29.99, 1199.99, 12, 49.99, 500],
            discount: [20, 5, 40, 25, 10, 15, 30]
        }
    },
    columnDefaults: {
        cells: {
            editMode: {
                enabled: true
            }
        }
    },
    columns: [{
        id: 'productName',
        dataType: 'string',
        cells: {
            editMode: {
                validationRules: [
                    'notEmpty',
                    {
                        validate: function ({ value }) {
                            return /^[a-zA-Z0-9\s]+$/.test(value);
                        },
                        notification: 'No special characters allowed.'
                    }
                ]
            }
        },
        header: {
            format: 'Product name'
        }
    }, {
        id: 'sku',
        dataType: 'string',
        cells: {
            editMode: {
                validationRules: [{
                    validate: 'unique',
                    notification: 'SKU must be unique.'
                }, {
                    validate: ({ rawValue }) =>
                        /^[A-Z]{3}-\d{3}$/.test(rawValue),
                    notification: 'SKU must be in the format AAA-123.'
                }]
            }
        },
        header: {
            format: 'SKU code'
        }
    }, {
        id: 'category',
        dataType: 'string',
        cells: {
            editMode: {
                renderer: {
                    type: 'select',
                    options: [
                        { value: 'Food', label: 'Food' },
                        { value: 'Electronics', label: 'Electronics' },
                        { value: 'Clothing', label: 'Clothing' }
                    ]
                },
                validationRules: [{
                    validate: function ({ value }) {
                        const discount = this.row.data.discount;

                        if (value === 'Electronics' && discount >= 30) {
                            return false;
                        }

                        return true;
                    },
                    // eslint-disable-next-line max-len
                    notification: 'Discount for Electronics must be a number between 1% and 30%, change the discount first.'
                }]
            }
        },
        header: {
            format: 'Category'
        }
    }, {
        id: 'price',
        dataType: 'number',
        cells: {
            format: '{value:,.2f}',
            editMode: {
                validationRules: [{
                    validate: function ({ value }) {
                        return value >= 10;
                    },
                    notification: 'Price must be 10 or more.'
                }]
            }
        },
        header: {
            format: 'Price (€)'
        }
    }, {
        id: 'discount',
        dataType: 'number',
        cells: {
            editMode: {
                validationRules: [{
                    validate: function ({ value }) {
                        const category = this.row.data.category;

                        if (category === 'Electronics') {
                            return value >= 1 && value <= 30;
                        }

                        return true;
                    },
                    // eslint-disable-next-line max-len
                    notification: 'Discount for Electronics must be a number between 1% and 30%.'
                }, {
                    validate: function ({ value }) {
                        const category = this.row.data.category;

                        if (category !== 'Electronics') {
                            return value >= 1 && value <= 60;
                        }

                        return true;
                    },
                    // eslint-disable-next-line max-len
                    notification: 'Discount must be a number between 1% and 60% for non-electronics.'
                }]
            }
        },
        header: {
            format: 'Discount (%)'
        }
    }]
});
