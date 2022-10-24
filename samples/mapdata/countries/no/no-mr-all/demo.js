(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/no/no-mr-all.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['no-mr-1554', 10], ['no-mr-1531', 11], ['no-mr-1557', 12],
        ['no-mr-1539', 13], ['no-mr-1563', 14], ['no-mr-1578', 15],
        ['no-mr-1525', 16], ['no-mr-1547', 17], ['no-mr-1577', 18],
        ['no-mr-1566', 19], ['no-mr-1528', 20], ['no-mr-1520', 21],
        ['no-mr-1517', 22], ['no-mr-1516', 23], ['no-mr-1507', 24],
        ['no-mr-1511', 25], ['no-mr-1505', 26], ['no-mr-1579', 27],
        ['no-mr-1514', 28], ['no-mr-1506', 29], ['no-mr-1515', 30],
        ['no-mr-1532', 31], ['no-mr-1576', 32], ['no-mr-1573', 33],
        ['no-mr-1560', 34], ['no-mr-1535', 35]
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
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/no/no-mr-all.topo.json">Møre og Romsdal</a>'
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
