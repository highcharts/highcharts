(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/historical/countries/no-2019/no-sf-all-2019.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['no-sf-1428', 10], ['no-sf-1429', 11], ['no-sf-1430', 12],
        ['no-sf-1420', 13], ['no-sf-1422', 14], ['no-sf-1445', 15],
        ['no-sf-1426', 16], ['no-sf-1424', 17], ['no-sf-1443', 18],
        ['no-sf-1418', 19], ['no-sf-1439', 20], ['no-sf-1412', 21],
        ['no-sf-1413', 22], ['no-sf-1417', 23], ['no-sf-1421', 24],
        ['no-sf-1432', 25], ['no-sf-1433', 26], ['no-sf-1431', 27],
        ['no-sf-1401', 28], ['no-sf-1441', 29], ['no-sf-1444', 30],
        ['no-sf-1449', 31], ['no-sf-1419', 32], ['no-sf-1438', 33],
        ['no-sf-1411', 34], ['no-sf-1416', 35]
    ];

    // Create the chart
    Highcharts.mapChart('container', {
        chart: {
            map: topology
        },

        title: {
            text: 'Highcharts Maps basic demo'
        },

        subtitle: {
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/historical/countries/no-2019/no-sf-all-2019.topo.json">Sogn og Fjordane (2019)</a>'
        },

        mapNavigation: {
            enabled: true,
            buttonOptions: {
                verticalAlign: 'bottom'
            }
        },

        colorAxis: {
            min: 0
        },

        series: [{
            data: data,
            name: 'Random data',
            states: {
                hover: {
                    color: '#BADA55'
                }
            },
            dataLabels: {
                enabled: true,
                format: '{point.name}'
            }
        }]
    });

})();
