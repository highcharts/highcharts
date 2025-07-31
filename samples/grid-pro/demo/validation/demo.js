function initGrid(dataSource) {
    Grid.grid('container', {
        dataTable: dataSource,
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
                    validationRules: [{
                        validate: function ({ rawValue }) {
                            return /^[a-zA-Z0-9\s]+$/.test(rawValue);
                        },
                        notification: 'No special characters allowed.'
                    }]
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
                        validate: function ({ rawValue }) {
                            return /^[A-Z]{3}-\d{3}$/.test(rawValue);
                        },
                        notification: 'SKU must be in format AAA-123.'
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
                    }
                }
            },
            header: {
                format: 'Category'
            }
        }, {
            id: 'price',
            dataType: 'number',
            cells: {
                editMode: {
                    validationRules: [{
                        validate: function ({ rawValue }) {
                            return rawValue >= 0;
                        },
                        notification: 'Price must be zero or more.'
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
                className: '{#if (gt value 30)}greater-than-30{/if}',
                editMode: {
                    validationRules: [{
                        validate: function ({ rawValue }) {
                            const num = Number(rawValue);

                            if (isNaN(num)) {
                                return false;
                            }

                            const category = this.row.data.category;
                            if (category === 'Electronics') {
                                return num >= 0 && num <= 30;
                            }
                            return num >= 0 && num <= 100;
                        },
                        // eslint-disable-next-line max-len
                        notification: 'Discount for Electronics must be a number between 0% and 30%, otherwise between 0% and 100%.'
                    }
                    ]
                }
            },
            header: {
                format: 'Discount (%)'
            }
        }, {
            id: 'finalPrice',
            dataType: 'number',
            cells: {
                format: '{value:.2f}',
                editMode: {
                    enabled: false
                }
            },
            header: {
                format: 'Final price (€)'
            }
        }]
    });
}


// Init
(async () => {
    // Setup data.
    const dataTable = new Dashboards.DataTable({
        columns: {
            productName: [
                'Phone',
                'Bread',
                'T-Shirt',
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
            price: [
                699.99,
                2.5,
                29.99,
                1199.99,
                1.99,
                49.99,
                499.99
            ],
            discount: [20, 2, 40, 24, 0, 10, 15]
        }
    });

    // Calculate the final price.
    const mathModifier = new Dashboards.DataModifier.types.Math({
        columnFormulas: [{
            column: 'finalPrice',
            formula: '((D1*(100-E1)/100))'
        }]
    });

    // Add modified data to initial data source
    await dataTable.setModifier(mathModifier);

    // Init the grid with the combined data
    initGrid(dataTable);
})();