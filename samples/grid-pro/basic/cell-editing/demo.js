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
            ]
        }
    },
    lang: {
        validationErrors: {
            notEmpty: {
                error: 'New value cannot be empty.'
            },
            number: {
                error: 'New value has to be a number.'
            },
            bool: {
                error: 'New value has to be a boolean.'
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
        validationRules: ['notEmpty', 'notEmpty', 'notEmpty']
    }, {
        id: 'numbers',
        dataType: 'number',
        validationRules: [{
            validate: 'notEmpty',
            error: function () {
                return 'Not empty formatter';
            }
        }, {
            validate: 'number',
            error: function (value) {
                return `New value <strong>${value}</strong> should be number`;
            }
        }]
    }, {
        id: 'price',
        dataType: 'number',
        validationRules: ['notEmpty', {
            validate: 'number',
            error: 'Price should be number'
        }]
    }, {
        id: 'booleans',
        dataType: 'bool',
        validationRules: [{
            validate: 'notEmpty',
            error: function () {
                return 'Not empty formatter';
            }
        }, {
            validate: 'bool',
            error: function () {
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
            error: 'The value must contain "URL"'
        }]
    }]
});
