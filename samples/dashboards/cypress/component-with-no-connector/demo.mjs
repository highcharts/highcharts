import Dashboards from '../../../../code/dashboards/es-modules/masters/dashboards.src.js';
import Highcharts from '../../../../code/es-modules/masters/highcharts.src.js';
import Grid from '../../../../code/grid/es-modules/masters/grid-pro.src.js';

import '../../../../code/dashboards/es-modules/masters/modules/layout.src.js';

Highcharts.win.Highcharts = Highcharts;

Dashboards.HighchartsPlugin.custom.connectHighcharts(Highcharts);
Dashboards.GridPlugin.custom.connectGrid(Grid);

Dashboards.PluginHandler.addPlugin(Dashboards.HighchartsPlugin);
Dashboards.PluginHandler.addPlugin(Dashboards.GridPlugin);

Dashboards.board(
    'container',
    {
        dataPool: {},
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
                type: 'Highcharts',
                chartOptions: {
                    chart: {
                        animation: false
                    },
                    plotOptions: {
                        series: {
                            animation: false
                        }
                    }
                }
            },
            {
                renderTo: 'dashboard-col-2',
                type: 'Grid'
            }
        ]
    },
    true
).then(async dash => {
    const dataPool = dash.dataPool;

    await dataPool.loadConnector({
        id: 'updatedData',
        type: 'CSV',
        csv: `Food,Vitamin A
            Beef Liver,6421
            Lamb Liver,2122
            Cod Liver Oil,1350
            Mackerel,388
            Tuna,214`
    });

    await dash.mountedComponents[0].component.update({
        connector: {
            id: 'updatedData'
        },
        columnAssignment: {
            Food: 'x',
            'Vitamin A': 'value'
        },
        sync: {
            highlight: true
        }
    });

    await dash.mountedComponents[1].component.update({
        connector: {
            id: 'updatedData'
        },
        sync: {
            highlight: true
        }
    });
});
