(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/no/no-mr-all.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['no-mr-1573', 10], ['no-mr-1576', 11], ['no-mr-1566', 12],
        ['no-mr-1505', 13], ['no-mr-1560', 14], ['no-mr-1563', 15],
        ['no-mr-1554', 16], ['no-mr-1557', 17], ['no-mr-1539', 18],
        ['no-mr-1547', 19], ['no-mr-1535', 20], ['no-mr-1525', 21],
        ['no-mr-1580', 22], ['no-mr-1528', 23], ['no-mr-1532', 24],
        ['no-mr-1520', 25], ['no-mr-1511', 26], ['no-mr-1531', 27],
        ['no-mr-1517', 28], ['no-mr-1516', 29], ['no-mr-1515', 30],
        ['no-mr-1514', 31], ['no-mr-1506', 32], ['no-mr-1579', 33],
        ['no-mr-1578', 34], ['no-mr-1577', 35], ['no-mr-1508', 36]
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
            text: 'Source map: <a href="https://code.highcharts.com/mapdata/countries/no/no-mr-all.topo.json">Møre og Romsdal</a>'
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
