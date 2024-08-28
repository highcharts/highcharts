//@ts-check
import DataGrid from '/base/code/datagrid/es-modules/masters/datagrid.src.js';

const { test, skip } = QUnit;

//@ts-ignore
test('DataGrid update methods', async function (assert) {
    const parentElement = document.getElementById('container');
    if (!parentElement) {
        return;
    }

    const dataTable = new DataGrid.DataTable({
        columns: {
            product: ['Apples', 'Pears', 'Plums', 'Bananas'],
            weight: [100, 40, 0.5, 200],
            price: [1.5, 2.53, 5, 4.5]
        }
    })

    const dataGrid = await DataGrid.dataGrid(parentElement, {
        dataTable: dataTable,
        columns: [{
            id: 'product',
            headerFormat: 'Column 1',
            cellFormat: 'before update'
        }]
    }, true);
    dataGrid.viewport?.resizeObserver?.disconnect();

    dataGrid.update({
        columns: [{
            id: 'weight',
            headerFormat: 'Column 2',
            cellFormat: 'text 1'
        }, {
            id: 'product',
            headerFormat: 'Column 1',
            cellFormat: 'text 2'
        }]
    }, false);

    assert.deepEqual(
        dataGrid.options.columns[0],
        {
            id: 'weight',
            headerFormat: 'Column 2',
            cellFormat: 'text 1'
        },
        'Update method should rewrite the columns array.'
    );

    dataGrid.userOptions.columns[0].cellFormat = 'text 3';
    dataGrid.update(void 0, false);

    assert.strictEqual(
        dataGrid.options.columns[0].cellFormat,
        'text 3',
        'Update method without arguments should update the columns array with the userOptions.'
    );

    dataGrid.updateColumn('weight', { headerFormat: undefined }, false);
    dataGrid.updateColumn('price', { headerFormat: 'Price Column' }, false);

    assert.deepEqual(
        dataGrid.options.columns,
        [
            {
                id: 'weight',
                headerFormat: undefined,
                cellFormat: 'text 3'
            },
            {
                id: 'product',
                headerFormat: 'Column 1',
                cellFormat: 'text 2'
            },
            {
                id: 'price',
                headerFormat: 'Price Column'
            }
        ],
        'updateColumns method should update the columns array by mergin by ids'
    );

    dataGrid.updateColumn('weight', null);
    dataGrid.updateColumn('price', { headerFormat: 'Column 2' }, false, true);
    dataGrid.updateColumn('product', {}, false, true);
    dataGrid.updateColumn('imaginary-column', { headerFormat: 'New One!' }, false);

    assert.deepEqual(
        dataGrid.options.columns,
        [
            {
                id: 'product'
            },
            {
                id: 'price',
                headerFormat: 'Column 2'
            },
            {
                id: 'imaginary-column',
                headerFormat: 'New One!'
            }
        ],
        'updateColumns method with ovewriting should replace the column options according to the IDs.'
    );

    assert.strictEqual(
        dataGrid.getOptionsJSON(),
        '{"dataTable":{"columns":{"product":["Apples","Pears","Plums","Bananas"],"weight":[100,40,0.5,200],' +
        '"price":[1.5,2.53,5,4.5]}},"columns":[{"id":"product"},{"id":"price","headerFormat":"Column 2"},{"' +
        'id":"imaginary-column","headerFormat":"New One!"}]}',
        'The getOptionsJSON method should return the correct JSON string.'
    )

    dataGrid.update({}, false, true);

    assert.deepEqual(
        dataGrid.userOptions,
        {},
        'DataGrid update with overwrite should replace the user options.'
    );
});
