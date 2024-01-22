//@ts-check
import Dashboards from '../../../../code/dashboards/es-modules/masters/dashboards.src.js';

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
            cell: 'dashboard-cell'
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

    assert.deepEqual(
        {
            width: component.element.style.width,
            height: component.element.style.height
        },
        {
            width: '',
            height: '300px'
        },
        'Should be able to update just the height. Width should stay the same.'
    );

    component.destroy();

    // parentElement.style.width = '1000px';
    // parentElement.style.height = '200px';
    // component.resize('100%', '100%');
    // assert.deepEqual(
    //     {
    //         width: component.element.style.width,
    //         height: component.element.style.height
    //     },
    //     {
    //         width: 1000,
    //         height: 200
    //     },
    //     'Should be able to update just the height'
    // );

    // const widthComponent = new HTMLComponent({
    //     dimensions: {
    //         width: '100'
    //     }
    // }).render();
    // assert.strictEqual(widthComponent.dimensions.width, 100)
    // assert.strictEqual(widthComponent.dimensions.height, null)

    // widthComponent.destroy()

    //  const heightComponent = new HTMLComponent({
    //      dimensions: {
    //          height: '100'
    //      }
    //  }).render();
    //  assert.strictEqual(heightComponent.dimensions.width, null)
    //  assert.strictEqual(heightComponent.dimensions.height, 100)
    //
    //  heightComponent.destroy()
    //
    //  const emptyDimensions = new HTMLComponent({
    //      dimensions: {}
    // }).render();
    //  assert.strictEqual(emptyDimensions.dimensions.width, null)
    //  assert.strictEqual(emptyDimensions.element.style.height, "")
    //
    //  emptyDimensions.destroy();
    //
    //  const percentageDimensions = new HTMLComponent({
    //      parentElement: parent,
    //      dimensions: {
    //          width: '50%',
    //          height: '50%'
    //      }
    //  }).render();
    //
    //  let rect = percentageDimensions.element.getBoundingClientRect()
    //  assert.strictEqual(rect.width, parent.scrollWidth / 2)
    //  assert.strictEqual(rect.height, parent.scrollHeight / 2 )
    //
    //
    // // With padding
    // percentageDimensions.element.style.padding = '5px';
    // percentageDimensions.resize('50%', '50%')
    //
    // rect = percentageDimensions.element.getBoundingClientRect()
    // assert.strictEqual(rect.width, parent.scrollWidth / 2)
    // assert.strictEqual(rect.height, parent.scrollHeight / 2)
    //
    // percentageDimensions.destroy();
});
