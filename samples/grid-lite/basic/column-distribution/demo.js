Grid.grid('container', {
    dataTable: {
        columns: {
            product: Array.from({ length: 40 }, (_, i) => `A${i}`),
            weight: Array.from({ length: 40 }, (_, i) => `B${i}`),
            price: Array.from({ length: 40 }, (_, i) => `C${i}`),
            icon: Array.from({ length: 40 }, (_, i) => `E${i}`),
            meta: Array.from({ length: 40 }, (_, i) => `F${i}`)
        }
    },
    rendering: {
        columns: {
            distribution: 'mixed'
        }
    },
    columns: [{
        id: 'product',
        header: {
            format: '20% width'
        },
        width: '20%'
    }, {
        id: 'weight',
        header: {
            format: '100px width'
        },
        width: '100px'
    }, {
        id: 'price',
        header: {
            format: 'Not defined width'
        }
    }, {
        id: 'icon',
        header: {
            format: '15% width'
        },
        width: '15%'
    }, {
        id: 'meta',
        header: {
            format: 'Not defined width'
        }
    }]
});
