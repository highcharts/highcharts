
import Dashboards from '../../../../code/dashboards/es-modules/masters/dashboards.src.js';
import EditMode from '../../../../code/dashboards/es-modules/masters/modules/layout.src.js';
import PluginHandler from '../../../../code/dashboards/es-modules/Dashboards/PluginHandler.js';
import Highcharts from '../../../../code/es-modules/masters/highcharts.src.js';
import HighchartsPlugin from '../../../../code/dashboards/es-modules/Dashboards/Plugins/HighchartsPlugin.js';

HighchartsPlugin.custom.connectHighcharts(Highcharts);
PluginHandler.addPlugin(HighchartsPlugin);

Dashboards.board('container', {
    editMode: {
        enabled: true,
        dragDrop: {
            enabled: false
        },
        resize: {
            enabled: false
        },
        contextMenu: {
            enabled: true
        }
    },
    gui: {
        layouts: [
            {
                rows: [{
                    cells: [{
                        id: 'dashboard-col-0'
                    }, {
                        id: 'dashboard-col-1'
                    }]
                }]
            }
        ]
    },
    components: [
        {
            renderTo: 'dashboard-col-0',
            type: 'Highcharts',
            editableOptions: [{
                isStandalone: true,
                name: 'Title',
                propertyPath: ['title'],
                type: 'input'
            }, {
                name: 'chartOptions',
                type: 'nested',
                nestedOptions: [{
                    name: 'line chart',
                    options: [{
                        name: 'Marker Radius',
                        propertyPath: [
                            'chartOptions',
                            'plotOptions',
                            'series',
                            'marker',
                            'radius'
                        ],
                        type: 'select',
                        selectOptions: [{
                            name: 3
                        }, {
                            name: 5
                        }]
                    }]
                }]
            }, {
                name: 'connectorName',
                propertyPath: ['connector', 'id'],
                type: 'select'
            }],
            chartOptions: {
                plotOptions: {
                    series: {
                        animation: false,
                        marker: {
                            radius: 10
                        },
                        events: {
                            update: function () {
                                document.getElementById('marker-radius').value =
                                    this.options.marker.radius;
                            }
                        }
                    }
                },
                chart: {
                    animation: false
                },
                series: [{
                    data: [1, 2, 1, 4]
                }]
            }
        }, {
            renderTo: 'dashboard-col-1',
            type: 'HTML',
            elements: [{
                tagName: 'h1',
                textContent: 'Placeholder text'
            }]
        }
    ]
});