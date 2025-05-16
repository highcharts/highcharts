const changelog = document.querySelector('#changelog');

Grid.grid('container', {
    dataTable: {
        columns: {
            available: [true, false, true, true],
            product: ['Apples', 'Pears', 'Plums', 'Bananas'],
            weight: [100, 40, 0.5, 200],
            price: [1.5, 2.53, 5, 4.5],
            country: ['PL', 'NL', 'RO', 'EC']
        }
    },
    columnDefaults: {
        cells: {
            editable: true,
            events: {
                afterRender: function () {
                    changelog.innerHTML +=
                        `<strong>${this.column.id}</strong> for <strong>${this.row.data.product}</strong> was updated to ${this.value} <br />`; // eslint-disable-line
                    changelog.scrollTop = changelog.scrollHeight;
                }
            }
        }
    },
    columns: [{
        id: 'available',
        dataType: 'bool',
        rendering: {
            type: 'checkbox'
        }
    }, {
        id: 'weight'
    }, {
        id: 'product',
        cells: {
            editable: false
        }
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
