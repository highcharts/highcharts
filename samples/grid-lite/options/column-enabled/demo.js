const visibilityToggle = document.getElementById('toggle-internal-column');

const grid = Grid.grid('container', {
    data: {
        columns: {
            product: ['Apples', 'Pears', 'Plums', 'Bananas'],
            stock: [120, 85, 40, 200],
            internalCode: ['APL-01', 'PER-02', 'PLU-03', 'BAN-04']
        }
    },
    columns: [{
        id: 'product',
        header: {
            format: 'Product'
        }
    }, {
        id: 'stock',
        header: {
            format: 'Stock'
        }
    }, {
        id: 'internalCode',
        header: {
            format: 'Internal code'
        },
        enabled: false
    }]
});

visibilityToggle.addEventListener('change', () => {
    grid.update({
        columns: [{
            id: 'internalCode',
            enabled: visibilityToggle.checked
        }]
    });
});
