(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/no/no-no-all.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['no-no-1871', 10], ['no-no-1826', 11], ['no-no-1832', 12],
        ['no-no-1833', 13], ['no-no-1840', 14], ['no-no-1841', 15],
        ['no-no-1845', 16], ['no-no-1848', 17], ['no-no-1825', 18],
        ['no-no-1811', 19], ['no-no-1812', 20], ['no-no-1813', 21],
        ['no-no-1824', 22], ['no-no-1816', 23], ['no-no-1815', 24],
        ['no-no-1820', 25], ['no-no-1822', 26], ['no-no-1827', 27],
        ['no-no-1828', 28], ['no-no-1834', 29], ['no-no-1836', 30],
        ['no-no-1874', 31], ['no-no-1859', 32], ['no-no-1860', 33],
        ['no-no-1865', 34], ['no-no-1867', 35], ['no-no-1868', 36],
        ['no-no-1870', 37], ['no-no-1857', 38], ['no-no-1866', 39],
        ['no-no-1853', 40], ['no-no-1804', 41], ['no-no-1838', 42],
        ['no-no-1839', 43], ['no-no-1837', 44], ['no-no-1851', 45],
        ['no-no-1806', 46], ['no-no-1875', 47]
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
            text: 'Source map: <a href="https://code.highcharts.com/mapdata/countries/no/no-no-all.topo.json">Nordland</a>'
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
