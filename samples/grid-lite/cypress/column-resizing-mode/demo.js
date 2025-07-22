const grid = Grid.grid('container', {
    dataTable: {
        columns: {
            product: Array.from({ length: 40 }, (_, i) => `A${i}`),
            weight: Array.from({ length: 40 }, (_, i) => `B${i}`),
            price: Array.from({ length: 40 }, (_, i) => `C${i}`),
            icon: Array.from({ length: 40 }, (_, i) => `E${i}`),
            meta: Array.from({ length: 40 }, (_, i) => `F${i}`)
        }
    },
    columns: [{
        id: 'product',
        width: '20%'
    }, {
        id: 'weight',
        width: '100px'
    }, {
        id: 'icon',
        width: '15%'
    }]
});

document.getElementById('select-distr').addEventListener('change', e => {
    grid.update({
        rendering: {
            columns: {
                resizing: {
                    mode: e.target.value
                }
            }
        }
    });
});

document.getElementById('cbx-virt').addEventListener('change', e => {
    grid.update({
        rendering: {
            rows: {
                virtualization: e.target.checked
            }
        }
    });
});

document.getElementById('btn-remove-widths').addEventListener('click', () => {
    grid.update({
        columns: [{
            id: 'product',
            width: void 0
        }, {
            id: 'weight',
            width: void 0
        }, {
            id: 'icon',
            width: void 0
        }]
    });
});
