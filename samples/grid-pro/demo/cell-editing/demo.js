const changelog = document.querySelector('#changelog');

Grid.grid('container', {
    dataTable: {
        columns: {
            product: ['Apples', 'Pears', 'Plums', 'Bananas'],
            weight: [100, 40, 0.5, 200],
            price: [1.5, 2.53, 5, 4.5]
        }
    },
    columnDefaults: {
        cells: {
            editable: true,
            events: {
                afterEdit: function () {
                    changelog.innerHTML +=
                        `<strong>${this.column.id}</strong> for <strong>${this.row.data.product}</strong> was updated to ${this.value} <br />`; // eslint-disable-line
                    changelog.scrollTop = changelog.scrollHeight;
                }
            }
        }
    },
    columns: [{
        id: 'weight'
    }, {
        id: 'product',
        cells: {
            editable: false
        }
    }]
});
