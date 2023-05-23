
import Highcharts from '../../../../code/es-modules/masters/highcharts.src.js';
import HighchartsComponent from '../../../../code/es-modules/Extensions/DashboardPlugins/HighchartsComponent.js';
import HTMLComponent from '../../../../code/es-modules/Dashboards/Components/HTMLComponent.js';
import Component from '../../../../code/es-modules/Dashboards/Components/Component.js';
import CSVConnector from '../../../../code/es-modules/Data/Connectors/CSVConnector.js';

import Dashboards from '../../../../code/es-modules/masters/dashboards.src.js';
import PluginHandler from '../../../../code/es-modules/Dashboards/PluginHandler.js';
import HighchartsPlugin from '../../../../code/es-modules/Extensions/DashboardPlugins/HighchartsPlugin.js';
import DataGridPlugin from '../../../../code/es-modules/Extensions/DashboardPlugins/DataGridPlugin.js';

HighchartsPlugin.custom.connectHighcharts(Highcharts);
PluginHandler.addPlugin(HighchartsPlugin);
PluginHandler.addPlugin(HighchartsPlugin);
HighchartsComponent.charter = Highcharts;

const { test } = QUnit;

test('Components should be initialized with a connector', function(assert){

    const parentElement = document.getElementById('container');
    if (!parentElement) {
        return;
    }
    Dashboards.board(parentElement, {
        dataPool: {
            connectors: [{
                name: 'connector-1',
                type: 'CSV',
                options: {
                    csv: 'x,y\n1,2\n3,4\n5,6',
                    firstRowAsNames: true,
                }
            }, {
                name: 'connector-2',
                type: 'CSV',
                options: {
                    csv: `$GME,$AMC,$NOK
                    4,5,6
                    1,5,2
                    41,23,2`,
                    firstRowAsNames: true,
                }
            }]
        },
        gui: {
            layouts: [{
                rows: [{
                    cells: [{
                        id: 'cell-1'
                    }, {
                        id: 'cell-2'
                    }]
                }]
            }]
        },
        components: [{
            type: 'Highcharts',
            id: 'component-1',
            cell: 'cell-1',
            connector: {
                name: 'connector-1'
            }
        }, {
            type: 'Highcharts',
            cell: 'cell-2',
            connector: {
                name: 'connector-1'
            }
        }]
    }, true).then(board => {
        const mountedComponents = board.mountedComponents;
        // mountedComponents.forEach(mComponent => {
        //     console.log(mComponent.component)
        // });
        assert.strictEqual(board.mountedComponents.length, 2, 'There should be two mounted components.');
    });


});
