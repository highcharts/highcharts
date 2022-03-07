(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/historical/countries/no-2019/no-mr-all-2019.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['no-mr-1566', 10], ['no-mr-1576', 11], ['no-mr-1554', 12],
        ['no-mr-1511', 13], ['no-mr-1526', 14], ['no-mr-1524', 15],
        ['no-mr-1525', 16], ['no-mr-1528', 17], ['no-mr-1523', 18],
        ['no-mr-1539', 19], ['no-mr-1535', 20], ['no-mr-1529', 21],
        ['no-mr-1514', 22], ['no-mr-1563', 23], ['no-mr-1502', 24],
        ['no-mr-1551', 25], ['no-mr-1531', 26], ['no-mr-1504', 27],
        ['no-mr-1505', 28], ['no-mr-1557', 29], ['no-mr-1519', 30],
        ['no-mr-1547', 31], ['no-mr-1520', 32], ['no-mr-1517', 33],
        ['no-mr-1516', 34], ['no-mr-1548', 35], ['no-mr-1545', 36],
        ['no-mr-1571', 37], ['no-mr-1515', 38], ['no-mr-1534', 39],
        ['no-mr-1532', 40], ['no-mr-1567', 41], ['no-mr-1573', 42],
        ['no-mr-1560', 43], ['no-mr-1546', 44], ['no-mr-1543', 45]
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
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/historical/countries/no-2019/no-mr-all-2019.topo.json">Møre og Romsdal (2019)</a>'
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
