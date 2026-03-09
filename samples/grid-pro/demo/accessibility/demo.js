const grid = Grid.grid('container', {
    data: {
        columns: {
            id: [1, 2, 3, 4],
            product: ['Apple', 'Pear', 'Plum', 'Banana'],
            weight: [100, 60, 30, 200],
            price: [1.5, 2.53, 5, 4.5]
        }
    },
    rendering: {
        rows: {
            minVisibleRows: 4
        }
    },
    columnDefaults: {
        cells: {
            editMode: {
                enabled: true
            }
        }
    },
    credits: {
        text: 'Highcharts Grid'
    },
    caption: {
        text: 'Fruits weight and price'
    },
    columns: [{
        id: 'id',
        header: {
            format: 'ID'
        },
        cells: {
            editMode: {
                enabled: false
            }
        },
        width: 60
    }, {
        id: 'product',
        header: {
            format: 'Product'
        }
    }, {
        id: 'weight',
        header: {
            format: 'Weight'
        },
        cells: {
            format: '{value} g'
        }
    }, {
        id: 'price',
        header: {
            format: 'Price'
        },
        cells: {
            format: '{value:.2f} €'
        }
    }]
});

const editorInputs = document.querySelectorAll('.editor input');

function getOptionValue(path) {
    let cursor = grid.options;
    for (const key of path.split('.')) {
        cursor = cursor[key];
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
        input.checked = value;
    } else {
        input.value = value;
    }
}

for (const input of editorInputs) {
    setInputValue(input);

    input.addEventListener('change', () => {
        setOption(input);
    });
}
