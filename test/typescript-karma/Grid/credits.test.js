//@ts-check
import '/base/code/grid/es-modules/masters/grid-pro.src.js';

const Grid = window.Grid;

const { test } = QUnit;

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
        }
    }, true);
    grid.viewport?.resizeObserver?.disconnect();

    assert.ok(grid.credits, 'Credits should be initialized.');

    grid.credits.update({
        text: 'Grid credits',
        href: 'https://placeholder.web',
        position: 'top'
    });

    assert.strictEqual(
        grid.credits.textElement.textContent,
        'Grid credits',
        'Credits text should be updated.'
    );

    assert.strictEqual(
        grid.credits.textElement.getAttribute('href'),
        'https://placeholder.web',
        'Credits href should be updated.'
    );

    assert.strictEqual(
        grid.contentWrapper.firstChild,
        grid.credits.containerElement,
        'Credits should be positioned at the top if specified so.'
    )

    grid.credits.update({
        enabled: false
    });

    assert.notOk(grid.credits, 'Credits should be able to be disabled.');

    await grid.update({
        credits: {
            enabled: true
        }
    });
    grid.viewport?.resizeObserver?.disconnect();

    assert.ok(grid.credits, 'Credits should be able to be enabled.');

    grid.viewport?.resizeObserver?.disconnect();
});
