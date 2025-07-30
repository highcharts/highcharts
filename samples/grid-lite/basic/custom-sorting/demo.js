Grid.grid('container', {
    dataTable: {
        columns: {
            product: ['Apples', 'Pears', 'plums', 'acerola'],
            weight: ['100 g', '40 kg', '0.5 kg', '800 g'],
            price: [1.5, 2.53, 5, 4.5]
        }
    },
    columns: [{
        id: 'product',
        sorting: {
            compare: (a, b) => {
                a = a.toLowerCase();
                b = b.toLowerCase();
                return a > b ? 1 : (a < b ? -1 : 0);
            }
        }
    }, {
        id: 'weight',
        sorting: {
            compare: (a, b) => {
                const convert = n => parseFloat(n) * (
                    n.endsWith('kg') ? 1000 : 1
                );
                return convert(b) - convert(a);
            }
        }
    }]
});
