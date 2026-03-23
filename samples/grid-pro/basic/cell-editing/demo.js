Grid.grid('container', {
    data: {
        columns: {
            product: [
                'Apples', 'Pears', 'Plums', 'Bananas', 'Oranges', 'Grapes',
                'Strawberries', 'Blueberries', 'Cherries', 'Mangoes'
            ],
            numbers: [100, 40, 0.5, 200, 150, 120, 50, 30, 25, 200],
            price: [1.5, 2.53, 5, 4.5, 3, 2.8, 6, 4.2, 7, 3.5],
            booleans: [
                true, false, true, true, false, true, true, false, false, false
            ],
            icon: [
                'Apples URL', 'Pears URL', 'Plums URL', 'Bananas URL',
                'Oranges URL', 'Grapes URL', 'Strawberries URL',
                'Blueberries URL', 'Cherries URL', 'Mangoes URL'
            ],
            country: [
                'PL', 'NL', 'RO', 'EC', 'ES', 'IT', 'DE', 'PL', 'TR', 'BR'
            ]
        }
    },
    lang: {
        validationErrors: {
            notEmpty: {
                notification: 'New value cannot be empty.'
            },
            number: {
                notification: 'New value has to be a number.'
            },
            boolean: {
                notification: 'New value has to be a boolean.'
            },
            ignoreCaseUnique: {
                notification: 'New value has to be unique (case-sensitive).'
            }
        }
    },
    rendering: {
        rows: {
            minVisibleRows: 5
        }
    },
    credits: {
        position: 'bottom'
    },
    columnDefaults: {
        cells: {
            editMode: {
                enabled: true
            }
        }
    },
    columns: [{
        id: 'product',
        dataType: 'string',
        cells: {
            editMode: {
                // Gets default error message text or from lang (if defined)
                validationRules: ['notEmpty', 'ignoreCaseUnique']
            }
        }
    }, {
        id: 'numbers',
        dataType: 'number',
        cells: {
            editMode: {
                validationRules: ['notEmpty', {
                    validate: 'number',
                    notification: function ({ rawValue }) {
                        return `New value <strong>${
                            rawValue
                        }</strong> should be number`;
                    }
                }]
            }
        }
    }, {
        id: 'price',
        dataType: 'number',
        cells: {
            editMode: {
                validationRules: ['notEmpty', {
                    validate: 'number',
                    notification: 'Price should be number'
                }]
            }
        }
    }, {
        id: 'booleans',
        dataType: 'boolean',
        cells: {
            renderer: {
                type: 'text'
            },
            editMode: {
                renderer: {
                    type: 'checkbox'
                }
            }
        }
    }, {
        id: 'icon',
        cells: {
            renderer: {
                type: 'textInput'
            },
            editMode: {
                validationRules: ['notEmpty', {
                    validate: function ({ rawValue }) {
                        return rawValue.indexOf('URL') !== -1;
                    },
                    notification: 'The value must contain "URL"'
                }]
            }
        }
    }, {
        id: 'country',
        dataType: 'string',
        cells: {
            renderer: {
                type: 'select',
                options: [
                    { value: 'PL', label: 'Poland' },
                    { value: 'NL', label: 'Netherlands' },
                    { value: 'RO', label: 'Romania' },
                    { value: 'EC', label: 'Ecuador' },
                    { value: 'ES', label: 'Spain' },
                    { value: 'IT', label: 'Italy' },
                    { value: 'DE', label: 'Germany' },
                    { value: 'TR', label: 'Turkey' },
                    { value: 'BR', label: 'Brazil' }
                ]
            }
        }
    }]
});
