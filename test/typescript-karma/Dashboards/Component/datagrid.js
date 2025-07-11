// @ts-ignore
import '../../../../code/dashboards/es-modules/masters/dashboards.src.js';
// @ts-ignore
import '../../../../code/grid/es-modules/masters/grid-pro.src.js';

// UMD modules register themselves as globals
window.Dashboards.GridPlugin.custom.connectGrid(window.Grid);
window.Dashboards.PluginHandler.addPlugin(window.Dashboards.GridPlugin);

const { test } = QUnit;

test('DataGrid component with dataTable', async function (assert) {
    const container = document.createElement('div');
    container.id = 'container';

    const { DataTable } = window.Grid;

    const columns = {
        product: ['Apples', 'Pears', 'Plums', 'Bananas'],
        weight: [100, 40, 0.5, 200],
        price: [1.5, 2.53, 5, 4.5],
        metaData: ['a', 'b', 'c', 'd']
    };

    const dashboard = await window.Dashboards.board('container', {
        gui: {
            layouts: [
                {
                    id: 'layout-1',
                    rows: [
                        {
                            cells: [
                                {
                                    id: 'dashboard-col-1'
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        components: [
            {
                renderTo: 'dashboard-col-1',
                type: 'DataGrid',
                dataGridOptions: {
                    dataTable: new DataTable({
                        columns
                    })
                }
            }
        ]
    }, true);

    const dataGridComponent = dashboard.mountedComponents[0].component;

    // Disconnect the resize observer to avoid errors in the test
    if (dataGridComponent && 'dataGrid' in dataGridComponent) {
        dataGridComponent.dataGrid.viewport.resizeObserver.disconnect();

        assert.ok(
            // @ts-ignore
            dataGridComponent.dataGrid.dataTable.columns.product,
            'DataGrid component should have a dataTable with columns.'
        );
    } else {
        assert.ok(false, 'DataGrid component not found or invalid type');
    }
});
