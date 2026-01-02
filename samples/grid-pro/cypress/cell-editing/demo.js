Grid.grid('container', {
    dataTable: {
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
            ],
            wrongName: [34, 4, 51, 2, 3],
            csvString: ['1,2,3', '1,2,3', '1,2,3', '1,2,3', '1,2,3'],
            /* eslint-disable max-len */
            columnJSON: [
                '[{ "x": 0, "y": 1, "color": "#91C8E4" }, { "x": 1, "y": 4, "color": "#749BC2" }, { "x": 2, "y": 2, "color": "#4682A9" }]',
                '[{ "x": 0, "y": 1, "color": "#91C8E4" }, { "x": 1, "y": 1, "color": "#749BC2" }, { "x": 2, "y": 1, "color": "#4682A9" }]',
                '[{ "x": 0, "y": 2, "color": "#91C8E4" }, { "x": 1, "y": 1, "color": "#749BC2" }, { "x": 2, "y": 5, "color": "#4682A9" }]',
                '[{ "x": 0, "y": 10, "color": "#91C8E4" }, { "x": 1, "y": 1, "color": "#749BC2" }, { "x": 2, "y": 10, "color": "#4682A9" }]',
                '[{ "x": 0, "y": 10, "color": "#91C8E4" }, { "x": 1, "y": 1, "color": "#749BC2" }, { "x": 2, "y": 10, "color": "#4682A9" }]'
            ],
            /* eslint-enable max-len */
            defaultValidator: [[1, 2, 3], [1, 2, 3], [1, 2, 3], [1, 2, 3]]
        }
    },
    lang: {
        validationErrors: {
            notEmpty: {
                notification: 'New value cannot be empty.'
            },
            number: {
                notification: 'New value has to be a number.'
            }
        }
    },
    rendering: {
        rows: {
            minVisibleRows: 5
        }
    },
    caption: {
        text: 'Loreum ipsum caption'
    },
    description: {
        text: 'Loreum ipsum description'
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
                validationRules: [{
                    validate: 'notEmpty',
                    notification: function () {
                        return 'Not empty formatter';
                    }
                }, {
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
            editMode: {
                validationRules: [{
                    validate: 'notEmpty',
                    notification: function () {
                        return 'Not empty formatter';
                    }
                }, {
                    validate: 'boolean',
                    notification: function () {
                        return 'New value for column: ' +
                            this.column.id +
                            ' should be bool';
                    }
                }]
            }
        }
    }, {
        id: 'icon',
        cells: {
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
    }, {
        id: 'wrongName',
        dataType: 'none-existing-data-type',
        cells: {
            renderer: {
                type: 'wrong-render-type'
            }
        }
    }, {
        id: 'csvString',
        cells: {
            renderer: {
                type: 'sparkline'
            },
            editMode: {
                validationRules: ['arrayNumber']
            }
        }
    }, {
        id: 'csvArray',
        cells: {
            renderer: {
                type: 'sparkline'
            },
            editMode: {
                validationRules: ['arrayNumber']
            }
        }
    }, {
        id: 'columnJSON',
        cells: {
            renderer: {
                type: 'sparkline',
                chartOptions: {
                    chart: {
                        type: 'column'
                    }
                }
            },
            editMode: {
                validationRules: ['json']
            }
        }
    }, {
        id: 'defaultValidator',
        cells: {
            renderer: {
                type: 'sparkline'
            }
        }
    }]
});
