(async () => {
    Dashboards.board('container', {
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
            chartConstructor: 'mapChart',
            chartOptions: {
                chart: {
                    styledMode: false,
                    map: await fetch(
                        'https://code.highcharts.com/mapdata/' +
                        'custom/world.topo.json'
                    ).then(response => response.json())
                },
                series: [{
                    type: 'map',
                    name: 'World Map'
                }]
            }
        }, {
            cell: 'dashboard-col-1',
            type: 'Highcharts',
            chartConstructor: 'chart',
            chartOptions: {
                series: [{
                    data: [1, 2, 3, 4]
                }]
            }
        }]
    });
})();
