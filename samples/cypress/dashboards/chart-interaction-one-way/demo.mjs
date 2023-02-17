import CSVStore from '../../../../code/es-modules/Data/Stores/CSVStore.js';
import Board from '../../../../code/es-modules/Dashboards/Board';
import PluginHandler from '../../../../code/es-modules/Dashboards/PluginHandler.js';
import Highcharts from '../../../../code/es-modules/masters/highcharts.src.js';
import HighchartsPlugin from '../../../../code/es-modules/Extensions/DashboardPlugin/HighchartsPlugin.js';

HighchartsPlugin.custom.connectHighcharts(Highcharts);
PluginHandler.addPlugin(HighchartsPlugin);

// A shared store
const store = new CSVStore(undefined, {
  csv: `$GME,$AMC,$NOK
 4,5,6
 1,5,2
 41,23,2`,
  firstRowAsNames: true
});

store.load();

new Board('container', {
  gui: {
    enabled: true,
    layouts: [{
      id: 'layout-1',
      rows: [{
        cells: [{
          id: 'dashboard-col-0'
        }, {
          id: 'dashboard-col-1'
        }]
      }, {
        id: 'dashboard-row-1',
        style: {
          color: 'red'
        },
        cells: [{
          id: 'dashboard-col-2'
        }]
      }]
    }, {
      id: 'layout-2',
      rows: [{
        id: 'dashboard-row-2',
        cells: [{
          id: 'dashboard-col-3'
        }]
      }]
    }]
  },
  components: [{
    cell: 'dashboard-col-0',
    isResizable: true,
    type: 'Highcharts',
    chartOptions: {
      chart: {
        animation: false,
        type: 'column'
      }
    },
    store,
    sync: {
      'visibility': true,
      'tooltip': true 
    }
  }, {
    cell: 'dashboard-col-1',
    type: 'Highcharts',
    chartOptions: {
      type: 'column',
      chart: {
        animation: false
      }
    },
    store,
    sync: {
      'visibility': true,
      'tooltip': {
        handler: true,
        emitter: false
      }
    }
  }]
});

