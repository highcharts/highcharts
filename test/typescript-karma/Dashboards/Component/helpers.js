// @ts-ignore
import Dashboards from '../../../../code/dashboards/es-modules/masters/dashboards.src.js';

const { test } = QUnit;


test('Component helpers', async function (assert) {
    const container = document.createElement('div');
    container.id = 'container';

    const dashboard = await Dashboards.board('container', {
        gui: {
            layouts: [{
                rows: [{
                    cells: [{
                        id: 'dashboard-cell-1'
                    }, {
                        id: 'dashboard-cell-2'
                    }]
                }]
            }]
        },
        components: [{
            renderTo: 'dashboard-cell-1',
            type: 'KPI',
            title: 'Value',
            value: 1,
            chartOptions: {
                series: [{
                    data: [1, 2, 3]
                }]
            }
        }, {
            renderTo: 'dashboard-cell-2',
            id: 'html-component',
            type: 'HTML',
            elements: [{
                tagName: 'h1',
                textContent: 'HTML from elements'
            }]
        }]
    }, true);

    // Old way of getting components
    const kpi = dashboard.mountedComponents[0].component;
    const html = dashboard.mountedComponents[1].component;

    assert.ok(kpi.chart, 'KPI Component direct lookup.');
    assert.ok(html.element, 'HTML Component direct lookup.');

    // Getting components by ID
    let kpi1 = dashboard.getComponentByCellId('dashboard-cell-1');
    let html1 = dashboard.getComponentById('html-component');

    assert.ok(html1.element, 'HTML Component via helper.');
    assert.ok(kpi1.chart, 'KPI Component via helper.');

    // Getting components by ID, expected failures
    let comp = dashboard.getComponentById('dashboard-cell-2');
    assert.notOk(comp, 'Component with wrong id.');

    comp = dashboard.getComponentByCellId('junk-cell-id');
    assert.notOk(comp, 'Component with wrong cell id.');
});
