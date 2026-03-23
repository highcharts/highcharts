const viewRenderer = document.getElementById('view-renderer');
const editModeRenderer = document.getElementById('edit-mode-renderer');

Grid.grid('container', {
    data: {
        columns: {
            product: ['Apples', 'Pears', 'Plums', 'Bananas'],
            cbx: [true, false, false, true],
            price: [1.5, 2.53, 5, 4.5]
        }
    },
    columns: [{
        id: 'cbx',
        cells: {
            renderer: {
                type: 'checkbox'
            },
            events: {
                afterEdit: function () {
                    viewRenderer.value = 'afterEdit';
                }
            }
        }
    }, {
        id: 'price',
        cells: {
            editMode: {
                enabled: true
            },
            events: {
                afterEdit: function () {
                    editModeRenderer.value = 'afterEdit';
                }
            }
        }
    }]
});
