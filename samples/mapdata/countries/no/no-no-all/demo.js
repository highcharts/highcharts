(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/no/no-no-all.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['no-no-1875', 10], ['no-no-1806', 11], ['no-no-1836', 12],
        ['no-no-1837', 13], ['no-no-1834', 14], ['no-no-1835', 15],
        ['no-no-1838', 16], ['no-no-1827', 17], ['no-no-1848', 18],
        ['no-no-1865', 19], ['no-no-1815', 20], ['no-no-1812', 21],
        ['no-no-1818', 22], ['no-no-1856', 23], ['no-no-1804', 24],
        ['no-no-1860', 25], ['no-no-1867', 26], ['no-no-1866', 27],
        ['no-no-1870', 28], ['no-no-1841', 29], ['no-no-1840', 30],
        ['no-no-1845', 31], ['no-no-1820', 32], ['no-no-1824', 33],
        ['no-no-1868', 34], ['no-no-1813', 35], ['no-no-1811', 36],
        ['no-no-1851', 37], ['no-no-1853', 38], ['no-no-1832', 39],
        ['no-no-1828', 40], ['no-no-1833', 41], ['no-no-1839', 42],
        ['no-no-1871', 43], ['no-no-1874', 44], ['no-no-1825', 45],
        ['no-no-1826', 46], ['no-no-1822', 47], ['no-no-1816', 48],
        ['no-no-1859', 49], ['no-no-1857', 50]
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
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/no/no-no-all.topo.json">Nordland</a>'
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
