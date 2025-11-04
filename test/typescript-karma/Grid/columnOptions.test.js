import '/base/code/grid/es-modules/masters/grid-pro.src.js';

const Grid = window.Grid;

const { test } = QUnit;

test('Grid formatter options', async function (assert) {
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
        columnDefaults: {
            header: {
                formatter: function() {
                    return 1; // Should not throw an error even if wrong type
                }
            },
            cells: {
                formatter: function() {
                    return 2; // Should not throw an error even if wrong type
                }
            }
        }
    }, true);
    grid.viewport?.resizeObserver?.disconnect();

    assert.ok(grid, 'Formatter returns the wrong type, but it can be stringified without causing an error.');
});
