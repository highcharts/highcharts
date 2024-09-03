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
        }
    }, true);
    dataGrid.viewport?.resizeObserver?.disconnect();

    assert.ok(dataGrid.credits, 'Credits should be initialized.');

    dataGrid.credits.update({
        text: 'DataGrid credits',
        href: 'https://placeholder.web',
        position: 'top'
    });

    assert.strictEqual(
        dataGrid.credits.textElement.textContent,
        'DataGrid credits',
        'Credits text should be updated.'
    );

    assert.strictEqual(
        dataGrid.credits.textElement.getAttribute('href'),
        'https://placeholder.web',
        'Credits href should be updated.'
    );

    assert.strictEqual(
        dataGrid.contentWrapper.firstChild,
        dataGrid.credits.containerElement,
        'Credits should be positioned at the top if specified so.'
    )

    dataGrid.credits.update({
        enabled: false
    });

    assert.notOk(dataGrid.credits, 'Credits should be able to be disabled.');

    await dataGrid.update({
        credits: {
            enabled: true
        }
    });
    dataGrid.viewport?.resizeObserver?.disconnect();

    assert.ok(dataGrid.credits, 'Credits should be able to be enabled.');
});
