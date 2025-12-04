//@ts-check
import Grid from '/base/code/grid/es-modules/masters/grid-pro.src.js';

const { test } = QUnit;

test('Grid setOptions function', function (assert) {
    assert.strictEqual(
        Grid.defaultOptions.credits.enabled,
        true,
        'The default options should be initially defined.'
    );

    Grid.setOptions({
        credits: {
            enabled: false
        }
    });

    assert.strictEqual(
        Grid.defaultOptions.credits.enabled,
        false,
        'The setOptions function should modify the default options.'
    );
});

//@ts-ignore
test('Grid update methods', async function (assert) {
    const parentElement = document.getElementById('container');
    if (!parentElement) {
        return;
    }

    const grid = await Grid.grid(parentElement, {
        dataTable: {
            columns: {
                product: ['Apples', 'Pears', 'Plums', 'Bananas'],
                weight: [100, 40, 0.5, 200],
                price: [1.5, 2.53, 5, 4.5]
            }
        },
        columns: [{
            id: 'product',
            header: {
                format: 'Column 1'
            },
            cells: {
                format: 'before update'
            }
        }, {
            id: 'weight',
            header: {
                format: 'Column 2'
            },
            cells: {
                format: 'before update'
            }
        }]
    }, true);
    grid.viewport?.resizeObserver?.disconnect();

    const newOptionsObject = {
        columns: [{
            id: 'weight',
            cells: {
                format: 'after update'
            }
        }, {
            id: 'price',
            enabled: false
        }, {
            id: 'imaginary-column',
        }]
    }

    grid.update(newOptionsObject, false);

    assert.ok(
        newOptionsObject.columns,
        'The update method should not mutate the options object passed as an argument.'
    );

    assert.deepEqual(
        grid.options.columns,
        [{
            id: 'product',
            header: {
                format: 'Column 1'
            },
            cells: {
                format: 'before update'
            }
        }, {
            id: 'weight',
            header: {
                format: 'Column 2'
            },
            cells: {
                format: 'after update'
            }
        }, {
            id: 'price',
            enabled: false
        }],
        'Update method should merge column options by id.'
    );

    grid.update({
        columns: [{
            id: 'weight'
        }, {
            id: 'product',
            cells: {
                format: 'after update'
            }
        }]
    }, false, true);

    assert.deepEqual(
        grid.options.columns,
        [{
            id: 'weight',
            header: {
                format: 'Column 2'
            },
            cells: {
                format: 'after update'
            }
        }, {
            id: 'product',
            header: {
                format: 'Column 1'
            },
            cells: {
                format: 'after update'
            }
        }],
        'One-to-one update should remove all the column options that were not' +
        ' specified in the first argument.'
    );

    grid.updateColumn('weight', {}, false, true);
    grid.updateColumn('product', { enabled: false }, false);
    grid.updateColumn('imaginary-column', { 
        header: {
            format: 'New One!'
        }
    }, false);

    assert.deepEqual(
        grid.options.columns,
        [{
            id: 'product',
            header: {
                format: 'Column 1'
            },
            cells: {
                format: 'after update'
            },
            enabled: false
        }, {
            id: 'imaginary-column',
            header: {
                format: 'New One!'
            }
        }],
        'Varations of updateColumn method should work correctly.'
    );

    assert.strictEqual(
        JSON.stringify(grid.getOptions()),
        '{"columns":[{"id":"product","header":{"format":"Column 1"},"cells":{"format":"after update"},"enabled":false},' +
        '{"id":"imaginary-column","header":{"format":"New One!"}}],"dataTable":{"columns":{"product":["Apples","P' +
        'ears","Plums","Bananas"],"weight":[100,40,0.5,200],"price":[1.5,2.53,5,4.5]}}}',
        'The getOptionsJSON method should return the correct JSON string.'
    );

    grid.viewport?.resizeObserver?.disconnect();
});


//@ts-ignore
test('Grid custom sorting', async function (assert) {

    const parentElement = document.getElementById('container');
    if (!parentElement) {
        return;
    }

    const grid = await Grid.grid(parentElement, {
        dataTable: {
            columns: {
                label: ['A', 'B', 'C', 'D'],
                weight: ['100 g', '40 kg', '0.5 kg', '800 g']
            }
        },
        columns: [{
            id: 'weight',
            sorting: {
                compare: (a, b) => {
                    //@ts-ignore
                    const convert = n => parseFloat(n) * (
                        n.endsWith('kg') ? 1000 : 1
                    );
                    return convert(b) - convert(a);
                }
            }
        }]
    }, true);
    grid.viewport?.resizeObserver?.disconnect();

    await grid.viewport?.getColumn('weight')?.sorting?.setOrder('asc');

    assert.deepEqual(
        grid.viewport?.getColumn('label')?.data,
        ['B', 'D', 'C', 'A'],
        'Column "label" should be sorted according to the "weight" column in ascending order.'
    );
});
