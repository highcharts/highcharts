// @ts-ignore
import Dashboards from '../../../../code/dashboards/es-modules/masters/dashboards.src.js';

const { test } = QUnit;


test('Board.update() - update components', async function (assert) {
    const container = document.createElement('div');
    container.id = 'container';
    document.body.appendChild(container);

    const initialBoard = await Dashboards.board('container', {
        gui: {
            layouts: [{
                rows: [{
                    cells: [{
                        id: 'dashboard-cell-1'
                    }]
                }]
            }]
        },
        components: [{
            renderTo: 'dashboard-cell-1',
            type: 'HTML',
            id: 'html-component',
            elements: [{
                tagName: 'h1',
                textContent: 'Initial Title'
            }]
        }]
    }, true);

    const updatedBoard = initialBoard.update({
        components: [{
            renderTo: 'dashboard-cell-1',
            type: 'HTML',
            id: 'html-component',
            elements: [{
                tagName: 'h1',
                textContent: 'Updated Title'
            }]
        }]
    });

    assert.ok(updatedBoard, 'Updated board created');
    assert.notStrictEqual(
        initialBoard,
        updatedBoard,
        'Update returns a new board instance'
    );
    assert.strictEqual(
        updatedBoard.mountedComponents.length,
        1,
        'Updated board has one component'
    );

    document.body.removeChild(container);
});


test('Board.update() - update layouts', async function (assert) {
    const container = document.createElement('div');
    container.id = 'container';
    document.body.appendChild(container);

    const initialBoard = await Dashboards.board('container', {
        gui: {
            layouts: [{
                id: 'layout-1',
                rows: [{
                    cells: [{
                        id: 'dashboard-cell-1'
                    }]
                }]
            }]
        },
        components: [{
            renderTo: 'dashboard-cell-1',
            type: 'HTML',
            elements: [{
                tagName: 'p',
                textContent: 'Initial content'
            }]
        }]
    }, true);

    const updatedBoard = initialBoard.update({
        gui: {
            layouts: [{
                id: 'layout-1',
                rows: [{
                    cells: [{
                        id: 'dashboard-cell-1'
                    }, {
                        id: 'dashboard-cell-2'
                    }]
                }]
            }]
        }
    });

    assert.ok(updatedBoard, 'Updated board created');
    assert.strictEqual(
        updatedBoard.layouts?.length,
        1,
        'Updated board has one layout'
    );

    document.body.removeChild(container);
});
