const grid = Grid.grid('container', {
    data: {
        columns: {
            product: [
                'Apples', 'Pears', 'Plums', 'Bananas', 'Oranges', 'Grapes'
            ],
            category: [
                'Fresh', 'Fresh', 'Seasonal', 'Fresh', 'Citrus', 'Seasonal'
            ],
            stock: [120, 85, 30, 200, 64, 140],
            price: [1.5, 2.53, 5, 4.5, 3.2, 6.75],
            updated: [
                Date.UTC(2026, 0, 12), Date.UTC(2026, 0, 19),
                Date.UTC(2026, 1, 3), Date.UTC(2026, 1, 9),
                Date.UTC(2026, 1, 18), Date.UTC(2026, 2, 2)
            ]
        }
    },
    accessibility: {
        screenReaderSection: {
            beforeGridFormat:
                '<div>{gridTitle}</div>' +
                '<div>{gridDescription}</div>' +
                '<div>Use arrow keys to move between cells and the filter ' +
                'row.</div>',
            afterGridFormat:
                '<div>End of the fruit inventory overview.</div>'
        }
    },
    caption: {
        text: 'Fruit inventory overview'
    },
    description: {
        text: 'Grouped headers, inline filtering, and screen reader ' +
            'announcements in a Grid Lite demo.'
    },
    rendering: {
        rows: {
            minVisibleRows: 6
        }
    },
    columnDefaults: {
        filtering: {
            enabled: true,
            inline: true
        }
    },
    header: [
        'id',
        {
            format: 'Product details',
            accessibility: {
                description: 'The Product details group contains the product ' +
                    'name and category columns.'
            },
            columns: [{
                columnId: 'product',
                format: 'Product name'
            }, {
                columnId: 'category',
                format: 'Category'
            }]
        },
        {
            format: 'Availability',
            accessibility: {
                description: 'The Availability group contains the stock, ' +
                    'price, and last updated columns.'
            },
            columns: [{
                columnId: 'stock',
                format: 'Stock'
            }, {
                columnId: 'price',
                format: 'Price'
            }, {
                columnId: 'updated',
                format: 'Last updated'
            }]
        }
    ],
    columns: [{
        id: 'id',
        filtering: {
            enabled: false
        },
        width: 60
    }, {
        id: 'stock',
        cells: {
            format: '{value} kg'
        }
    }, {
        id: 'price',
        cells: {
            format: '{value:.2f} €'
        }
    }, {
        id: 'updated',
        dataType: 'datetime',
        cells: {
            format: '{value:%Y-%m-%d}'
        }
    }]
});

const editorInputs = document.querySelectorAll('.editor input');

function getOptionValue(path) {
    let cursor = grid.options;

    for (const key of path.split('.')) {
        cursor = cursor?.[key];
    }

    return cursor;
}

function setOption(input) {
    const result = {};
    const path = input.name.split('.');
    let cursor = result;

    for (let i = 0, iEnd = path.length - 1; i < iEnd; i++) {
        cursor[path[i]] = cursor = {};
    }

    cursor[path[path.length - 1]] =
        input.type === 'checkbox' ? input.checked : input.value;

    grid.update(result);
}

function setInputValue(input) {
    const value = getOptionValue(input.name);
    if (input.type === 'checkbox') {
        input.checked = !!value;
    } else {
        input.value = value || '';
    }
}

for (const input of editorInputs) {
    setInputValue(input);

    input.addEventListener(
        input.type === 'checkbox' ? 'change' : 'input',
        () => {
            setOption(input);
        }
    );
}
