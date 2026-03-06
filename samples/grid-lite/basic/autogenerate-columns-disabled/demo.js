const smallDataColumns = {
    product: ['Apples', 'Pears', 'Plums', 'Bananas'],
    price: [3.24, 2.62, 5.99, 4.74],
    revenue: [120, 85, 200, 150],
    ignoredByConfig: ['A', 'B', 'C', 'D']
};

function generateLargeDataColumns(count) {
    const product = [];
    const price = [];
    const revenue = [];
    const ignoredByConfig = [];

    for (let i = 0; i < count; ++i) {
        product.push(`Product ${i + 1}`);
        price.push(Math.round(Math.random() * 1000) / 100);
        revenue.push((i * 37) % 250 + 50);
        ignoredByConfig.push(`X-${i + 1}`);
    }

    return {
        product,
        price,
        revenue,
        ignoredByConfig
    };
}

const grid = Grid.grid('container', {
    data: {
        providerType: 'local',
        autogenerateColumns: false,
        dataTable: {
            columns: smallDataColumns
        }
    },
    columns: [{
        id: 'sum',
        dataId: null,
        dataType: 'number',
        cells: {
            valueGetter: function (cell) {
                return cell.row.data.revenue * cell.row.data.price;
            },
            format: '${value:,.2f}'
        }
    }, {
        id: 'sales',
        dataId: 'revenue'
    }, {
        id: 'price',
        cells: {
            format: '${value:,.2f}'
        }
    }, {
        id: 'product'
    }]
});

document.getElementById('useLargeDataset').addEventListener('change', e => {
    grid.update({
        data: {
            dataTable: {
                columns: e.target.checked ?
                    generateLargeDataColumns(1000) :
                    smallDataColumns
            }
        }
    });
});
