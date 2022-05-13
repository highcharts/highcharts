(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/historical/countries/no-2019/no-nt-all-2019.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['no-nt-1749', 10], ['no-nt-1755', 11], ['no-nt-1703', 12],
        ['no-nt-1750', 13], ['no-nt-1719', 14], ['no-nt-1748', 15],
        ['no-nt-1744', 16], ['no-nt-1718', 17], ['no-nt-1724', 18],
        ['no-nt-1702', 19], ['no-nt-1725', 20], ['no-nt-1721', 21],
        ['no-nt-1736', 22], ['no-nt-1740', 23], ['no-nt-1743', 24],
        ['no-nt-1739', 25], ['no-nt-1742', 26], ['no-nt-1714', 27],
        ['no-nt-1738', 28], ['no-nt-1711', 29], ['no-nt-1717', 30],
        ['no-nt-1756', 31], ['no-nt-1751', 32]
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
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/historical/countries/no-2019/no-nt-all-2019.topo.json">Nord-Trøndelag (2019)</a>'
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
