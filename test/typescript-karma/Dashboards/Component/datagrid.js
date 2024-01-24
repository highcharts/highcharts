//@ts-check
import Dashboards from '../../../../code/dashboards/es-modules/masters/dashboards.src.js';
import DataGrid from '../../../../code/dashboards/es-modules/masters/datagrid.src.js';
import DashboardsPlugin from '../../../../code/dashboards/es-modules/masters/modules/dashboards-plugin.src.js';

DashboardsPlugin.DataGridPlugin.custom.connectDataGrid(DataGrid.DataGrid);
DashboardsPlugin.PluginHandler.addPlugin(DashboardsPlugin.DataGridPlugin);

const { test } = QUnit;


test('DataGrid component with dataTable', async function (assert) {
    const container = document.createElement('div');
    container.id = 'container';

    const { DataTable } = Dashboards;

    const columns = {
        product: ['Apples', 'Pears', 'Plums', 'Bananas'],
        weight: [100, 40, 0.5, 200],
        price: [1.5, 2.53, 5, 4.5],
        metaData: ['a', 'b', 'c', 'd']
    };

    const dashboard = await Dashboards.board('container', {
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

    assert.ok(
        // @ts-ignore
        dashboard.mountedComponents[0].component.dataGrid.dataTable.columns.product,
        'DataGrid component should have a dataTable with columns.'
    );
});
