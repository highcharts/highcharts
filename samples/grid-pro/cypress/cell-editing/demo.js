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
            editable: true
        }
    },
    columns: [{
        id: 'product',
        dataType: 'string',
        // Gets default error message text or from lang (if defined)
        validationRules: ['notEmpty', 'notEmpty', 'notEmpty']
    }, {
        id: 'numbers',
        dataType: 'number',
        validationRules: [{
            validate: 'notEmpty',
            notification: function () {
                return 'Not empty formatter';
            }
        }, {
            validate: 'number',
            notification: function (value) {
                return `New value <strong>${value}</strong> should be number`;
            }
        }]
    }, {
        id: 'price',
        dataType: 'number',
        validationRules: ['notEmpty', {
            validate: 'number',
            notification: 'Price should be number'
        }]
    }, {
        id: 'booleans',
        dataType: 'boolean',
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
    }, {
        id: 'icon',
        validationRules: ['notEmpty', {
            validate: function (value) {
                return value.indexOf('URL') !== -1;
            },
            notification: 'The value must contain "URL"'
        }]
    }, {
        id: 'country',
        dataType: 'string',
        rendering: {
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
    }]
});
