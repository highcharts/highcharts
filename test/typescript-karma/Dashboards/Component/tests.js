//@ts-check
import Highcharts from '../../../../code/es-modules/masters/highcharts.src.js';
import HighchartsComponent from '../../../../code/es-modules/Extensions/DashboardPlugins/HighchartsComponent.js';
import HTMLComponent from '../../../../code/es-modules/Dashboards/Components/HTMLComponent.js';
import Component from '../../../../code/es-modules/Dashboards/Components/Component.js';
import CSVConnector from '../../../../code/es-modules/Data/Connectors/CSVConnector.js';

import Dashboards from '../../../../code/es-modules/masters/dashboards.src.js';
import PluginHandler from '../../../../code/es-modules/Dashboards/PluginHandler.js';
import HighchartsPlugin from '../../../../code/es-modules/Extensions/DashboardPlugins/HighchartsPlugin.js';

HighchartsPlugin.custom.connectHighcharts(Highcharts);
PluginHandler.addPlugin(HighchartsPlugin);
HighchartsComponent.charter = Highcharts;

const { test, only, skip } = QUnit;

/** @type {Component.Event['type'][]} */
const eventTypes = [
    'load',
    'afterLoad',
    'beforeRender',
    'afterRender',
    'redraw',
    'afterRedraw',
    'tableChanged',
    'connectorAttached',
    'update',
    'afterUpdate',
    'message'
];

/** @type {Component.Event['type'][]} */
const registeredEvents = [];

/** @param {Component.Event} e */
function registerEvent(e) {
    registeredEvents.push(e.type);
}

/**
 * @param {string[]} array
 */
function emptyArray(array) {
    array.length = 0;
}
/** @param {HighchartsComponent | HTMLComponent} component */
function registerEvents(component) {
    eventTypes.forEach((eventType) => component.on(eventType, registerEvent));
}

