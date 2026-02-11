const products = Array.from({ length: 140 }, (_, i) => {
    const index = i + 1;
    return {
        id: 'SKU-' + String(index).padStart(3, '0'),
        product: 'Product ' + index,
        category: ['Fruit', 'Vegetable', 'Drinks', 'Snacks'][index % 4],
        stock: (index * 7) % 100,
        price: '$' + (index * 0.35 + 1).toFixed(2)
    };
});

const grid = Grid.grid('container', {
    data: {
        providerType: 'local',
        dataTable: {
            columns: {
                id: products.map(p => p.id),
                product: products.map(p => p.product),
                category: products.map(p => p.category),
                stock: products.map(p => p.stock),
                price: products.map(p => p.price)
            }
        }
    },
    rendering: {
        rows: {
            virtualization: true,
            virtualizationThreshold: 20,
            sticky: {
                idColumn: 'id',
                ids: ['SKU-005', 'SKU-050', 'SKU-135']
            }
        }
    }
});

window.stickyRowsTest = {
    getGrid: () => grid
};
