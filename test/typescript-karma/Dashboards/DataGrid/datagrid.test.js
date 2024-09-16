//@ts-check
import DataGrid from '/base/code/datagrid/es-modules/masters/datagrid.src.js';

const { test } = QUnit;

//@ts-ignore
test('DataGrid update methods', async function (assert) {
    const parentElement = document.getElementById('container');
    if (!parentElement) {
        return;
    }

    const dataGrid = await DataGrid.dataGrid(parentElement, {
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
    dataGrid.viewport?.resizeObserver?.disconnect();

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

    dataGrid.update(newOptionsObject, false);

    assert.ok(
        newOptionsObject.columns,
        'The update method should not mutate the options object passed as an argument.'
    );

    assert.deepEqual(
        dataGrid.options.columns,
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

    dataGrid.update({
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
        dataGrid.options.columns,
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

    dataGrid.updateColumn('weight', {}, false, true);
    dataGrid.updateColumn('product', { enabled: false }, false);
    dataGrid.updateColumn('imaginary-column', { 
        header: {
            format: 'New One!'
        }
    }, false);

    assert.deepEqual(
        dataGrid.options.columns,
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
        dataGrid.getOptionsJSON(),
        '{"columns":[{"id":"product","header":{"format":"Column 1"},"cells":{"format":"after update"},"enabled":false},' +
        '{"id":"imaginary-column","header":{"format":"New One!"}}],"dataTable":{"columns":{"product":["Apples","P' +
        'ears","Plums","Bananas"],"weight":[100,40,0.5,200],"price":[1.5,2.53,5,4.5]}}}',
        'The getOptionsJSON method should return the correct JSON string.'
    );
});
