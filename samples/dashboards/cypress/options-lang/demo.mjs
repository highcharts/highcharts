// Bring in other forms of Highcharts
import Dashboards from '../../../../code/dashboards/es-modules/masters/dashboards.src.js';
import Highcharts from '../../../../code/es-modules/masters/highcharts.src.js';
import HighchartsPlugin from '../../../../code/dashboards/es-modules/Dashboards/Plugins/HighchartsPlugin.js';

const { PluginHandler } = Dashboards;
HighchartsPlugin.custom.connectHighcharts(Highcharts);
PluginHandler.addPlugin(HighchartsPlugin);

const norwegianEditMode = {
    editMode: 'Redigering',
    style: 'Stiler',
    id: 'Id',
    title: 'Tittel',
    caption: 'Caption',
    chartConfig: 'Graf konfigurasjoner',
    chartClassName: 'Graf klassenavn',
    chartID: 'Graf ID',
    chartOptions: 'Graf alternativer',
    chartType: 'Graf type',
    pointFormat: 'Punkt format',
    confirmDestroyRow: 'Vil du ødelegge raden?',
    confirmDestroyCell: 'Vil du ødelegge cellen?',
    confirmButton: 'Bekreft',
    cancelButton: 'Avbryt',
    viewFullscreen: 'Se fullskjerm',
    exitFullscreen: 'Lukk fullskjerm',
    on: 'på',
    off: 'av',
    settings: 'Alternativer',
    addComponent: 'Legg til komponenter',
    dataLabels: 'Data merkelapp',
    small: 'sm',
    medium: 'md',
    large: 'lg'
};

Dashboards.board('container', {
    editMode: {
        lang: norwegianEditMode,
        enabled: true,
        contextMenu: {
            items: ['editMode', 'viewFullscreen'],
            enabled: true
        }
    },
    gui: {
        layouts: [{
            id: 'layout-1',
            rows: [{
                cells: [{
                    id: 'dashboard-col-0'
                }, {
                    id: 'dashboard-col-1'
                }]
            }]
        }]
    },
    components: [{
        cell: 'dashboard-col-0',
        type: 'Highcharts',
        chartOptions: {
            series: [{
                data: [1, 2, 3]
            }]
        }
    }, {
        cell: 'dashboard-col-1',
        type: 'Highcharts',
        chartOptions: {
            series: [{
                data: [1, 2, 3]
            }]
        }
    }]
});
