(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/historical/countries/no-2019/no-tr-all-2019.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['no-tr-1943', 10], ['no-tr-1941', 11], ['no-tr-1902', 12],
        ['no-tr-1936', 13], ['no-tr-1940', 14], ['no-tr-1938', 15],
        ['no-tr-1917', 16], ['no-tr-1926', 17], ['no-tr-1923', 18],
        ['no-tr-1931', 19], ['no-tr-1925', 20], ['no-tr-1927', 21],
        ['no-tr-1929', 22], ['no-tr-1942', 23], ['no-tr-1903', 24],
        ['no-tr-1924', 25], ['no-tr-1939', 26], ['no-tr-1919', 27],
        ['no-tr-1913', 28], ['no-tr-1911', 29], ['no-tr-1920', 30],
        ['no-tr-1922', 31], ['no-tr-1928', 32], ['no-tr-1933', 33]
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
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/historical/countries/no-2019/no-tr-all-2019.topo.json">Troms (2019)</a>'
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
