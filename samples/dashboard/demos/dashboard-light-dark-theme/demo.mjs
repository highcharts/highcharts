// Bring in other forms of Highcharts
import HighchartsPlugin from '../../../../code/es-modules/Extensions/DashboardPlugins/HighchartsPlugin.js';
import DataGridPlugin from '../../../../code/es-modules/Extensions/DashboardPlugins/DataGridPlugin.js';

const { CSVStore, PluginHandler } = Dashboard;
HighchartsPlugin.custom.connectHighcharts(Highcharts);
PluginHandler.addPlugin(HighchartsPlugin);

DataGridPlugin.custom.connectDataGrid(DataGrid.DataGrid);
PluginHandler.addPlugin(DataGridPlugin);

const csvData = document.getElementById('csv').innerText;

const store = new CSVStore(void 0, {
    csv: csvData,
    firstRowAsNames: true
});

store.load();

Highcharts.setOptions({
    chart: {
        styledMode: true
    }
});

const dashboard = new Dashboard.Dashboard('container', {
    store: store,
    editMode: {
        enabled: true,
        contextMenu: {
            enabled: true,
            items: ['editMode']
        }
    },
    gui: {
        enabled: true,
        layouts: [
            {
                id: 'layout-1',
                rows: [
                    {
                        cells: [
                            {
                                id: 'dashboard-col-0'
                            },
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
            store,
            sync: {
                visibility: true,
                tooltip: true,
                selection: true
            },
            cell: 'dashboard-col-0',
            isResizable: true,
            type: 'Highcharts',
            tableAxisMap: {
                Food: 'x',
                'Vitamin A': 'value'
            },
            chartOptions: {
                chart: {
                    type: 'pie'
                }
            }
        }, {
            cell: 'dashboard-col-1',
            type: 'DataGrid',
            store,
            editable: true,
            sync: {
                tooltip: true
            }
        }
    ]
});