skip('Board without data connectors and HighchartsComponent update', function (assert) {
    const parentElement = document.getElementById('container');
    if (!parentElement) {
        return;
    }

    const board = Dashboards.board(parentElement, {
        gui: {
            enabled: true,
            layouts: [
                {
                    rows: [
                        {
                            cells: [
                                {
                                    id: 'cell-1'
                                },
                                {
                                    id: 'cell-2'
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        components: [
            {
                cell: 'cell-1',
                type: 'Highcharts',
                chartOptions: {
                    title: {
                        text: void 0
                    }
                }
            },
            {
                cell: 'cell-2',
                type: 'HTML',
                elements: [
                    {
                        tagName: 'h1',
                        textContent: 'Some text'
                    }
                ]
            }
        ]
    });
    // Test the HighchartsComponent
    const highchartsComponent = board.mountedComponents[0].component;

    registerEvents(highchartsComponent);
    highchartsComponent.update({
        chartOptions: {
            title: {
                text: 'Hello World'
            }
        }
    });
    assert.deepEqual(
        registeredEvents,
        ['update', 'redraw', 'beforeRender', 'load', 'afterLoad', 'afterRender'],
        'After updating the HighchartsComponent events should be fired in the correct order.'
    );

    emptyArray(registeredEvents);

    assert.strictEqual(
        highchartsComponent.options.chartOptions.title.text,
        'Hello World',
        'HighchartsComponent should have updated title'
    );

    // Test the HTMLComponent
    const htmlComponent = board.mountedComponents[1].component;

    registerEvents(htmlComponent);
    htmlComponent.update({
        elements: [
            {
                tagName: 'h1',
                textContent: 'Hello World'
            }
        ]
    });

    assert.deepEqual(
        registeredEvents,
        ['update', 'redraw', 'beforeRender', 'load', 'afterLoad', 'afterRender', 'afterRedraw'],
        'After updating HTMLComponent, the events should be fired in the correct order.'
    );

    // @TODO test update with the redraw flag set to false !!!!!!!!!!!!!!!!!!!
    // component.update({
    //     chartOptions: {
    //         title: {
    //             text: 'This should fire a redraw'
    //         }
    //     },
    //     false
    // });

    // expectedEvents.push(
    //       "update",
    //       "redraw",
    //       "beforeRender",
    //       "load",
    //       "afterLoad",
    //       "afterRender",
    //       "update",
    //       "afterUpdate"

    // );
    // assert.deepEqual(registeredEvents, expectedEvents, 'events after forced update');

    emptyArray(registeredEvents);
});

skip('Board with data connectors and HighchartsComponent update', async function (assert) {
    const parentElement = document.getElementById('container');
    if (!parentElement) {
        return;
    }

    const board = await Dashboards.board(parentElement, {
        dataPool: {
            connectors: [
                {
                    name: 'connector-1',
                    type: 'CSV',
                    options: {
                        csv: '1,2,3',
                        firstRowAsNames: false
                    }
                }
            ]
        },
        gui: {
            enabled: true,
            layouts: [
                {
                    rows: [
                        {
                            cells: [
                                {
                                    id: 'cell-1'
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        components: [
            {
                cell: 'cell-1',
                type: 'Highcharts',
                connector: {
                    name: 'connector-1'
                },
                chartOptions: {
                    title: {
                        text: void 0
                    }
                }
            }
        ]
    }, true);
    const componentWithConnector = board.mountedComponents[0].component;

    registerEvents(componentWithConnector);
    await componentWithConnector.update({
        chartOptions: {
            title: {
                text: 'Hello World'
            }
        }
    });
    await assert.deepEqual(
        registeredEvents,
        [
            'afterUpdate',
            'afterUpdate',
            'update',
            'connectorAttached',
            'redraw',
            'beforeRender',
            'load',
            'afterLoad',
            'afterRender',
            'afterUpdate'
        ],
        'If connector is given in options, it will be attached during load'
    );

    emptyArray(registeredEvents);

    // // Message
    // expectedEvents.push('message');

    // // This should fire a 'message' event to all the other components
    // // We should expect N - 1 'message' events (in this case 1)

    // componentWithConnector.postMessage('hello');

    // assert.deepEqual(registeredEvents, expectedEvents);

    // // This should bounce a message back and forth
    // componentWithConnector.postMessage({
    //     callback: function () {
    //         this.postMessage('hello');
    //     }
    // });

    // expectedEvents.push('message', 'message');

    // assert.deepEqual(registeredEvents, expectedEvents);

    Component.removeInstance(componentWithConnector);
});

skip('component resizing', function (assert) {
    const parent = document.createElement('div');
    parent.id = 'test';

    const container = document.getElementById('container');
    if (!container) {
        return;
    }

    container.appendChild(parent);

    const component = new HTMLComponent({
        parentElement: parent
    }).render();
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
            width: '200px',
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
            width: '200px',
            height: '300px'
        },
        'Should be able to update just the height. Width should stay the same.'
    );

    parent.style.width = '1000px';
    parent.style.height = '200px';
    component.resize('100%', '100%');
    assert.deepEqual(
        {
            width: component.dimensions.width,
            height: component.dimensions.height
        },
        {
            width: 1000,
            height: 200
        },
        'Should be able to update just the height'
    );

    component.destroy();

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

skip('HighchartsComponent resizing', function (assert) {
    const parent = document.createElement('div');
    parent.id = 'test';
    parent.style.width = '500px';
    document.getElementById('container').appendChild(parent);

    const component = new HighchartsComponent({
        parentElement: parent,
        chartOptions: {
            chart: {}
        },
        dimensions: {
            height: '100%',
            width: '100%'
        }
    }).render();

    const { width, height } = component.element.style;
    assert.ok(true);
});

skip('toJSON', function (assert) {
    const container = document.createElement('div');
    container.id = 'container';

    const connector = new CSVConnector();
    const component = new HighchartsComponent({
        connector,
        parentElement: container,
        chartOptions: {
            chart: {},
            series: [
                {
                    data: [1, 2, 3, 5, 15, 1, 5, 15, 1]
                }
            ]
        }
    });

    component.render();
    const json = component.toJSON();
    const clone = HighchartsComponent.fromJSON(json);
    clone.render();

    assert.deepEqual(json, clone.toJSON());
});
