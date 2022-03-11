(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/historical/countries/no-2019/no-no-all-2019.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['no-no-1856', 10], ['no-no-1849', 11], ['no-no-1804', 12],
        ['no-no-1836', 13], ['no-no-1837', 14], ['no-no-1834', 15],
        ['no-no-1835', 16], ['no-no-1838', 17], ['no-no-1825', 18],
        ['no-no-1811', 19], ['no-no-1827', 20], ['no-no-1848', 21],
        ['no-no-1865', 22], ['no-no-1815', 23], ['no-no-1812', 24],
        ['no-no-1818', 25], ['no-no-1860', 26], ['no-no-1867', 27],
        ['no-no-1866', 28], ['no-no-1832', 29], ['no-no-1839', 30],
        ['no-no-1824', 31], ['no-no-1833', 32], ['no-no-1828', 33],
        ['no-no-1820', 34], ['no-no-1841', 35], ['no-no-1840', 36],
        ['no-no-1845', 37], ['no-no-1868', 38], ['no-no-1870', 39],
        ['no-no-1813', 40], ['no-no-1851', 41], ['no-no-1852', 42],
        ['no-no-1850', 43], ['no-no-1853', 44], ['no-no-1854', 45],
        ['no-no-1871', 46], ['no-no-1857', 47], ['no-no-1826', 48],
        ['no-no-1822', 49], ['no-no-1816', 50], ['no-no-1805', 51],
        ['no-no-1859', 52], ['no-no-1874', 53]
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
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/historical/countries/no-2019/no-no-all-2019.topo.json">Nordland (2019)</a>'
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
