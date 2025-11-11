//@ts-check
import Dashboards from '../../../../code/dashboards/es-modules/masters/dashboards.src.js';
import EditMode from '../../../../code/dashboards/es-modules/masters/modules/layout.src.js';

const { test } = QUnit;

test('component resizing', function (assert) {
    const parentElement = document.getElementById('container');
    if (!parentElement) {
        return;
    }

    const board = Dashboards.board(parentElement, {
        gui: {
            enabled: true,
            layouts: [{
                rows: [{
                    cells: [{
                        id: 'dashboard-cell'
                    }]
                }]
            }]
        },
        components: [{
            type: 'HTML',
            renderTo: 'dashboard-cell'
        }]
    });

    const component = board.mountedComponents[0].component;

    assert.deepEqual(
        {
            width: component.element.style.width,
            height: component.element.style.height
        },
        {
            width: '',
            height: ''
        },
        'Component with no dimensional options should have no internal styles set'
    );

    component.resize(200);
    assert.deepEqual(
        {
            width: component.element.style.width,
            height: component.element.style.height
        },
        {
            width: '',
            height: ''
        },
        'Should be able to update just the width'
    );

    component.resize(undefined, 300);

    assert.ok(
        component.element.style.width === '' && component.element.style.height !== '',
        'Should be able to update just the height. Width should stay the same.'
    );

    component.destroy();
});


test('HTML Component created with elements and html string.', async function (assert) {
    const parentElement = document.getElementById('container');
    if (!parentElement) {
        return;
    }

    Dashboards.board(parentElement, {
        gui: {
            enabled: true,
            layouts: [{
                rows: [{
                    cells: [{
                        id: 'dashboard-cell-1'
                    },{
                        id: 'dashboard-cell-2'
                    }]
                }]
            }]
        },
        components: [{
            type: 'HTML',
            renderTo: 'dashboard-cell-1',
            elements: [{
                tagName: 'h1',
                textContent: 'HTML from elements'
            }]
        }, {
            type: 'HTML',
            renderTo: 'dashboard-cell-2',
            html: '<h1>HTML from string</h1>'
        }]
    }, true).then(board => {
        const compFromElements = board.mountedComponents[0].component;
        const compFromString = board.mountedComponents[1].component;

        assert.strictEqual(
            compFromElements.element.innerText,
            'HTML from elements',
            'HTML from elements should be rendered and text should be correct.'
        );

        assert.strictEqual(
            compFromString.element.innerText,
            'HTML from string',
            'HTML from string should be rendered and text should be correct.'
        );
    });
});
