import Dashboards from '../../../../code/dashboards/es-modules/masters/dashboards.src.js';
import EditMode from '../../../../code/dashboards/es-modules/masters/modules/layout.src.js';
import Highcharts from '../../../../code/es-modules/masters/highcharts.src.js';
import '../../../../code/es-modules/masters/modules/draggable-points.src.js';
import Grid from '../../../../code/grid/es-modules/masters/grid-pro.src.js';

Highcharts.win.Highcharts = Highcharts;

Dashboards.HighchartsPlugin.custom.connectHighcharts(Highcharts);
Dashboards.GridPlugin.custom.connectGrid(Grid);

Dashboards.PluginHandler.addPlugin(Dashboards.HighchartsPlugin);
Dashboards.PluginHandler.addPlugin(Dashboards.GridPlugin);

Dashboards.board(
    'container',
    {
        dataPool: {
            connectors: [
                {
                    id: 'data',
                    type: 'CSV',
                    csvURL: 'https://demo-live-data.highcharts.com/updating-set.csv'
                }
            ]
        },
        gui: {
            layouts: [
                {
                    rows: [
                        {
                            cells: [
                                {
                                    id: 'dashboard-col-1'
                                },
                                {
                                    id: 'dashboard-col-2'
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
                connector: {
                    id: 'data'
                },
                type: 'Highcharts',
                chartOptions: {
                    plotOptions: {
                        series: {
                            animation: false
                        }
                    },
                    chart: {
                        animation: false
                    }
                }
            },
            {
                renderTo: 'dashboard-col-2',
                connector: {
                    id: 'data'
                },
                type: 'Grid'
            }
        ]
    },
    true
);
