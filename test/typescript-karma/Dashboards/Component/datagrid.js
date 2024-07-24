//@ts-check
import Dashboards from '../../../../code/dashboards/es-modules/masters/dashboards.src.js';
import DataGrid from '../../../../code/datagrid/es-modules/masters/datagrid.src.js';
import EditMode from '../../../../code/dashboards/es-modules/masters/modules/layout.src.js';

Dashboards.DataGridPlugin.custom.connectDataGrid(DataGrid);
Dashboards.PluginHandler.addPlugin(Dashboards.DataGridPlugin);

const { test } = QUnit;

// DataGrid1 Tests to update
test('DataGrid component with dataTable', async function (assert) {
    const container = document.createElement('div');
    container.id = 'container';

    const { DataTable } = DataGrid;

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
                    table: new DataTable({
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
