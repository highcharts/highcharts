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
    connectorName: 'Connector navn',
    cancelButton: 'Avbryt',
    viewFullscreen: 'Se fullskjerm',
    exitFullscreen: 'Lukk fullskjerm',
    on: 'på',
    off: 'av',
    settings: 'Alternativer',
    addComponent: 'Legg til komponenter',
    dataLabels: 'Data merkelapp',
    small: 'Liten',
    medium: 'Medium',
    large: 'Stor'
};

Dashboards.board('container', {
    editMode: {
        lang: norwegianEditMode,
        enabled: true,
        contextMenu: {
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
                data: [1, 2, 3, 4]
            }]
        }
    }, {
        cell: 'dashboard-col-1',
        type: 'Highcharts',
        chartOptions: {
            chart: {
                type: 'bar'
            },
            series: [{
                data: [1, 2, 3, 4]
            }]
        }
    }]
});
